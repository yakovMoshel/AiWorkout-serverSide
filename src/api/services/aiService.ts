import { getOpenAIClient } from '../../configs/OpenAI';
import { systemPrompt } from '../utils/systemPrompt';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_HISTORY_MESSAGES = 10;

export async function createAiChatReply(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const openai = getOpenAIClient();

  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message },
    ],
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content ?? '';
}
