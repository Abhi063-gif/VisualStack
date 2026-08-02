import type { NodeDefinition } from './NodeDefinition';

export const UTILITY_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'util_pdf_generator',
    category: 'Utilities',
    name: 'Generate PDF Document',
    description: 'Converts HTML or structured JSON layout into a downloadable PDF file.',
    icon: 'file-text',
    color: '#ef4444',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'htmlContent', name: 'HTML Content', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'filename', name: 'File Name', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'document.pdf' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'pdfUrl', name: 'PDF File URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { pageSize: 'A4', orientation: 'portrait' },
  },
  {
    type: 'util_excel_csv_export',
    category: 'Utilities',
    name: 'Export CSV / Excel',
    description: 'Converts an array of objects into a formatted CSV or XLSX file.',
    icon: 'table',
    color: '#10b981',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'dataArray', name: 'Data Array', type: 'data', dataType: 'array', color: '#a855f7' },
      { id: 'filename', name: 'File Name', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'export.csv' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'fileUrl', name: 'Download URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { format: 'csv' },
  },
  {
    type: 'util_base64_encode',
    category: 'Utilities',
    name: 'Base64 Encode / Decode',
    description: 'Encodes text/binary data to Base64 or decodes Base64 to string.',
    icon: 'code',
    color: '#6366f1',
    inputs: [
      { id: 'text', name: 'Input Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'output', name: 'Converted Output', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { mode: 'encode' },
  },
  {
    type: 'util_faker_data',
    category: 'Utilities',
    name: 'Faker Data Generator',
    description: 'Generates realistic mock user profiles, names, addresses, emails, and phone numbers.',
    icon: 'user-check',
    color: '#f59e0b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'count', name: 'Count', type: 'data', dataType: 'number', color: '#3b82f6', defaultValue: 10 },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'fakeRecords', name: 'Mock Records', type: 'data', dataType: 'array', color: '#a855f7' },
    ],
    defaultConfig: { entityType: 'users' },
  },
];
