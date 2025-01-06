import { BaseEntity } from '../../shared/utils/entities/base-entity';

export class LoginDto extends BaseEntity<LoginDto> {
    email: string;
    password: string;
    fcm_token: string;
}

export class VerifyEmailDto extends BaseEntity<VerifyEmailDto> {
    email: string;
}

export class ForgotPasswordDto extends BaseEntity<ForgotPasswordDto> {
    email: string;
    type: string;
}
  
export class VerifyOtpDto extends BaseEntity<VerifyOtpDto> {
    email: string;
    otp: string;
}
export class VerifyDeviceDto extends BaseEntity<VerifyDeviceDto> {
    email: string;
    otp: string;
    fcm_token: string;
}

export class UserDto extends BaseEntity<UserDto> {
    first_name: string;
    last_name: string;
    username: string;
    source: string;
    password: string;
    referral_code: string;
    phone: string;
    fcm_token: string;
}

export class SecurePinDto extends BaseEntity<SecurePinDto> {
    pin: string
}

export class ResetPasswordDto extends BaseEntity<ResetPasswordDto> {
    password: string
}