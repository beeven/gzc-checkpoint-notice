import oracledb = require("oracledb");
import { DataSource, Notice } from "./dataSource";
import { IConnectionPool } from "oracledb";

const config = require("./config.json");

oracledb.outFormat = oracledb.OBJECT;


const connectionConfig = {
    user: config.database.user,
    password: config.database.password,
    connectString: config.database.connectString
};

/*
const connnectionConfig = {
    user: "zgdec",
    password: "dbwork",
    connectString: "172.7.1.84/JCDEC"  
};
*/

export class OracleDataSource implements DataSource {

    private pool: oracledb.IConnectionPool;
    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            oracledb.createPool(connectionConfig, (err, pool) => {
                if (err) { return reject(err); }
                this.pool = pool;
                resolve();
            });
        });
    }
    dispose(): Promise<void> {
        if (this.pool != undefined) {
            return new Promise((resolve, reject) => {
                this.pool.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        } else {
            return Promise.resolve();
        }
    }
    getNewNoticeByLPNOrMobileAndMaxId(lpn: string, maxId: number): Promise<Notice[]> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection().then(
                conn => {
                    let lpnFilter = "%" + lpn + "%";
                    return conn.execute(
                        `select OID as "id",
                            RECEIVE_DATE - 8/24 as "dateModified",
                            INFORMATION as "status",
                            CAR_NAME as "lpn"
                            from TRANS_ARRIVE_MESSAGE
                            where (CAR_NAME like (:1) or PHONE like (:2))
                                and OID > (:3)
                                and RECEIVE_DATE >= (sysdate-5)
                            order by OID`, [lpnFilter, lpnFilter, maxId]
                    ).then(
                        resultSet => {
                            resolve(resultSet.rows as Notice[]);
                            return conn.close();
                        }
                    );
                }
            )
                .catch((err) => reject(err));
        });
    }

}
