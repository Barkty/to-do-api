interface DefaultAttributes {
    _id: string;
    createdAt: string;
    updatedAt: string;
}
  
export interface AuthSigning {
    access_token: string;
    refresh_token: string
}
  
export interface SignedData {
    _id: string;
    email: string;
    time: Date;
    expiresAt: any
}

export interface IUser extends DefaultAttributes {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    phone: string,
    avatar?: string,
    status?: string,
    gender?: 'Female' | 'Male',
    date_of_birth?: Date,
    is_verified_email: boolean,
    is_completed_onboarding_kyc: boolean,
    is_deleted: boolean,
    last_login?: Date,
    date_deleted?: Date,
    last_failed_attempt?: Date,
    passwordRetryCount: number,
    passwordRetryMinutes: number,
}