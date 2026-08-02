import type { NodeDefinition } from './NodeDefinition';

export const DEVICE_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'dev_camera',
    category: 'Device',
    name: 'Camera Capture',
    description: 'Captures a photo or video from device camera.',
    icon: 'camera',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'captured', name: 'Captured', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'fileUrl', name: 'Image File URL', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { mode: 'photo', quality: 'high' },
  },
  {
    type: 'dev_gps_location',
    category: 'Device',
    name: 'Get GPS Location',
    description: 'Retrieves current device latitude, longitude, and accuracy.',
    icon: 'navigation',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'latitude', name: 'Latitude', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'longitude', name: 'Longitude', type: 'data', dataType: 'number', color: '#3b82f6' },
      { id: 'coords', name: 'Location Object', type: 'data', dataType: 'object', color: '#f59e0b' },
    ],
    defaultConfig: { highAccuracy: true },
  },
  {
    type: 'dev_clipboard',
    category: 'Device',
    name: 'Clipboard Copy / Read',
    description: 'Copies text to system clipboard or reads clipboard content.',
    icon: 'clipboard',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'text', name: 'Text to Copy', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
      { id: 'clipboardText', name: 'Clipboard Content', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { action: 'copy' },
  },
  {
    type: 'dev_biometrics',
    category: 'Device',
    name: 'Biometric Auth',
    description: 'Prompts user for Touch ID or Face ID biometric authentication.',
    icon: 'fingerprint',
    color: '#8b5cf6',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'promptMessage', name: 'Prompt Title', type: 'data', dataType: 'string', color: '#10b981', defaultValue: 'Authenticate to proceed' },
    ],
    outputs: [
      { id: 'success', name: 'Success', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'failed', name: 'Failed / Cancelled', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: { promptMessage: 'Authenticate to proceed' },
  },
  {
    type: 'dev_qr_scanner',
    category: 'Device',
    name: 'QR / Barcode Scanner',
    description: 'Opens camera scanner to read QR codes and barcodes.',
    icon: 'qr-code',
    color: '#0ea5e9',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
    ],
    outputs: [
      { id: 'scanned', name: 'On Scanned', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'codeValue', name: 'Scanned Code', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { barcodeFormat: 'ALL' },
  },
];
