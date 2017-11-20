import { Notice, DataSource } from "./dataSource";

export class DummyDataSource implements DataSource {
    initialize(): Promise<void> {
        return Promise.resolve();
    }

    dispose(): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    getNewNoticeByLPNOrMobileAndMaxId(lpn: string, maxId: number): Promise<Notice[]> {
        let notices: Notice[] = [];
        for (let i = 1; i < 2; i++) {
            notices.push({ id: i + maxId, lpn: lpn, dateModified: new Date(), status: "请刷司机纸" });
        }
        return Promise.resolve(notices);
    }

}