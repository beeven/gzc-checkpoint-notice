
export class Notice {
    id: number;
    lpn: string;
    dateModified: Date;
    status: string;
}

export interface DataSource {
    initialize(): Promise<void>;
    dispose(): Promise<void>;
    getNewNoticeByLPNAndMaxId(lpn: string, maxId: number): Promise<Notice[]>;
}