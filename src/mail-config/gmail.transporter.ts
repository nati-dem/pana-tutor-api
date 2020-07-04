
import { ITransporter } from "./Itransporter.interface";
const nodemailer = require('nodemailer');

export class GmailTransporter implements ITransporter {

    create(){
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
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
