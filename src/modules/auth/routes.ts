import { Router } from 'express';
import * as authValidator from './validator';
import authController from './controller';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { validateDataMiddleware } from '../../shared/middlewares/request-body-validator.middleware';
import * as AuthenticationMidddlware from '../../shared/middlewares/auth.middleware';
import * as CommonMiddleware from '../../shared/middlewares/common.middleware';

const authRouter = Router();

authRouter.use(CommonMiddleware.computeUserDevice)

authRouter.post(
    '/verify-email',
    validateDataMiddleware(authValidator.verifyEmailSchema, 'payload'),
    WatchAsyncController(authController.verifyRegisterEmail)
)

authRouter.post(
    '/verify-signup-otp',
    validateDataMiddleware(authValidator.verifyOtpSchema, 'payload'),
    WatchAsyncController(authController.verifyOtp)
)

authRouter.post(
    '/signup',
    validateDataMiddleware(authValidator.createUserSchema, 'payload'),
    WatchAsyncController(authController.createAccount)
)

authRouter.post(
    '/login',
    validateDataMiddleware(authValidator.loginSchema, 'payload'),
    WatchAsyncController(authController.login)
)

authRouter.post(
    '/verify-login',
    validateDataMiddleware(authValidator.verifyDeviceSchema, 'payload'),
    WatchAsyncController(authController.verifyLogin)
)

authRouter.post(
    '/forgot-password',
    validateDataMiddleware(authValidator.verifyEmailSchema, 'payload'),
    WatchAsyncController(authController.forgotPassword)
)

authRouter.post(
    '/verify-otp',
    validateDataMiddleware(authValidator.verifyOtpSchema, 'payload'),
    WatchAsyncController(authController.verifyOtp)
)

authRouter.post(
    '/reset-password',
    validateDataMiddleware(authValidator.resetPasswordSchema, 'payload'),
    WatchAsyncController(authController.resetPassword)
)

authRouter.get(
    '/profile',
    AuthenticationMidddlware.verifyAuthTokenMiddleware,
    WatchAsyncController(authController.fetchProfile)
)

authRouter.post(
    '/resend-otp',
    validateDataMiddleware(authValidator.verifyEmailSchema, 'payload'),
    WatchAsyncController(authController.resendOtp)
)

authRouter.post(
    '/resend-otp-signup',
    validateDataMiddleware(authValidator.verifyEmailSchema, 'payload'),
    WatchAsyncController(authController.resendOtpSignUp)
)

export default authRouter;