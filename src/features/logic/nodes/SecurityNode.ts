import type { NodeDefinition } from './NodeDefinition';

export const SECURITY_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'sec_encrypt',
    category: 'Security',
    name: 'Encrypt Text',
    description: 'Encrypts plain text using AES-256 or RSA encryption.',
    icon: 'lock',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'text', name: 'Plain Text', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'secretKey', name: 'Secret Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'encrypted', name: 'Encrypted Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { algorithm: 'AES-256' },
  },
  {
    type: 'sec_decrypt',
    category: 'Security',
    name: 'Decrypt Text',
    description: 'Decrypts AES/RSA ciphertext back into plain text.',
    icon: 'unlock',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'ciphertext', name: 'Ciphertext', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'secretKey', name: 'Secret Key', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'plainText', name: 'Plain Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { algorithm: 'AES-256' },
  },
  {
    type: 'sec_uuid',
    category: 'Security',
    name: 'Generate UUID',
    description: 'Generates a v4 Universally Unique Identifier (UUID).',
    icon: 'key',
    color: '#a855f7',
    inputs: [],
    outputs: [
      { id: 'uuid', name: 'UUID String', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: {},
  },
  {
    type: 'sec_otp_generate',
    category: 'Security',
    name: 'Generate OTP',
    description: 'Generates a 6-digit One Time Password for 2FA or email verification.',
    icon: 'shield-check',
    color: '#a855f7',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'length', name: 'OTP Length', type: 'data', dataType: 'number', color: '#3b82f6', defaultValue: 6 },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'otp', name: 'OTP Code', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { length: 6, numericOnly: true },
  },
];
