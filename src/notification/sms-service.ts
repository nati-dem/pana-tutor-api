
import { NotificationOptions } from "./notification-options";
import { AbstractObserver } from "./abstract-observer";

export class SmsService extends AbstractObserver {

    public update(options: NotificationOptions): void {
      // throw new Error("Method not implemented.");
      console.log('sending sms to:', options.phone_num )
    }

}
