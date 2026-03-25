import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function test() {
  const apiKey = process.env.GOOGLE_API_KEY
  console.log('API Key present:', !!apiKey)
  if (!apiKey) return

  const ai = new GoogleGenAI({ apiKey })
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Try a safer model name
      contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
    })
    console.log('Response:', JSON.stringify(response, null, 2))
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error:', err.message)
    }
  }
}

test()
