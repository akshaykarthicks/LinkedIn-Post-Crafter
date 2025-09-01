import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { ContentGoal, Tone, UserInputs } from '../../types';

if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable is not set.');
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert LinkedIn content strategist and world-class copywriter. Your task is to generate an engaging, professional, and platform-optimized post for LinkedIn based on user-provided details.

Follow these rules strictly:
1.  **Hook:** Start with a strong, scroll-stopping first line.
2.  **Readability:** Use short paragraphs, bullet points, or numbered lists to make the post easy to scan on mobile. Use ample white space.
3.  **Tone:** Perfectly embody the requested tone of voice.
4.  **Emojis:** Incorporate 2-4 relevant emojis to add personality and break up text, but maintain professionalism.
5.  **Hashtags:** Conclude with a blank line followed by 3-5 relevant, niche hashtags. Do not use hashtags in the main body of the post.
6.  **Engagement:** End the main body of the post with a compelling question or a call-to-action to encourage comments and discussion.
7.  **Authenticity:** Avoid generic AI language. Write with a human touch.
8.  **Format:** Generate only the text content for the LinkedIn post itself. Do not include any pre-amble or explanation like "Here is your LinkedIn post:".`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { goal, inputs, tone } = req.body as {
    goal: ContentGoal;
    inputs: UserInputs;
    tone: Tone;
  };

  if (!goal || !inputs || !tone) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const promptDetails = Object.entries(inputs)
      .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('\n');

    const userPrompt = `
      **Goal:** ${goal}
      **Tone:** ${tone}
      
      **Key Information Provided:**
      ${promptDetails}
      
      **Task:** Now, write the LinkedIn post following all the rules in your system instructions.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    const text = response.text.trim();
    if (!text) {
      return res.status(500).json({ error: 'The AI returned an empty response. Please try again with a more detailed prompt.' });
    }

    return res.status(200).json({ post: text });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: 'Failed to generate LinkedIn post. Please check your inputs and try again.' });
  }
}
