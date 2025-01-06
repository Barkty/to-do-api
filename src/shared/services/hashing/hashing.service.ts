import Env from "../../utils/envholder/env"
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { AES, enc } from "crypto-js";
import { addHours, addMonths } from 'date-fns';
import { AuthSigning } from "../../interfaces";
import { UnAuthorizedException } from "../../../shared/errors";

export interface HashingService {
  generateHashString(data: string, salt?: string): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
  genSalt(rounds: number): Promise<string>;
  generateVerificationHash(): string;
  generateTOTP(): string;
  generatePassword(length: number): string;
  decrytData(data: string): string;
  encryptData(data: string): string;
  encryptDataWithCryptoJs(data: string): string;
  decryptDataWithCryptoJs(data: string): Promise<string>;
  authenticate(data: any): AuthSigning;
}

export class HashingServiceImpl implements HashingService {
  private readonly cryptoSecret: string = Env.get<string>('CRYPTO_SECRET');
  private readonly timeStep: number = Env.get<number>('CRYPTO_TIME_STEP');
  private readonly otpLength: number = Env.get<number>('CRYPTO_OTP_LENGTH');
  private readonly hashAlgorithm: string = Env.get<string>('CRYPTO_HASH_ALGO');
  private readonly saltRound: number = Number(Env.get<number>('SALT_ROUND')); 
  private readonly ENCRYPTIONKEY: string = Env.get<string>('STASHWISE_ENCRYPTIONKEY');
  private readonly ENCRYPTIONIV: string = Env.get<string>('STASHWISE_ENCRYPTIONIV');
  
  public async genSalt(rounds: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }


  public async generateHashString(
    data: string,
    salt = bcrypt.genSaltSync(this.saltRound)
  ): Promise<string> {
    const hashed = await bcrypt.hash(data, salt);
    return hashed;
  }

  public async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  public generateTOTP(): string {
    const currentTime = Math.floor(Date.now() / 1000);
    const counter = Math.floor(currentTime / this.timeStep);

    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(counter, 4);

    const hmac = crypto
      .createHmac(this.hashAlgorithm, this.cryptoSecret)
      .update(counterBuffer)
      .digest();

    const offset = hmac[hmac.length - 1] & 0x0f;

    const otpBytes = new Uint8Array(hmac.buffer, hmac.byteOffset + offset, 4);

    const otpValue =
      new DataView(
        otpBytes.buffer,
        otpBytes.byteOffset,
        otpBytes.byteLength
      ).getUint32(0, false) % Math.pow(10, this.otpLength);

    return otpValue.toString().padStart(this.otpLength, '0');
  }

  public generateVerificationHash(): string {
    return uuidv4();
  }

  public generatePassword(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  public authenticate = (params: any): AuthSigning => {
    const tokenExpiresInADay = addHours(new Date(), 24);
    const tokenExpiresInMonths = addMonths(new Date(), 6);
    const access_token = this.encryptDataWithCryptoJs(
      JSON.stringify({ ...params, time: tokenExpiresInADay, expiresAt: 24 }),
    );
    const refresh_token = this.encryptDataWithCryptoJs(
      JSON.stringify({ ...params, time: tokenExpiresInMonths, expiresAt: '6months' }),
    );
    return { access_token, refresh_token };
  };

  public decrytData = (message: string): string => {
    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      Buffer.from(String(this.ENCRYPTIONKEY)).subarray(0, 16),
      Buffer.from(this.ENCRYPTIONIV as string, "hex")
    );
    let decryptedMessage = decipher.update(Buffer.from(message, "hex"));
    decryptedMessage = Buffer.concat([decryptedMessage, decipher.final()]);
    return decryptedMessage.toString();
  };
  
  public encryptData = (message: string) => {
    let result;
    try {
      const cipher = crypto.createCipheriv(
        "aes-128-cbc",
        Buffer.from(String(this.ENCRYPTIONKEY)).subarray(0, 16),
        Buffer.from(this.ENCRYPTIONIV as string, "hex")
      );
      let encryptedMessage = cipher.update(message);
      encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()]);
      result = encryptedMessage.toString("hex");
    } catch (error) {
      result = "";
    }
    return result;
  };

  public encryptDataWithCryptoJs = (message: string) => {
    const encrypts = AES.encrypt(message, this.ENCRYPTIONKEY).toString();
    return encrypts;
  };

  public async decryptDataWithCryptoJs(message: string): Promise<string> {
    const TIMEOUT_MS = 10;
    
    const controller = new AbortController();
    const { signal } = controller;
  
    // Promise for decryption logic
    const decryptionPromise = new Promise<string>((resolve, reject) => {
      try {
        // Simulate asynchronous decryption (e.g., if your logic were async)
        const decrypts = AES.decrypt(message, this.ENCRYPTIONKEY).toString(enc.Utf8);
        if (!decrypts) {
          reject(new UnAuthorizedException());
        }
        resolve(decrypts); // Resolve if decryption succeeds
      } catch (error) {
        reject(new UnAuthorizedException());
      }
    });
  
    // Timeout handling via AbortController
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
    try {
      // Return the decryption result, race between timeout and decryption
      const result = await Promise.race([
        decryptionPromise,
        new Promise<string>((_, reject) =>
          signal.addEventListener('abort', () => reject(new UnAuthorizedException()))
        )
      ]);
  
      return result;
    } catch (error) {
      if (error instanceof UnAuthorizedException) {
        return '';
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

const hashingService: HashingService = new HashingServiceImpl();

export default hashingService;
