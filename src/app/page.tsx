import prisma from "@/lib/prisma";
import { Question } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h2 className="text-2xl font-bold">Welcome to AlgoMerge</h2>
        <p className="text-gray-600">Please sign in to view your problem sheet.</p>
        <div className="bg-black text-white px-4 py-2 rounded-md">
          <SignInButton />
        </div>
      </div>
    );
  }

  let questions: Question[] = [];
  let dbError = false;

  try {
    // Attempt to fetch questions from the database.
    // If DATABASE_URL is invalid, this will throw an error.
    questions = await prisma.question.findMany({
      orderBy: { createdAt: "asc" }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    dbError = true;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Starting Sheet</h2>
      
      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-semibold">Unable to connect to the database.</p>
          <p className="text-sm mt-1">
            Please ensure you have configured your database credentials in <code>.env.local</code> and run the seed script:
            <br />
            <code>npx prisma db push</code>
            <br />
            <code>npm run prisma seed</code>
          </p>
        </div>
      )}

      {!dbError && questions.length === 0 && (
        <div className="text-gray-500 italic">
          No questions found. Please run <code>npm run prisma seed</code> after setting up the database.
        </div>
      )}

      {!dbError && questions.length > 0 && (
        <div className="grid gap-4 mt-6">
          {questions.map((q) => (
            <a 
              key={q.id}
              href={q.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 border rounded-lg hover:border-gray-400 transition-colors shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-blue-600 hover:underline">{q.title}</h3>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  q.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                  q.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {q.topics.map((topic: string, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
