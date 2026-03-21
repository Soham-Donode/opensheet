import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function main() {
  const prisma = (await import("../src/lib/prisma")).default;

  // Clear existing questions if needed
  await prisma.question.deleteMany();

  // Striver A2Z dummy data
  await prisma.question.createMany({
    data: [
      {
        title: "Two Sum",
        url: "https://leetcode.com/problems/two-sum/",
        difficulty: "Easy",
        topics: ["Array", "Hash Table"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Best Time to Buy and Sell Stock",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        difficulty: "Easy",
        topics: ["Array", "Dynamic Programming"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
        topics: ["Linked List", "Math"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Longest Palindromic Substring",
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
        difficulty: "Medium",
        topics: ["String", "Dynamic Programming"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Container With Most Water",
        url: "https://leetcode.com/problems/container-with-most-water/",
        difficulty: "Medium",
        topics: ["Two Pointers", "Array"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "3Sum",
        url: "https://leetcode.com/problems/3sum/",
        difficulty: "Medium",
        topics: ["Two Pointers", "Array"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Merge Intervals",
        url: "https://leetcode.com/problems/merge-intervals/",
        difficulty: "Medium",
        topics: ["Sorting", "Array"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Climbing Stairs",
        url: "https://leetcode.com/problems/climbing-stairs/",
        difficulty: "Easy",
        topics: ["Dynamic Programming"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Coin Change",
        url: "https://leetcode.com/problems/coin-change/",
        difficulty: "Medium",
        topics: ["Dynamic Programming"],
        sheetSlug: "striver-a2z",
      },
      {
        title: "Kth Largest Element in an Array",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        difficulty: "Medium",
        topics: ["Heap", "Array"],
        sheetSlug: "striver-a2z",
      },
    ],
  });

  // NeetCode 150 dummy data
  await prisma.question.createMany({
    data: [
      {
        title: "Contains Duplicate",
        url: "https://leetcode.com/problems/contains-duplicate/",
        difficulty: "Easy",
        topics: ["Array", "Hash Table"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Valid Anagram",
        url: "https://leetcode.com/problems/valid-anagram/",
        difficulty: "Easy",
        topics: ["String", "Hash Table"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Product of Array Except Self",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
        difficulty: "Medium",
        topics: ["Array", "Prefix Sum"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Maximum Subarray",
        url: "https://leetcode.com/problems/maximum-subarray/",
        difficulty: "Easy",
        topics: ["Array", "Dynamic Programming"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        difficulty: "Easy",
        topics: ["Linked List"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Valid Parentheses",
        url: "https://leetcode.com/problems/valid-parentheses/",
        difficulty: "Easy",
        topics: ["String", "Stack"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Search in Rotated Sorted Array",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        difficulty: "Medium",
        topics: ["Binary Search", "Array"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Find Peak Element",
        url: "https://leetcode.com/problems/find-peak-element/",
        difficulty: "Medium",
        topics: ["Binary Search"],
        sheetSlug: "neetcode-150",
      },
      {
        title: "Top K Frequent Elements",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        difficulty: "Medium",
        topics: ["Heap", "Hash Table"],
        sheetSlug: "neetcode-150",
      },
    ],
  });

  // Blind 75 dummy data
  await prisma.question.createMany({
    data: [
      {
        title: "Longest Substring Without Repeating Characters",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        difficulty: "Medium",
        topics: ["String", "Sliding Window"],
        sheetSlug: "blind-75",
      },
      {
        title: "Median of Two Sorted Arrays",
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        difficulty: "Hard",
        topics: ["Divide and Conquer", "Binary Search"],
        sheetSlug: "blind-75",
      },
      {
        title: "Longest Increasing Subsequence",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        difficulty: "Medium",
        topics: ["Dynamic Programming", "Binary Search"],
        sheetSlug: "blind-75",
      },
      {
        title: "Sort Colors",
        url: "https://leetcode.com/problems/sort-colors/",
        difficulty: "Medium",
        topics: ["Two Pointers", "Array"],
        sheetSlug: "blind-75",
      },
      {
        title: "Number of Islands",
        url: "https://leetcode.com/problems/number-of-islands/",
        difficulty: "Medium",
        topics: ["DFS", "BFS", "Grid"],
        sheetSlug: "blind-75",
      },
      {
        title: "Lowest Common Ancestor of a Binary Tree",
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        difficulty: "Medium",
        topics: ["Tree"],
        sheetSlug: "blind-75",
      },
      {
        title: "Serialize and Deserialize Binary Tree",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        difficulty: "Hard",
        topics: ["Tree", "BFS"],
        sheetSlug: "blind-75",
      },
      {
        title: "Word Ladder",
        url: "https://leetcode.com/problems/word-ladder/",
        difficulty: "Hard",
        topics: ["BFS", "Graph"],
        sheetSlug: "blind-75",
      },
    ],
  });

  console.log("Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
