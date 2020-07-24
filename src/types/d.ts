declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string,
    ADMIN_USER: string,
    ADMIN_PASS: string,
    SERVER_DIR: string,
    DB_HOST:string,
    DB_USER:string,
    DB_PASS:string,
    DB_SOCKET:string,
    DB_NAME:string,
    DB_DEBUG:string,
    DB_PREFIX:string,
    GMAIL: string,
    GMAIL_PASS: string,
    PUBLIC_UPLOAD_DIR: string
  }
  interface Global {
    userId:number
  }
}
