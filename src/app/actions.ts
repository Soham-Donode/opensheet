'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProgress(
  questionId: string,
  status: string,
  notes: string
) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Validate status
  const validStatuses = ['todo', 'in_progress', 'solved', 'skipped']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  await prisma.userProgress.upsert({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
    update: {
      status,
      notes,
    },
    create: {
      userId,
      questionId,
      status,
      notes,
    },
  })

  revalidatePath('/')
}
