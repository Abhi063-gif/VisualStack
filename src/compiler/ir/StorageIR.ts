export interface StorageIR {
  id: string;
  name: string;
  provider: 's3' | 'cloudinary' | 'supabase' | 'firebase' | 'local';
  bucketName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  isPublic: boolean;
}
