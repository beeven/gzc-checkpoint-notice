import * as oracledb from 'oracledb';
import { DataSource, Notice } from "./dataSource";

const connectionConfig = {
    user: "",
    password: "",
    connectString: "localhost/XE"
};

export class OracleDataSource implements DataSource {
    initialize(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }
    getNewNoticeByLPNAndMaxId(lpn: string, maxId: number): Promise<Notice[]> {
        throw new Error("Method not implemented.");
    }
    
}