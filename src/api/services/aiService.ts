import { getOpenAIClient } from '../../configs/OpenAI';
import { systemPrompt } from '../utils/systemPrompt';

export async function createAiChatReply(message: string): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    max_tokens:150
  });

  return response.choices[0]?.message?.content ?? '';
}
