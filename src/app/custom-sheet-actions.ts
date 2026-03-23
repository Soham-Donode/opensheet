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

  // Verify ownership before update
  const sheet = await prisma.userSheet.findFirst({
    where: { id, userId }
  })
  
  if (!sheet) throw new Error('Unauthorized or sheet not found')

  await prisma.userSheet.update({
    where: { id },
    data: { isPinned }
  })
  revalidatePath('/')
}

export async function renameUserSheet(id: string, name: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify ownership before update
  const sheet = await prisma.userSheet.findFirst({
    where: { id, userId }
  })
  
  if (!sheet) throw new Error('Unauthorized or sheet not found')

  await prisma.userSheet.update({
    where: { id },
    data: { name }
  })
  revalidatePath('/')
}

export async function deleteUserSheet(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const sheet = await prisma.userSheet.findFirst({ 
    where: { id, userId } 
  })
  
  if (sheet) {
    await prisma.question.deleteMany({ where: { sheetSlug: sheet.slug } })
    await prisma.userSheet.delete({ where: { id } })
  }
  revalidatePath('/')
}

export async function getUserSheetsWithPresence(questionUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const sheets = await prisma.userSheet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const sheetsWithPresence = await Promise.all(
    sheets.map(async (sheet) => {
      const existingQuestion = await prisma.question.findFirst({
        where: {
          sheetSlug: sheet.slug,
          url: questionUrl
        }
      });
      return {
        id: sheet.id,
        name: sheet.name,
        slug: sheet.slug,
        containsQuestion: !!existingQuestion
      };
    })
  );

  return sheetsWithPresence;
}

export async function toggleQuestionInSheet(
  sheetSlug: string,
  questionData: { title: string; url: string; difficulty: string; topics: string[] },
  add: boolean
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Verify ownership
  const sheet = await prisma.userSheet.findUnique({
    where: { slug: sheetSlug, userId }
  });
  if (!sheet) throw new Error('Sheet not found');

  if (add) {
    // Check if it already exists to prevent duplicates
    const exists = await prisma.question.findFirst({
      where: { sheetSlug, url: questionData.url }
    });
    if (!exists) {
      await prisma.question.create({
        data: {
          title: questionData.title,
          url: questionData.url,
          difficulty: questionData.difficulty,
          topics: questionData.topics,
          sheetSlug
        }
      });
    }
  } else {
    // Remove all instances of this question from this sheet
    await prisma.question.deleteMany({
      where: { sheetSlug, url: questionData.url }
    });
  }

  revalidatePath('/');
  revalidatePath(`/sheet/${sheetSlug}`);
  return { success: true };
}

export async function createEmptySheet(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const slug = `custom-${userId}-${Date.now()}`;
  await prisma.userSheet.create({
    data: {
      userId,
      name,
      slug,
      isPinned: false
    }
  });

  revalidatePath('/');
  return { success: true, slug };
}

export async function mergeSheets(name: string, selectedSheetSlugs: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const slug = `custom-${userId}-${Date.now()}`;

  try {
    // 1. Fetch all questions from the selected sheets
    const questionsToMerge = await prisma.question.findMany({
      where: {
        sheetSlug: {
          in: selectedSheetSlugs
        }
      }
    });

    // 2. Filter unique questions by URL to avoid duplicates
    const uniqueQuestionsMap = new Map();
    for (const q of questionsToMerge) {
      if (!uniqueQuestionsMap.has(q.url)) {
        uniqueQuestionsMap.set(q.url, q);
      }
    }
    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

    if (uniqueQuestions.length === 0) {
      return { success: false, error: "The selected sheets do not contain any unique questions." };
    }

    // 3. Create the new custom sheet
    await prisma.userSheet.create({
      data: {
        userId,
        name,
        slug,
        isPinned: false
      }
    });

    // 4. Create the questions for this new sheet
    const questionData = uniqueQuestions.map(q => ({
      title: q.title,
      url: q.url,
      difficulty: q.difficulty,
      topics: q.topics,
      sheetSlug: slug
    }));

    await prisma.question.createMany({
      data: questionData
    });

    revalidatePath('/');
    return { success: true, slug };
  } catch (error: any) {
    console.error("Error merging sheets:", error);
    return { success: false, error: error.message || "Failed to merge sheets" };
  }
}
