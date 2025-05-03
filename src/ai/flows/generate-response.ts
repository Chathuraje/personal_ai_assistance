import { sendWebhookMessage, WebhookResponse } from '@/ai/ai-instance';

interface GenerateResponseInput {
  message: string;
  chatHistory?: string;
}

interface GenerateResponseOutput {
  response: string | WebhookResponse;
}

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  const response_data: WebhookResponse = await sendWebhookMessage({
    userMessage: input.message,
    chatHistory: input.chatHistory || ''
  });

  return { response: response_data };
}
