import { config } from "dotenv";
import hashingService from '../services/hashing/hashing.service';
import Env from '../utils/envholder/env';
import redisService, { redisReturnVal } from '../services/redis';
import { UnAuthorizedException } from '../errors';
import logger from '../logger';
import auditServices from '../../modules/audit/services';

config()

type ParamsType = {
    action: string,
    id: string | null,
    expiry?: number,
    identifierType: 'hash' | 'otp',
    value?: string | number,
};
  
export async function generateOtpOrHash(params: ParamsType) {
    const otpOrHash =
      params.identifierType === 'hash'
        ? hashingService.generateVerificationHash()
        : hashingService.generateTOTP();
  
    const key = `${otpOrHash}_${params.action}`;
  
    await redisService.delFromRedis(key);
  
    await redisService.addToRedis({
      key: key,
      value: params.value || otpOrHash,
      expiresIn: params.expiry
    });
  
    if (
      Env.get<string>('NODE_ENV') === 'test' ||
      Env.get<string>('NODE_ENV') == 'development'
    ) {
      process.env.OTP_OR_HASH = otpOrHash;
    }
  
    return otpOrHash;
}
  
export async function verifyOtpOrHash(
    id: string,
    verificationCode: string,
    type: 'OTP' | 'hash'
  ): Promise<redisReturnVal | UnAuthorizedException> {
    const resp = await redisService.getFromRedis(id);
  
    if (!resp && type === 'hash') {
      return new UnAuthorizedException('Invalid or expired hash');
    }
  
    if (type === 'OTP' && resp !== verificationCode) {
      return new UnAuthorizedException('Invalid or expired OTP');
    }
  
    await redisService.delFromRedis(id);
  
    return resp;
}

export const activityTracking = async(
    status: 'success' | 'fail',
    activity_type: 'create' | 'update' | 'delete' | 'read',
    name: string,
    description: string,
    module: string,
    user_id?: string,
    admin_id?: string
  ) => {
    try {
      const activity: any = { description, admin_id, user_id, status, activity_type, name, module };
  
      await auditServices.createAuditLog(activity);
      logger.info(`${admin_id}: ${name}, Activity tracked successfully`, 'activityTracking.shared.helpers');
    } catch (error) {
      logger.error(error);
      logger.error(`${admin_id}: ${name}, Activity not tracked`, 'activityTracking.shared.helpers');
    }
}