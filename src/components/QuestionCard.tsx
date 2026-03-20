'use client'

import { updateProgress } from '@/app/actions'
import { useState, useTransition, useCallback, useRef, useEffect } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { Checkbox } from '@/components/ui/checkbox'

interface QuestionCardProps {
  question: {
    id: string
    title: string
    url: string
    difficulty: string
    topics: string[]
  }
  isCompleted: boolean
  initialNotes: string
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

export default function QuestionCard({
  question,
  isCompleted: initialCompleted,
  initialNotes,
}: QuestionCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [notes, setNotes] = useState(initialNotes)
  const [isPending, startTransition] = useTransition()
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestNotesRef = useRef(notes)
  
  const { isSignedIn } = useUser()
  const clerk = useClerk()

  // Keep ref in sync
  useEffect(() => {
    latestNotesRef.current = notes
  }, [notes])

  const saveProgress = useCallback(
    (completedStatus: boolean, newNotes: string) => {
      startTransition(async () => {
        await updateProgress(question.id, completedStatus, newNotes)
      })
    },
    [question.id]
  )

  const handleToggleComplete = (checked: boolean) => {
    if (!isSignedIn) {
      clerk.openSignIn()
      return
    }
    
    setIsCompleted(checked)
    saveProgress(checked, latestNotesRef.current)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSignedIn) {
      clerk.openSignIn()
      return
    }

    const newNotes = e.target.value
    setNotes(newNotes)

    // Debounce auto-save for notes (800ms)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      saveProgress(isCompleted, newNotes)
    }, 800)
  }

  const handleNotesBlur = () => {
    if (!isSignedIn) return
    // Save immediately on blur
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    saveProgress(isCompleted, notes)
  }

  const difficultyStyle =
    DIFFICULTY_STYLES[question.difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800'

  return (
    <div
      className={`relative p-4 border rounded-lg shadow-sm bg-white transition-all duration-200 ${
        isCompleted
          ? 'border-green-300 bg-green-50/30'
          : 'border-gray-200'
      }`}
    >
      {/* Saving indicator */}
      {isPending && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 animate-pulse">
          Saving...
        </div>
      )}

      {/* Header: title + difficulty */}
      <div className="flex justify-between items-start mb-3">
        <label className="flex items-center gap-3 flex-1 mb-1 cursor-pointer">
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={handleToggleComplete}
            className={`w-5 h-5 rounded border-2 ${isCompleted ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500' : 'border-gray-300'}`}
          />
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`font-semibold text-lg hover:underline flex-1 transition-colors ${
              isCompleted ? 'text-green-700 line-through opacity-70' : 'text-blue-600'
            }`}
          >
            {question.title}
          </a>
        </label>
        
        <span className={`text-xs px-2 py-1 rounded font-medium shrink-0 ${difficultyStyle}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-3 pl-8">
        {question.topics.map((topic, i) => (
          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {topic}
          </span>
        ))}
      </div>

      {/* Notes textbox */}
      <div className="mt-2 pt-3 border-t border-gray-100 px-8">
        <label htmlFor={`notes-${question.id}`} className="block text-xs font-medium text-gray-400 mb-1">
          {isCompleted ? 'Notes (Solved)' : 'Notes'}
        </label>
        <textarea
          id={`notes-${question.id}`}
          value={notes}
          onChange={handleNotesChange}
          onBlur={handleNotesBlur}
          placeholder="Add your notes here..."
          rows={2}
          className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-300 bg-gray-50/50 hover:bg-white transition-colors"
        />
      </div>
    </div>
  )
}
