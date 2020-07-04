import { MailOptions } from "../mail-config/mail-options";

export class UserSignupMailConfig implements MailOptions {

    from: string;
    to?: string | undefined;
    subject: string;
    html: string;

    constructor(user, options: MailOptions) {
        this.to = user.email;
        this.from = options.from;
        this.subject = options.subject;
        this.html = options.html.replace("${username}", user.name );
    }

}

