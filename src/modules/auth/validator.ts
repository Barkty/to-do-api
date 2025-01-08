import Joi from 'joi';

const passwordSchema = Joi.string()
  .pattern(/^(?=.*[a-z])/, { name: 'lowercase' })
  .pattern(/^(?=.*[A-Z])/, { name: 'uppercase' })
  .pattern(/^(?=.*\d)/, { name: 'digit' })
  .pattern(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { name: 'special' })
  .pattern(/^(?!.*\s)/, { name: 'no_whitespace' })
  .min(8)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.lowercase': 'Password must contain at least one lowercase letter',
    'string.pattern.uppercase': 'Password must contain at least one uppercase letter',
    'string.pattern.digit': 'Password must contain at least one numeric digit',
    'string.pattern.special': 'Password must contain at least one special character',
    'string.pattern.no_whitespace': 'Password must not contain any whitespace',
    'string.empty': 'Password is not allowed to be empty'
  }).label('Password').required();

export const loginSchema = Joi.object({
  email: Joi.string().email().label('Email').required(),
  password: passwordSchema,
  fcm_token: Joi.string().label('Device Token').trim()
});
  
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().label('Email').required(),
  otp: Joi.string().label('Otp').length(6).required()
});

export const verifyDeviceSchema = Joi.object({
  email: Joi.string().email().label('Email').required(),
  otp: Joi.string().label('Otp').length(6).required(),
  fcm_token: Joi.string().label('Device Token').trim() // change back to required after moving to app fully
});

export const resetPasswordSchema = Joi.object({
  password: passwordSchema
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().label('Email').required()
});

export const createUserSchema = Joi.object({
  first_name: Joi.string().label('First Name').min(3).required(),
  last_name: Joi.string().label('First Name').min(3).required(),
  username: Joi.string().label('Username').min(3).required(),
  password: passwordSchema,
  phone: Joi.string().label('Phone').min(11).required()
})
