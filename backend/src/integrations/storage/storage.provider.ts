export interface StorageFileMetadata {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  key: string;
  folder?: string;
  url?: string;
  uploadedAt: Date;
}

export interface UploadFileInput {
  fileName: string;
  contentType: string;
  body: Buffer | Uint8Array | string;
  folder?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadFileResult {
  success: boolean;
  provider: "disabled";
  file?: StorageFileMetadata;
  message: string;
}

export interface StorageProvider {
  readonly isEnabled: boolean;
  uploadFile(input: UploadFileInput): Promise<UploadFileResult>;
  getFile(fileId: string): Promise<StorageFileMetadata | null>;
  deleteFile(fileId: string): Promise<boolean>;
}

export class DisabledStorageProvider implements StorageProvider {
  readonly isEnabled = false;

  async uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
    return {
      success: false,
      provider: "disabled",
      message:
        `Storage is unavailable for "${input.fileName}". Configure a storage provider before uploading files.`,
    };
  }

  async getFile(_fileId: string): Promise<StorageFileMetadata | null> {
    return null;
  }

  async deleteFile(_fileId: string): Promise<boolean> {
    return false;
  }
}

export const storageProvider: StorageProvider =
  new DisabledStorageProvider();

export default storageProvider;
