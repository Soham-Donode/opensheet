import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function main() {
  const prisma = (await import('../src/lib/prisma')).default

  // Clear existing questions if needed
  await prisma.question.deleteMany()

  // Striver A2Z dummy data
  await prisma.question.createMany({
    data: [
      {
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        difficulty: 'Easy',
        topics: ['Array', 'Hash Table'],
        sheetSlug: 'striver-a2z'
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        difficulty: 'Easy',
        topics: ['Array', 'Dynamic Programming'],
        sheetSlug: 'striver-a2z'
      },
    ]
  })

  // NeetCode 150 dummy data
  await prisma.question.createMany({
    data: [
      {
        title: 'Contains Duplicate',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        difficulty: 'Easy',
        topics: ['Array', 'Hash Table'],
        sheetSlug: 'neetcode-150'
      },
      {
        title: 'Valid Anagram',
        url: 'https://leetcode.com/problems/valid-anagram/',
        difficulty: 'Easy',
        topics: ['String', 'Hash Table'],
        sheetSlug: 'neetcode-150'
      },
    ]
  })

  // Blind 75 dummy data
  await prisma.question.createMany({
    data: [
      {
        title: 'Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        difficulty: 'Medium',
        topics: ['String', 'Sliding Window'],
        sheetSlug: 'blind-75'
      },
    ]
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
