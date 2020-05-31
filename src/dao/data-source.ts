const mysql = require('mysql2');

export class DS {

    private static _connection:any;

    static initConPool(){
        DS._connection = mysql.createPool({
            connectionLimit: 15,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            socketPath:process.env.DB_SOCKET,
            debug:false,
            waitForConnections: true,
            queueLimit: 0,
            database: process.env.DB_NAME,
         }).promise();

         DS._connection.query("SELECT 1", (err2, result) => {
            if (err2) throw err2;
            console.log("DB Connected!");
        });
    }

    static getConnection(){
        return DS._connection;
    }

}
