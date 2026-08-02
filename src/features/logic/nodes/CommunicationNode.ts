import type { NodeDefinition } from './NodeDefinition';

export const COMMUNICATION_NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'email_send',
    category: 'Communication',
    name: 'Send Email',
    description: 'Sends a transactional email via Resend, SendGrid, or SMTP.',
    icon: 'mail',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'to', name: 'To Email', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'subject', name: 'Subject', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'body', name: 'HTML / Text Body', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'sent', name: 'Sent', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'failed', name: 'Failed', type: 'execution', dataType: 'execution', color: '#ef4444' },
      { id: 'messageId', name: 'Message ID', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    defaultConfig: { provider: 'resend', from: 'noreply@app.com' },
  },
  {
    type: 'sms_send',
    category: 'Communication',
    name: 'Send SMS',
    description: 'Sends an SMS text message or OTP code via Twilio.',
    icon: 'message-square',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'phone', name: 'Phone Number', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'message', name: 'Message Text', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'sent', name: 'Sent', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'failed', name: 'Failed', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: { provider: 'twilio' },
  },
  {
    type: 'push_notification_send',
    category: 'Communication',
    name: 'Send Push Notification',
    description: 'Sends a mobile or web push notification via Firebase Cloud Messaging.',
    icon: 'bell-ring',
    color: '#ec4899',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'userId', name: 'User ID / Token', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'title', name: 'Title', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'message', name: 'Message', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'sent', name: 'Sent', type: 'execution', dataType: 'execution', color: '#10b981' },
      { id: 'failed', name: 'Failed', type: 'execution', dataType: 'execution', color: '#ef4444' },
    ],
    defaultConfig: {},
  },
  {
    type: 'slack_webhook',
    category: 'Communication',
    name: 'Post Slack Message',
    description: 'Posts a message payload to a Slack channel webhook.',
    icon: 'slack',
    color: '#4a154b',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'webhookUrl', name: 'Webhook URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'message', name: 'Text Message', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
  {
    type: 'discord_webhook',
    category: 'Communication',
    name: 'Post Discord Embed',
    description: 'Posts an embed message to a Discord channel via Webhook.',
    icon: 'message-circle',
    color: '#5865f2',
    inputs: [
      { id: 'exec', name: 'Execute', type: 'execution', dataType: 'execution' },
      { id: 'webhookUrl', name: 'Webhook URL', type: 'data', dataType: 'string', color: '#10b981' },
      { id: 'content', name: 'Message Content', type: 'data', dataType: 'string', color: '#10b981' },
    ],
    outputs: [
      { id: 'exec', name: 'Then', type: 'execution', dataType: 'execution' },
    ],
    defaultConfig: {},
  },
];
