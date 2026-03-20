'use client'

import { updateProgress } from '@/app/actions'
import { useState, useTransition, useCallback, useRef, useEffect } from 'react'

type ProgressStatus = 'todo' | 'in_progress' | 'solved' | 'skipped'

interface QuestionCardProps {
  question: {
    id: string
    title: string
    url: string
    difficulty: string
    topics: string[]
  }
  initialStatus: ProgressStatus
  initialNotes: string
}

const STATUS_OPTIONS: { value: ProgressStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'Todo', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'solved', label: 'Solved', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'skipped', label: 'Skipped', color: 'bg-orange-100 text-orange-700 border-orange-300' },
]

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

export default function QuestionCard({
  question,
  initialStatus,
  initialNotes,
}: QuestionCardProps) {
  const [status, setStatus] = useState<ProgressStatus>(initialStatus)
  const [notes, setNotes] = useState(initialNotes)
  const [isPending, startTransition] = useTransition()
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestNotesRef = useRef(notes)

  // Keep ref in sync
  useEffect(() => {
    latestNotesRef.current = notes
  }, [notes])

  const saveProgress = useCallback(
    (newStatus: ProgressStatus, newNotes: string) => {
      startTransition(async () => {
        await updateProgress(question.id, newStatus, newNotes)
      })
    },
    [question.id]
  )

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProgressStatus
    setStatus(newStatus)
    saveProgress(newStatus, latestNotesRef.current)
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)

    // Debounce auto-save for notes (800ms)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      saveProgress(status, newNotes)
    }, 800)
  }

  const handleNotesBlur = () => {
    // Save immediately on blur
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    saveProgress(status, notes)
  }

  const currentStatusOption = STATUS_OPTIONS.find((s) => s.value === status)
  const difficultyStyle =
    DIFFICULTY_STYLES[question.difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800'

  return (
    <div
      className={`relative p-4 border rounded-lg shadow-sm bg-white transition-all duration-200 ${
        status === 'solved'
          ? 'border-green-300 bg-green-50/30'
          : status === 'in_progress'
          ? 'border-blue-300 bg-blue-50/20'
          : status === 'skipped'
          ? 'border-orange-200 opacity-60'
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
        <a
          href={question.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-lg text-blue-600 hover:underline flex-1 mr-3"
        >
          {question.title}
        </a>
        <span className={`text-xs px-2 py-1 rounded font-medium shrink-0 ${difficultyStyle}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.topics.map((topic, i) => (
          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {topic}
          </span>
        ))}
      </div>

      {/* Status + Notes */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2 pt-3 border-t border-gray-100">
        {/* Status dropdown */}
        <div className="shrink-0">
          <label htmlFor={`status-${question.id}`} className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            id={`status-${question.id}`}
            value={status}
            onChange={handleStatusChange}
            className={`text-sm px-2 py-1.5 rounded border font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              currentStatusOption?.color || ''
            }`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes textbox */}
        <div className="flex-1">
          <label htmlFor={`notes-${question.id}`} className="block text-xs font-medium text-gray-500 mb-1">
            Notes
          </label>
          <textarea
            id={`notes-${question.id}`}
            value={notes}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Add your notes here..."
            rows={2}
            className="w-full text-sm px-2 py-1.5 rounded border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-300"
          />
        </div>
      </div>
    </div>
  )
}
