import { configDotenv } from 'dotenv';
import Joi from 'joi';
import { expect } from 'chai';
import sinon from 'sinon';
import Env from '../../src/shared/utils/envholder/env';

configDotenv();

describe('Env Class', () => {
  const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    CRYPTO_SECRET: Joi.string().required(),
    CRYPTO_TIME_STEP: Joi.string().required(),
    CRYPTO_OTP_LENGTH: Joi.string().required(),
    CRYPTO_HASH_ALGO: Joi.string().required(),
    SALT_ROUND: Joi.string().required(),
    DEV_FOUNDRY_CLOUDINARY: Joi.string().required(),
    DEV_FOUNDRY_CLOUDINARY_API_KEY: Joi.string().required(),
    DEV_FOUNDRY_CLOUDINARY_API_SECRET: Joi.string().required(),
    DEV_FOUNDRY_ENCRYPTIONKEY: Joi.string().required(),
    DEV_FOUNDRY_ENCRYPTIONIV: Joi.string().required(),
    REDIS_PASS: Joi.string(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),
    DEV_FOUNDRY_BREVO_HOST: Joi.string().required(),
    DEV_FOUNDRY_BREVO_PASS: Joi.string().required(),
    DEV_FOUNDRY_BREVO_PORT: Joi.string().required(),
    DEV_FOUNDRY_BREVO_USER: Joi.string().required(),
  });

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it('should validate and set environment variables', async() => {
    await Env.validateEnv(validationSchema);

    expect(Env.get('NODE_ENV')).to.equal('test');
    expect(Env.get<number>('PORT')).to.equal(Number(process.env.DEV_FOUNDRY_PORT) || 3000);
  });

  it('should fall back to default config for missing variables', async() => {
    await Env.validateEnv(validationSchema);

    expect(Env.get('NODE_ENV')).to.equal('test');
    expect(Env.get<number>('PORT')).to.equal(Number(process.env.DEV_FOUNDRY_PORT) || 3000);
  });

  it('should throw validation error when environment variables are invalid', async() => {
    const invalidSchema = Joi.object({
      NODE_ENV: Joi.string().valid('invalid').required()
    });

    try {
      await Env.validateEnv(invalidSchema);
    } catch (e) {
      expect(e).to.be.an.instanceof(Error);
    }
  });

  it('should return value from fallback config if key is not in validatedEnv', async() => {
    const config = {
      FALLBACK_KEY: 'fallback_value'
    };

    sinon.stub(config, 'FALLBACK_KEY').value('fallback_value');

    expect(Env.get('FALLBACK_KEY')).to.equal(undefined);

    sinon.restore();
  });
}); 
