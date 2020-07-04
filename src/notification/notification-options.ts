
export const UserSignupMailOptions: NotificationOptions = {
    from: "panalearn@gmail.com",
    subject: "Sending Email using Node.js",
    html: "<h1>Welcome ${username} </h1><p>That was easy!</p>"
}

export interface NotificationOptions {
    from: string;
    to?: string;
    subject: string;
    html: string;
    phone_num?:string;
    text?:string;
}
