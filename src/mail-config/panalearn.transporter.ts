
import { ITransporter } from "./Itransporter.interface";
const nodemailer = require('nodemailer');

export class PanaLearnTransporter implements ITransporter {

    create(email, passw){
        return nodemailer.createTransport({
            host: 'mail.panalearn.com',
            port: 465,
            secure: true,
            auth: {
              user: email,
              pass: passw
            }
        });
    }

}
