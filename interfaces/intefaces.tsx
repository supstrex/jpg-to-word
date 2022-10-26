import  { ReactNode } from "react";

export interface DownloadStatus {
    isReady: boolean,
    fileUrl: string,
}
export interface UploadingFile {
    data: Blob| string,
    name?: string,
}

export interface LayoutProps {
    children: ReactNode,
    download: DownloadStatus,
    clearDownload: Function,
}



