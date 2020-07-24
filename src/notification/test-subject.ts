import { AbstractObserver } from "./abstract-observer";
import { NotificationOptions } from "./notification-options";
import { AbstractSubject } from "./abstract-subject";
import { Container, ObjectFactory } from "typescript-ioc";
import { EmailService } from "./email-service";
import { UserSignupMailOptions } from './notification-options';
import { UserSignupNotifConfig } from "./user-signup-notif-config";
import { SmsService } from "./sms-service";

export class TestSubject extends AbstractSubject {

    private observers: AbstractObserver[] = [];

    public  testMethod(): void {

      const testUser = { email: "nati@panalearn.com", name: 'nate' }
      const userSignupMail = new UserSignupNotifConfig(testUser, UserSignupMailOptions);

       this.notifyAllObservers(userSignupMail);
    }

    public addObserver(observer: AbstractObserver): void{
       this.observers.push(observer);
    }

    public notifyAllObservers = (emailOptions: any): void => {
       for (const observer of this.observers) {
          observer.update(emailOptions);
       }
    }

}

const testObj = new TestSubject();
const emailService = new EmailService();
const smsService = new SmsService();
testObj.addObserver(emailService);
testObj.addObserver(smsService);

const testFactory: ObjectFactory = () => testObj;
Container.bind(TestSubject).factory(testFactory);
