
import { ITransporter } from "./Itransporter.interface";
const nodemailer = require('nodemailer');

export class GmailTransporter implements ITransporter {

    create(email, passw){
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: passw
            }
        });
    }

}

/*

const otherTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: '...',
        pass: '...'
    }
    });

*/
