import { MailOptions } from "../mail-config/mail-options";

export interface NotificationInterface {
    send(mailOptions: MailOptions);
}
