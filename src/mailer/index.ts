import { MailBody } from '../shared/types/mailer';
import { mockTransporter, transporter } from '../config/mailer';

export const sendEmail = async (mailBody: MailBody): Promise<void> => {
  return transporter.sendMail(mailBody);
};

export const sendTestEmail = async (mailBody: MailBody): Promise<void> => {
  return mockTransporter.sendMail(mailBody);
};
