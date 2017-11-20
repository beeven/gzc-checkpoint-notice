import oracledb = require("oracledb");
import { DataSource, Notice } from "./dataSource";
import { IConnectionPool } from "oracledb";

oracledb.outFormat = oracledb.OBJECT;
oracledb.Promise = Promise;



const connectionConfig = {
    user: "cbes",
    password: "123456",
    connectString: "localhost:49161/xe"
};

const connnectionConfig = {
    user: "zgdec",
    password: "dbwork",
    connectString: "172.7.1.84/JCDEC"  
};


export class OracleDataSource implements DataSource {

    private pool: oracledb.IConnectionPool;
    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            oracledb.createPool(connectionConfig, (err, pool) => {
                if (err) { return reject(err); }
                this.pool = pool;
            });
        });
    }
    dispose(): Promise<void> {
        if (this.pool != null) {
            return new Promise((resolve, reject) => {
                this.pool.close((err) => {
                    if (err) { return reject(err); }
                    resolve();
                })
            });
        } else {
            return Promise.resolve();
        }
    }
    getNewNoticeByLPNAndMaxId(lpn: string, maxId: number): Promise<Notice[]> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection().then(
                conn => {
                    return conn.execute(`SELECT "Id","LPN","Status","Date","MOBILE" 
                    from ( 
                        SELECT A.*, ROWNUM RN 
                        FROM ( 
                            SELECT OID as "Id", 
                            RECEIVE_DATE - 8/24 as "Date", 
                            INFORMATION as "Status", 
                            CAR_NAME as "LPN", 
                            PHONE as "MOBILE" 
                            from TRANS_ARRIVE_MESSAGE 
                            where (CAR_NAME like (:1) or PHONE like (:2)) order by OID desc ) A 
                        where ROWNUM < (:3) ) 
                    WHERE RN >= (:4) `,[filterText,filterText,to,from])
                }
            ).then(
                result => {
                    
                }
            )
        })
    }

}
