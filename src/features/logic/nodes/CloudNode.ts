import type { NodeDefinition } from './NodeDefinition';

export const CLOUD_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'cloud_aws_s3_upload',
    category: 'Cloud',
    name: 'AWS S3 Upload',
    description: 'Uploads a file or binary payload directly to an Amazon S3 Bucket.',
    icon: 'cloud-upload',
    color: '#ff9900',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'bucket', name: 'Bucket Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'fileKey', name: 'File Key / Path', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'fileData', name: 'File Buffer', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'publicUrl', name: 'S3 Object URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { region: 'us-east-1', acl: 'public-read' },
  },
  {
    type: 'cloud_aws_lambda',
    category: 'Cloud',
    name: 'AWS Lambda Invoke',
    description: 'Invokes a serverless AWS Lambda function with custom event payload.',
    icon: 'cpu',
    color: '#ff9900',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'functionName', name: 'Function Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'payload', name: 'Event Payload', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'response', name: 'Response Payload', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { invocationType: 'RequestResponse' },
  },
  {
    type: 'cloud_firebase_auth',
    category: 'Cloud',
    name: 'Firebase Auth',
    description: 'Authenticates users via Firebase Authentication services.',
    icon: 'flame',
    color: '#ffca28',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'email', name: 'Email', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'password', name: 'Password', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'user', name: 'Firebase User', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { provider: 'email' },
  },
  {
    type: 'cloud_supabase_storage',
    category: 'Cloud',
    name: 'Supabase Storage',
    description: 'Uploads or downloads media files from Supabase Cloud Buckets.',
    icon: 'database',
    color: '#3ecf8e',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'bucket', name: 'Bucket Name', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'filePath', name: 'File Path', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'url', name: 'Public URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { bucket: 'avatars' },
  },
  {
    type: 'cloud_docker_deploy',
    category: 'Cloud',
    name: 'Docker Container Build',
    description: 'Builds and deploys a Docker container image to registry.',
    icon: 'box',
    color: '#2496ed',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'imageTag', name: 'Image Tag', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
    ],
    defaultConfig: { dockerfilePath: './Dockerfile' },
  },
];
