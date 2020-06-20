import { DS } from "./data-source";
import { AppError } from "./../common/app-error";
import {ErrorMessage} from "./../../../pana-tutor-lib/enum/constants";

export class BaseDAO {

  find = async (caller, query, paramArr) => {
    let result;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp -> ", rows);
        result = rows;
      })
      .catch(err => {
        console.log(err)
        throw new AppError(500, ErrorMessage.DB_FIND_ERROR, caller,null);
      });
    return result;
  };

  insert = async (caller, query, paramArr, addParams?:any) => {
    let resp;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp -> ", rows);
        resp = [
          {
            id: rows.insertId,
            ...(addParams ? addParams : {})
          },
        ];
      })
      .catch(err => {
        console.log(err)
        throw new AppError(500, ErrorMessage.DB_INSERT_ERROR, caller,null);
      });
    return resp;
  };

  update = async (caller, query, paramArr, id, addParams?:any) => {
    let resp;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp -> ", rows);
        resp = [
          {
            id,
            ...(addParams ? addParams : {})
          },
        ];
      })
      .catch(err => {
        console.log(err)
        throw new AppError(500, ErrorMessage.DB_UPDATE_ERROR, caller,null);
      });
    return resp;
  };

  delete = async () => {};
}
