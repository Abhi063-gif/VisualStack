export type StorageProviderType =
  | 's3'
  | 'firebase'
  | 'supabase'
  | 'cloudinary'
  | 'azure'
  | 'gcs'
  | 'local';

export interface StorageBucketConfig {
  id: string;
  name: string;
  provider: StorageProviderType;
  bucketName: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  isPublic: boolean;
}

export class StorageManager {
  private buckets: Map<string, StorageBucketConfig> = new Map();

  constructor() {
    this.registerDefaultBuckets();
  }

  private registerDefaultBuckets(): void {
    const s3Bucket: StorageBucketConfig = {
      id: 'storage_s3_uploads',
      name: 'Media Uploads S3 Bucket',
      provider: 's3',
      bucketName: 'visualstack-user-media',
      region: 'us-east-1',
      isPublic: true,
    };

    this.buckets.set(s3Bucket.id, s3Bucket);
  }

  public getAll(): StorageBucketConfig[] {
    return Array.from(this.buckets.values());
  }

  public getById(id: string): StorageBucketConfig | undefined {
    return this.buckets.get(id);
  }

  public saveBucket(config: StorageBucketConfig): void {
    this.buckets.set(config.id, config);
  }
}

export const storageManager = new StorageManager();
