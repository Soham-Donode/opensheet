import prisma from '../src/lib/prisma'

// These 20 questions form our seed "Sheet"
const questions = [
  { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy", topics: ["Array", "Hash Table"] },
  { title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy", topics: ["Array", "Dynamic Programming"] },
  { title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "Easy", topics: ["Array", "Hash Table"] },
  { title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", difficulty: "Medium", topics: ["Array", "Prefix Sum"] },
  { title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", difficulty: "Medium", topics: ["Array", "Divide and Conquer", "Dynamic Programming"] },
  { title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", difficulty: "Medium", topics: ["Array", "Dynamic Programming"] },
  { title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", difficulty: "Medium", topics: ["Array", "Binary Search"] },
  { title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "Medium", topics: ["Array", "Binary Search"] },
  { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium", topics: ["Array", "Two Pointers", "Sorting"] },
  { title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium", topics: ["Array", "Two Pointers", "Greedy"] },
  { title: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", difficulty: "Medium", topics: ["Math", "Bit Manipulation"] },
  { title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", difficulty: "Easy", topics: ["Divide and Conquer", "Bit Manipulation"] },
  { title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", difficulty: "Easy", topics: ["Dynamic Programming", "Bit Manipulation"] },
  { title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "Easy", topics: ["Array", "Math", "Bit Manipulation", "Sorting"] },
  { title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", difficulty: "Easy", topics: ["Divide and Conquer", "Bit Manipulation"] },
  { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy", topics: ["Math", "Dynamic Programming", "Memoization"] },
  { title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium", topics: ["Array", "Dynamic Programming", "Breadth-First Search"] },
  { title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "Medium", topics: ["Array", "Binary Search", "Dynamic Programming"] },
  { title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "Medium", topics: ["String", "Dynamic Programming"] },
  { title: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "Medium", topics: ["Array", "Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"] }
];

async function main() {
  console.log(`Start seeding ...`)
  for (const q of questions) {
    const question = await prisma.question.upsert({
      where: { url: q.url },
      update: {}, // Don't update if exists
      create: {
        title: q.title,
        url: q.url,
        difficulty: q.difficulty,
        topics: q.topics,
      },
    })
    console.log(`Upserted question with id: ${question.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
