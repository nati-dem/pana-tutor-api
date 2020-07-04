import { NotificationOptions } from "./notification-options";

export class UserSignupNotifConfig implements NotificationOptions {

    from: string;
    to: string;
    subject: string;
    html: string;

    constructor(user, options: NotificationOptions) {
        this.to = user.email;
        this.from = options.from;
        this.subject = options.subject;
        this.html = options.html.replace("${username}", user.name );
    }

}
