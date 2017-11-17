
export class Notice {
    id: number;
    lpn: string;
    dateModified: Date;
    status: string;
}

export interface DataSource {
    initialize(): Promise<void>;
    dispose(): void;
    getNewNoticeByLPNAndMaxId(lpn: string, maxId: number): Promise<Notice[]>;
}