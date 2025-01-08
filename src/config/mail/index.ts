/* eslint-disable no-console */
import nodemailer from "nodemailer";
import Env from "../../shared/utils/envholder/env";

const DEV_FOUNDRY_BREVO_HOST = Env.get<string>('DEV_FOUNDRY_BREVO_HOST')
const DEV_FOUNDRY_BREVO_PASS = Env.get<string>('DEV_FOUNDRY_BREVO_PASS')
const DEV_FOUNDRY_BREVO_PORT = Env.get<string>('DEV_FOUNDRY_BREVO_PORT')
const DEV_FOUNDRY_BREVO_USER = Env.get<string>('DEV_FOUNDRY_BREVO_USER')

const transportOptions = {
    host: DEV_FOUNDRY_BREVO_HOST,
    port: DEV_FOUNDRY_BREVO_PORT,
    // secure: true,
    auth: {
      user: DEV_FOUNDRY_BREVO_USER,
      pass: DEV_FOUNDRY_BREVO_PASS
    }
}

export const mailTransport = nodemailer.createTransport(transportOptions as any);
