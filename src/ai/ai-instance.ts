import axios from 'axios';

export interface WebhookData {
  [key: string]: string;
}

export interface WebhookResponse {
  response: string;
}

export async function sendWebhookMessage(data: WebhookData): Promise<WebhookResponse> {
  try {
    const response = await axios.post('/api/proxyWebhook', data);
    console.log('Webhook sent successfully:', response.data);
    return response.data; // Return the data so that you can use it in generateResponse.
  } catch (error) {
    console.error('Error sending webhook:', error);
    throw new Error('Error sending webhook'); // Throw error to handle it in generateResponse.
  }
}
