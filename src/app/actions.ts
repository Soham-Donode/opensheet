'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProgress(
  questionId: string,
  isCompleted: boolean,
  notes: string
) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  await prisma.userProgress.upsert({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
    update: {
      isCompleted,
      notes,
    },
    create: {
      userId,
      questionId,
      isCompleted,
      notes,
    },
  })

  revalidatePath('/')
  revalidatePath('/sheet/[sheetSlug]', 'page')
}
