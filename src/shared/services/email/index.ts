import { IMail } from "../../../shared/interfaces";
import { mailTransport } from "../../../config/mail";
import { commonTemplate } from "../../utils/templates/common";
import Env from "../../utils/envholder/env";
import logger from "../../logger";

const MailService = async (messageType: string, { email, subject, attachments, name, ...rest }: IMail) => {
    const mailOptions = {
        from: `${name || "Stashwise"}<no-reply@nomar.ng>`,
        to: email,
        subject: subject || `Stashwise.`,
        html: commonTemplate(messageType, rest),
        attachments
    };
    if (Env.get<string>('NODE_ENV') != 'test') {
        const response = await mailTransport.sendMail(mailOptions) 
        logger.info(`Sending mail :: ${response.accepted}`, 'shared.services.email');
    }
    return;
}

export default MailService;