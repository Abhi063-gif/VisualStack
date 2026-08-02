import type { NodeDefinition } from './NodeDefinition';

export const FILE_STORAGE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'file_upload_s3',
    category: 'Storage',
    name: 'Upload to S3 / Cloud',
    description: 'Uploads a binary file or blob to AWS S3, Supabase Storage, or Cloudflare R2.',
    icon: 'upload-cloud',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'file', name: 'File Object / Blob', type: 'data', dataType: 'any', color: '#94a3b8' },
      { id: 'folder', name: 'Folder Path', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'filename', name: 'File Name', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'error', name: 'Error', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'fileUrl', name: 'Public URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'path', name: 'Storage Path', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { bucket: 'uploads', publicAccess: true },
  },
  {
    type: 'file_generate_presigned_url',
    category: 'Storage',
    name: 'Generate Presigned URL',
    description: 'Generates a temporary signed URL for secure file upload/download.',
    icon: 'link-2',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'path', name: 'File Path', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'expiresIn', name: 'Expires (seconds)', type: 'data', dataType: 'number', color: '#3b82f6' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'signedUrl', name: 'Signed URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { expiresIn: 3600 },
  },
  {
    type: 'pdf_generate',
    category: 'Storage',
    name: 'Generate PDF',
    description: 'Renders an HTML string or template into a downloadable PDF file.',
    icon: 'file-text',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'html', name: 'HTML Content', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'filename', name: 'File Name', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'pdfBlob', name: 'PDF File', type: 'data', dataType: 'any', color: '#94a3b8' },
    ],
    defaultConfig: { filename: 'document.pdf' },
  },
  {
    type: 'csv_export',
    category: 'Storage',
    name: 'Export CSV',
    description: 'Converts an array of objects into a CSV file string.',
    icon: 'file-spreadsheet',
    color: '#10b981',
    inputs: [
      { id: 'data', name: 'Array of Objects', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    outputs: [
      { id: 'csvString', name: 'CSV String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {},
  },
  {
    type: 'csv_parse',
    category: 'Storage',
    name: 'Parse CSV',
    description: 'Parses a raw CSV string into an array of JSON objects.',
    icon: 'file-input',
    color: '#10b981',
    inputs: [
      { id: 'csvString', name: 'CSV String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'rows', name: 'Parsed Rows (Array)', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    defaultConfig: { header: true },
  },
];
