import { GmailTransporter } from "./gmail.transporter";
import { PanaLearnTransporter } from "./panalearn.transporter";
import { Singleton } from "typescript-ioc";

@Singleton
export class TransporterFactory {

    private static transporterInstance;

    initTransporter (type){
        if(type === 'panalearn') {
            TransporterFactory.transporterInstance = new PanaLearnTransporter()
                .create(process.env.PANA_DEF_EMAIL, process.env.PANA_DEF_EMAIL_PASS );
        }
        else if(type === 'gmail'){
            TransporterFactory.transporterInstance = new GmailTransporter()
                .create(process.env.GMAIL, process.env.GMAIL_PASS);
        } else {
            throw new Error("Transporter type not found.");
        }
    }

    getTransporter () {
        if(TransporterFactory.transporterInstance)
            return TransporterFactory.transporterInstance;
        throw new Error("Transporter not configured.");
    }

}
