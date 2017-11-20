
export class Notice {
    constructor(id: number, lpn: string, dateModified: Date, status: string) { }
}

export interface DataSource {
    initialize(): Promise<void>;
    dispose(): Promise<void>;
    getNewNoticeByLPNOrMobileAndMaxId(lpn: string, maxId: number): Promise<Notice[]>;
}