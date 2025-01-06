import { configDotenv } from 'dotenv';
configDotenv();

const production = {
    NODE_ENV: process.env.STASHWISE_NODE_ENV,
    PORT: process.env.STASHWISE_PORT,
    SALT_ROUND: process.env.STASHWISE_SALT_ROUND,
    CRYPTO_OTP_LENGTH: process.env.STASHWISE_CRYPTO_OTP_LENGTH,
    DATABASE_URL: process.env.STASHWISE_PROD_DATABASE_URL,
    DATABASE_NAME: process.env.STASHWISE_PROD_DATABASE_NAME,
    CRYPTO_SECRET: process.env.STASHWISE_PROD_CRYPTO_SECRET,
    CRYPTO_TIME_STEP: process.env.STASHWISE_PROD_CRYPTO_TIME_STEP,
    CRYPTO_HASH_ALGO: process.env.STASHWISE_PROD_CRYPTO_HASH_ALGO,
}

export default production;