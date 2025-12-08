'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function NewProjectPage() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile)
      if (!name) {
        setName(droppedFile.name.replace('.xlsx', ''))
      }
      setError(null)
    } else {
      setError('נא להעלות קובץ Excel בפורמט .xlsx')
    }
  }, [name])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile)
      if (!name) {
        setName(selectedFile.name.replace('.xlsx', ''))
      }
      setError(null)
    } else {
      setError('נא להעלות קובץ Excel בפורמט .xlsx')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !name) return

    setUploading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('excel-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Create project record
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          file_path: filePath,
          original_filename: file.name,
          status: 'processing',
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Trigger parsing (via API route)
      const parseResponse = await fetch('/api/parse-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, filePath }),
      })

      if (!parseResponse.ok) {
        console.error('Parse error:', await parseResponse.text())
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Upload error:', err)
      setError('אירעה שגיאה בהעלאת הקובץ. נסה שנית.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">העלאת תוכנית עסקית חדשה</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-primary bg-primary/10'
              : file
              ? 'border-success bg-success/10'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {file ? (
            <div>
              <div className="text-4xl mb-3">✅</div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-3 text-sm text-red-400 hover:text-red-300"
              >
                הסר קובץ
              </button>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3">📁</div>
              <p className="font-medium mb-1">גרור קובץ Excel לכאן</p>
              <p className="text-sm text-gray-400">או לחץ לבחירת קובץ</p>
              <p className="text-xs text-gray-500 mt-2">תומך בקבצי .xlsx בלבד</p>
            </div>
          )}
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium mb-2">שם הפרויקט *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors"
            placeholder="לדוגמה: הסטודיו של דנה"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">תיאור (אופציונלי)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder="תיאור קצר של התוכנית העסקית"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || !name || uploading}
          className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              מעלה ומעבד...
            </>
          ) : (
            'העלה וצור אינפוגרפיקה'
          )}
        </button>
      </form>
    </div>
  )
}
