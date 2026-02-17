import openai from '../../configs/OpenAI';
import { systemPrompt } from '../utils/systemPrompt';

export async function createAiChatReply(message: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  });

  return response.choices[0]?.message?.content ?? '';
}
