import { DS } from "./data-source";

export class BaseDAO {
  find = async (caller, query, paramArr) => {
    let result;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp -> ", rows);
        result = rows;
      })
      .catch(console.log);
    return result;
  };

  insert = async (caller, query, paramArr) => {
    let resp;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp -> ", rows);
        resp = [
          {
            id: rows.insertId,
          },
        ];
      })
      .catch(console.log);
    return resp;
  };

  update = async (caller, query, paramArr) => {
    let resp;
    await DS.getConnection()
      .query(query, paramArr)
      .then(([rows, fields]) => {
        console.log(caller + " db resp ->", rows);
        resp = [
          {
            id: rows.updatedId,
          },
        ];
      })
      .catch(console.log);
    return resp;
  };
  delete = async () => {};
}
