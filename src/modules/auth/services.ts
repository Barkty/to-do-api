import { BadException, ForbiddenException, NotFoundException, UnAuthorizedException } from '../../shared/errors';
import * as Message from "../../shared/enums/message"
import hashingService, { HashingService } from '../../shared/services/hashing/hashing.service';
import authRepository, { AuthRepository } from './repositories';
import { generateOtpOrHash, verifyOtpOrHash } from '../../shared/helpers';
import MailService from "../../shared/services/email";
import * as authParams from "./dto";
import { IUser } from '../../shared/interfaces';
import { AuthUser, VerifyOTP } from '../../shared/types';

export interface AuthService {
    verifySignUpEmail(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | BadException>;
    forgotPassword(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | NotFoundException>;
    resendOtp(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | NotFoundException>;
    resendOtpSignUp(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | NotFoundException>;
    getUserByEmailOrId(param: string): Promise<IUser | NotFoundException>;
    verifySignUpOtp(param: authParams.VerifyOtpDto, type: string): Promise<VerifyOTP | UnAuthorizedException>;
    createAccount(param: authParams.UserDto, hash: string): Promise<Partial<AuthUser> | UnAuthorizedException>;
    resetPassword(param: authParams.ResetPasswordDto, hash: string): Promise<Partial<IUser>  | UnAuthorizedException>;
    verifyLogin(pin: authParams.VerifyDeviceDto): Promise<AuthUser | NotFoundException | UnAuthorizedException>;
    login(param: authParams.LoginDto): Promise<AuthUser | NotFoundException | BadException | ForbiddenException>;
    fetchProfile(param: string): Promise<IUser>
}

export class AuthServiceImpl implements AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly authRepository: AuthRepository
    ) { }

    private calculateRemainingLockoutTime(lastFailedAttempt: Date = new Date(), lockoutMinutes: number = 15): number {
        const now = new Date();
        const lockoutTime = lockoutMinutes * 60 * 1000; // Convert minutes to milliseconds
        const elapsedTime = now.getTime() - lastFailedAttempt.getTime();
        
        if (elapsedTime >= lockoutTime) {
            return 0; // Lockout period has expired
        }
    
        const remainingTime = lockoutTime - elapsedTime;
        return Math.ceil(remainingTime / (60 * 1000)); // Convert milliseconds back to minutes and round up
    }

    public async getUserByEmailOrId(param: string): Promise<IUser | NotFoundException> {
        const user = await this.authRepository.getOne(param)

        if (!user) return new NotFoundException(Message.RESOURCE_DOES_NOT_EXIST('user'))
        
        return user;
    }

    public async verifySignUpEmail(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | BadException> {
        const user = await this.getUserByEmailOrId(param.email)

        if (!(user instanceof NotFoundException)) return new BadException(Message.RESOURCE_ALREADY_EXISTS('user'))

        const otp = await generateOtpOrHash({
            action: 'signup',
            id: param.email,
            expiry: 600,
            identifierType: 'otp'
        });

        await MailService('verify_signup', {
            first_name: 'Champ',
            email: param.email,
            subject: 'Account Verification Code',
            data: {
                otp, 
                expireTime: 10
            }
        });

        return param;
    }
    
    public async forgotPassword(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | BadException> {
        const user = await this.getUserByEmailOrId(param.email)

        if (user instanceof NotFoundException) return user;

        const otp = await generateOtpOrHash({
            action: 'forgot_password',
            id: param.email,
            expiry: 300,
            identifierType: 'otp'
        });

        await MailService('forgot_password', {
            first_name: user.first_name as string,
            email: param.email,
            subject: 'Reset Password',
            data: {
                otp, 
                expireTime: 5
            }
        });

        return param;
    }

    public async verifySignUpOtp(args: authParams.VerifyOtpDto, type: string): Promise<VerifyOTP | UnAuthorizedException> {
        const resp = await verifyOtpOrHash(`${args.otp}_${type}`, args.otp, 'OTP');

        if (resp instanceof UnAuthorizedException) {
          return resp;
        }

        const hash = await generateOtpOrHash({
            action: 'verify_token',
            id: args.email,
            expiry: 900,
            identifierType: 'hash',
            value: args.email
        });
      
        return { email: args.email, hash };
    }

    public async createAccount(args: authParams.UserDto, hash: string): Promise<AuthUser | UnAuthorizedException | BadException> {
        const resp = await verifyOtpOrHash(`${hash}_verify_token`, hash, 'hash');

        if (resp instanceof UnAuthorizedException) {
          return resp;
        }

        const found = await this.authRepository.getOne(args.phone)

        if (found) return new BadException(Message.RESOURCE_ALREADY_EXISTS('phone number'))

        const hashedPass = await this.hashingService.generateHashString(args.password);

        const user = await this.authRepository.create({ 
            ...args, 
            email: resp as string,
            password: hashedPass, 
            is_verified_email: true, 
            passwordRetryCount: 3,
            is_deleted: false
        }) as IUser;

        const { access_token } = this.hashingService.authenticate({ _id: user?._id, email: user?.email });

        await MailService('signup', {
            first_name: user.first_name as string,
            email: user.email,
            subject: 'Welcome',
        });

        //@ts-ignore
        delete user?.password

        return { user, access_token };
    }

    public async resetPassword(args: authParams.ResetPasswordDto, hash: string): Promise<Partial<IUser> | UnAuthorizedException> {
        const resp = await verifyOtpOrHash(`${hash}_verify_token`, hash, 'hash');

        if (resp instanceof UnAuthorizedException) {
          return resp;
        }

        const hashedPass = await this.hashingService.generateHashString(args.password);

        const user = await this.authRepository.getOne(resp as string);

        const updatedUser = await this.authRepository.update({ _id: user?._id, password: hashedPass }) as IUser;

        return updatedUser;
    }

    public async login(param: authParams.LoginDto): Promise<AuthUser | NotFoundException | BadException | ForbiddenException> {
        // verify user exists
        let user = await this.authRepository.getOne(param.email);

        if (!user) {
            return new NotFoundException(Message.RESOURCE_NOT_FOUND('User'))
        }

        // check password retry count
        if (user.passwordRetryCount as number <= 0) {
            const timeLeft = this.calculateRemainingLockoutTime(user.last_failed_attempt as Date, user.passwordRetryMinutes)
            if (timeLeft === 0) {
                user = await this.authRepository.update({ _id: user._id, passwordRetryMinutes: 15, passwordRetryCount: 3, last_failed_attempt: new Date() }) as IUser;
            } else {
                user = await this.authRepository.update({ _id: user._id, passwordRetryMinutes: timeLeft, last_failed_attempt: new Date() });
            }
            return new ForbiddenException(Message.RESOURCE_MESSAGE(`You have ${user?.passwordRetryCount} attempts left. Try again in ${timeLeft}mins.`))
        }

        // compare password
        const isPassword = await this.hashingService.compare(param.password, user.password as string);

        if (!isPassword) {
            user = await this.authRepository.update({ _id: user._id, passwordRetryCount: user.passwordRetryCount as number - 1 });
            return new BadException(Message.RESOURCE_MESSAGE(`Invalid login credentials. You have ${user?.passwordRetryCount} attempts left`));
        }

        if (user.passwordRetryCount as number < 3) await this.authRepository.update({ _id: user._id, passwordRetryCount: 3, last_login: new Date() });

        // generate token
        const { access_token, refresh_token } = this.hashingService.authenticate({ _id: user._id, email: user.email });

        //@ts-ignore
        delete user?.password;

        return { user, access_token, refresh_token }
    }
   
    public async verifyLogin(args: authParams.VerifyDeviceDto): Promise<AuthUser | NotFoundException | UnAuthorizedException> {
        // compare otp
        const resp = await verifyOtpOrHash(`${args.otp}_login`, args.otp, 'OTP');

        if (resp instanceof UnAuthorizedException) {
            return resp;
        }

        const user = await this.getUserByEmailOrId(args.email)

        if (user instanceof NotFoundException) {
            return user;
        }

        // generate token
        const { access_token, refresh_token } = this.hashingService.authenticate({ _id: user._id, email: user.email });

        //@ts-ignore
        delete user?.password

        return { user, access_token, refresh_token }
    }

    public async resendOtp(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | BadException> {
        const user = await this.getUserByEmailOrId(param.email);

        if (user instanceof NotFoundException) return user;

        const otp = await generateOtpOrHash({
            action: 'resend_otp',
            id: param.email,
            expiry: 300,
            identifierType: 'otp'
        });

        await MailService('resend_otp', {
            first_name: user.first_name as string,
            email: param.email,
            subject: 'Resend OTP',
            data: {
                otp, 
                expireTime: 5
            }
        });

        return param;
    }
    
    public async resendOtpSignUp(param: authParams.VerifyEmailDto): Promise<authParams.VerifyEmailDto | BadException> {

        const otp = await generateOtpOrHash({
            action: 'resend_otp',
            id: param.email,
            expiry: 300,
            identifierType: 'otp'
        });

        await MailService('resend_otp', {
            first_name: "Champ",
            email: param.email,
            subject: 'Resend OTP',
            data: {
                otp, 
                expireTime: 5
            }
        });

        return param;
    }

    public async fetchProfile(param: string): Promise<IUser> {
        const user = await this.authRepository.getOne(param) as IUser;

        return user
    }
}

const AuthService = new AuthServiceImpl(hashingService, authRepository);

export default AuthService;
