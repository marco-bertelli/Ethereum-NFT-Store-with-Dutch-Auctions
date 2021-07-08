import MailSender from '@becodebg/odin-services-mailsender';

import { sendgridKey, defaultEmail } from '../../config';

const mailSender = new MailSender({
  sendGridKey: sendgridKey,
  defaultEmail
});

export default mailSender;
