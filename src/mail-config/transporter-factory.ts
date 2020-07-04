import { GmailTransporter } from "./gmail.transporter";
import { Singleton } from "typescript-ioc";

@Singleton
export class TransporterFactory {

    private static transporterInstance;// : ITransporter;

    initTransporter (type){
        if(type === 'gmail'){
            TransporterFactory.transporterInstance = new GmailTransporter().create();
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
