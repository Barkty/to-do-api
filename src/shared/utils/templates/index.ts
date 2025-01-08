import * as emailTemplate from './template';

const getTemplate = (type: string, data: any) => {
    switch (type) {
      case 'signup': return emailTemplate.signup(data);
      case 'login': return emailTemplate.login(data);
      case 'forgot_password': return emailTemplate.forgot_password(data);
      case 'resend_otp': return emailTemplate.resend_otp(data);
    //   case 'card_renewal': return emailTemplate.card_renewal(data);
      default: return '';
    }
  };
  
  export default getTemplate;