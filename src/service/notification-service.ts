import { Inject } from "typescript-ioc";
import { TransporterFactory } from "../mail-config/transporter-factory";
import { NotificationInterface } from "../notification/notification.interface";
import { MailOptions } from "../mail-config/mail-options";

export class NotificationService implements NotificationInterface {

    @Inject
    transporterFactory: TransporterFactory

    send = async (mailOptions: MailOptions) => {

      const transporter = this.transporterFactory.getTransporter();

      console.log('sending email..')

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      });

    }

}
