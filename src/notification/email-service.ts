import { Inject } from "typescript-ioc";
import { TransporterFactory } from "../mail-config/transporter-factory";
import { NotificationOptions } from "./notification-options";
import { AbstractObserver } from "./abstract-observer";

export class EmailService extends AbstractObserver {

    @Inject
    transporterFactory: TransporterFactory

    public EmailService(){
   }

    send = async (options: NotificationOptions) => {

      const transporter = this.transporterFactory.getTransporter();

      console.log('sending email to:: ', options.to)

      transporter.sendMail(options, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
      });

    }

    public update(options: NotificationOptions): void {
      this.send(options);
    }

}
