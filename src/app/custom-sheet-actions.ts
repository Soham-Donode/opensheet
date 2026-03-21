'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { GoogleGenAI } from '@google/genai'

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

export async function generateCustomSheet(topics: string, experienceLevel: string, maxQuestions: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const prompt = `Generate a JSON array of exactly ${maxQuestions} interview questions for topics: ${topics}. Experience level: ${experienceLevel}.
  Each object in the array MUST have these exact keys:
  - "title": (string) The name of the question
  - "url": (string) A realistic Leetcode (e.g., https://leetcode.com/problems/[slug]/) or GeeksForGeeks (e.g., https://www.geeksforgeeks.org/problems/[slug]/) URL for the technical problem itself. DO NOT provide links to articles, blogs, or discussions.
  - "difficulty": (string) "Easy", "Medium", or "Hard"
  - "topics": (array of strings) The tags/topics for the question

  Return ONLY raw JSON array, without any markdown formatting or \`\`\`json blocks. Just the raw array starting with [ and ending with ].`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    })

    let text = response.text || "[]"
    // Clean up if it returned markdown json blocks despite instructions
    text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim()

    const parsed = JSON.parse(text)
    return { success: true, questions: parsed }
  } catch (error) {
    console.error("Failed to parse Gemini response:", error)
    return { success: false, error: "Failed to generate valid questions" }
  }
}

export async function saveCustomSheet(name: string, questions: any[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const slug = `custom-${userId}-${Date.now()}`

  try {
    await prisma.userSheet.create({
      data: {
        userId,
        name,
        slug,
        isPinned: false
      }
    })

    const questionData = questions.map(q => ({
      title: q.title,
      url: q.url,
      difficulty: q.difficulty,
      topics: q.topics,
      sheetSlug: slug
    }))

    await prisma.question.createMany({
      data: questionData
    })

    revalidatePath('/')
    return { success: true, slug }
  } catch (error: any) {
    console.error("Error saving sheet:", error)
    return { success: false, error: error.message }
  }
}

export async function togglePinUserSheet(id: string, isPinned: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.userSheet.update({
    where: { id, userId: userId },
    data: { isPinned }
  })
  revalidatePath('/')
}

export async function renameUserSheet(id: string, name: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.userSheet.update({
    where: { id, userId: userId },
    data: { name }
  })
  revalidatePath('/')
}

export async function deleteUserSheet(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const sheet = await prisma.userSheet.findUnique({ where: { id, userId: userId } })
  if (sheet) {
    await prisma.question.deleteMany({ where: { sheetSlug: sheet.slug } })
    await prisma.userSheet.delete({ where: { id, userId: userId } })
  }
  revalidatePath('/')
}
