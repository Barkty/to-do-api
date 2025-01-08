import * as Dtos from './dto';
import * as Message from '../../shared/enums/message';
import * as ApiResponse from '../../shared/response';
import * as Helpers from '../../shared/helpers';
import * as activityDescription from '../../shared/enums/monitor.description';
import AuthService from './services';
import { fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import logger from '../../shared/logger';
import { handleCustomError, BadException, UnAuthorizedException, NotFoundException, ForbiddenException, ConflictException } from '../../shared/errors';

export class AuthController {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Verify a user's email'
    public verifyRegisterEmail: fnRequest = async(req, res) => {
        const { body } = req;
        const payload = new Dtos.VerifyEmailDto(body);

        // check if user exists
        const user = await AuthService.verifySignUpEmail(payload);

        if (user instanceof BadException) {
            logger.info(`${payload.email}: email already exists in the DB`, 'verifyRegisterEmail.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed sign up verify account', activityDescription.userSignUpRequestFailed(), 'authentication');
            return handleCustomError(res, user, StatusCodes.BAD_REQUEST);
        }
        
        await Helpers.activityTracking('success', 'read', 'Sign up verify account', activityDescription.userSignUpRequest(), 'authentication');
        // send response
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.RESOURCE_MESSAGE('Account verification initiated successfully'),
            user
        );
    }

    // #swagger.tags = ['Auth']
    public verifyOtp: fnRequest = async(req, res) => {
        const { body, path } = req;
        const payload = new Dtos.VerifyOtpDto(body);
        const type = path.includes('signup') ? 'signup' : 'forgot_password';

        const resp = await AuthService.verifySignUpOtp(payload, type);

        if (resp instanceof UnAuthorizedException) {
            logger.info(`${payload.email}: otp sent incorrect or expired`, 'verifyotp.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to verify otp', activityDescription.userVerifyOtpFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.UNAUTHORIZED);
        }

        const { email, hash } = resp

        res.setHeader('hash-id-key', hash);
        logger.info(`${email} verified OTP successfully`, 'verifyOtp.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'read', 'Verify otp successfully', activityDescription.userVerifyOtp(), 'authentication');

        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.OPERATION_SUCCESSFUL('Verify Otp'),
            { email }
        );
    }

    // #swagger.tags = ['Auth']
    public createAccount: fnRequest = async (req, res) => {
        const { body } = req;
        const payload = new Dtos.UserDto(body);
        const hash = req.get('hash-id-key');

        const resp = await AuthService.createAccount(payload, hash as string)

        if (resp instanceof UnAuthorizedException) {
            await Helpers.activityTracking('fail', 'create', 'Failed to create account', activityDescription.userCreateAccountFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.UNAUTHORIZED);
        }
        
        if (resp instanceof BadException) {
            await Helpers.activityTracking('fail', 'create', 'Failed to create account', activityDescription.userCreateAccountFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST);
        }

        const { user } = resp

        logger.info(`${user.email} created account successfully`, 'createAccount.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'create', 'Created stashwise account successfully', activityDescription.userCreateAccount(), 'authentication');

        return ApiResponse.success(
            res,
            StatusCodes.CREATED,
            Message.CREATED_DATA_SUCCESSFULLY('Stashwise account'),
            resp
        );
    }

    // #swagger.tags = ['Auth']
    public login: fnRequest = async (req, res) => {
        const { body } = req;
        const payload = new Dtos.LoginDto(body);

        const resp = await AuthService.login(payload);

        if (resp instanceof NotFoundException) {
            logger.info(`${payload.email} could not find user in the DB`, 'login.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to login user', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.NOT_FOUND)
        }
        
        if (resp instanceof BadException) {
            logger.info(`${payload.email} put in invalid login credentials`, 'login.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to login user', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.BAD_REQUEST)
        }
        
        if (resp instanceof ForbiddenException) {
            logger.info(`${payload.email} maxed password retry count`, 'login.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to login user', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.FORBIDDEN)
        }
        
        if (resp instanceof ConflictException) {
            logger.info(`${payload.email} logged in from a new device`, 'login.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Login on a new device', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.CONFLICT)
        }

        logger.info(`${payload.email} logged in successfully`, 'login.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'read', 'Logged in stashwise user successfully', activityDescription.userLogin(), 'authentication', resp.user._id);

        const { user: { password, ...rest }, access_token, refresh_token } = resp
        
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.OPERATION_SUCCESSFUL('Login'),
            { user: rest, access_token, refresh_token }
        );

    }
   
    public verifyLogin: fnRequest = async (req, res) => {
        const { body } = req;
        const payload = new Dtos.VerifyDeviceDto(body);

        const resp = await AuthService.verifyLogin(payload);
        
        if (resp instanceof UnAuthorizedException) {
            logger.info(`${payload.email} could not verify pin`, 'verifyLogin.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to login user', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.UNAUTHORIZED)
        }

        if (resp instanceof NotFoundException) {
            logger.info(`${payload.email} could not find user in the DB`, 'verifyLogin.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to login user', activityDescription.userLoginFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.NOT_FOUND)
        }

        logger.info(`${payload.email} logged in on new device successfully`, 'verifyLogin.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'read', 'Logged in stashwise user successfully', activityDescription.userLogin(), 'authentication', resp.user._id);

        const { user: { password, ...rest }, access_token, refresh_token } = resp

        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.OPERATION_SUCCESSFUL('Login'),
            { user: rest, access_token, refresh_token }
        );

    }

    public forgotPassword: fnRequest = async(req, res) => {
        const { body } = req;
        const payload = new Dtos.VerifyEmailDto(body);

        // check if user exists
        const user = await AuthService.forgotPassword(payload);

        if (user instanceof NotFoundException) {
            logger.info(`${payload.email}: does not exist in the DB`, 'forgotPassword.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to verify email', activityDescription.userForgotPasswordRequestFailed(), 'authentication');
            return handleCustomError(res, user, StatusCodes.NOT_FOUND);
        }
        
        await Helpers.activityTracking('success', 'read', 'Recover account', activityDescription.userForgotPasswordRequest(), 'authentication');
        // send response
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.PASSWORD_RESET_MAIL_SENT(payload.email),
            user
        );
    }

    public resetPassword: fnRequest = async(req, res) => {
        const { body } = req;
        const payload = new Dtos.ResetPasswordDto(body);
        const hash = req.get('hash-id-key');

        const resp = await AuthService.resetPassword(payload, hash as string);

        if (resp instanceof UnAuthorizedException) {
            logger.info(`${hash}: could not change password`, 'resetPassword.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'update', 'Failed to reset password', activityDescription.userResetPasswordFailed(), 'authentication');
            return handleCustomError(res, resp, StatusCodes.UNAUTHORIZED);
        }

        logger.info(`${hash} reset password successfully`, 'resetPassword.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'update', 'Reset password successfully', activityDescription.userResetPassword(), 'authentication');

        return ApiResponse.success(
            res,
            StatusCodes.NO_CONTENT,
            Message.UPDATED_DATA_SUCCESSFULLY('user password')
        );
    }

    public fetchProfile: fnRequest = async (req, res) => {
        const { user } = req;
        // @ts-ignore
        delete user.password;

        logger.info(`${user._id} fetched profile details in the DB`, 'fetchProfile.authentication.controllers.ts');
        await Helpers.activityTracking('success', 'read', 'Fetch stashwise user profile successfully', activityDescription.userProfileDetails(`'${user.email}'`), 'authentication');

        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.FETCHED_DATA_SUCCESSFULLY('Stashwise user profile'),
            user
        );
    }

    public resendOtp: fnRequest = async(req, res) => {
        const { body } = req;
        const payload = new Dtos.VerifyEmailDto(body);

        // check if user exists
        const user = await AuthService.resendOtp(payload);

        if (user instanceof NotFoundException) {
            logger.info(`${payload.email}: does not exist in the DB`, 'resendOtp.authentication.controllers.ts');
            await Helpers.activityTracking('fail', 'read', 'Failed to verify email', activityDescription.userForgotPasswordRequestFailed(), 'authentication');
            return handleCustomError(res, user, StatusCodes.NOT_FOUND);
        }
        
        await Helpers.activityTracking('success', 'read', 'Resend OTP', activityDescription.userForgotPasswordRequest(), 'authentication');
        // send response
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.PASSWORD_RESET_MAIL_SENT(payload.email),
            user
        );
    }
    
    public resendOtpSignUp: fnRequest = async(req, res) => {
        const { body } = req;
        const payload = new Dtos.VerifyEmailDto(body);

        // check if user exists
        const user = await AuthService.resendOtpSignUp(payload);
        
        await Helpers.activityTracking('success', 'read', 'Resend OTP', activityDescription.userForgotPasswordRequest(), 'authentication');
        // send response
        return ApiResponse.success(
            res,
            StatusCodes.OK,
            Message.PASSWORD_RESET_MAIL_SENT(payload.email),
            user
        );
    }
}

const authController = new AuthController();

export default authController;