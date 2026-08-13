'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, ClipboardPaste } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResumeUploader({ onTextExtracted, label = 'YOUR RESUME' }) {
  const [tab, setTab] = useState('upload') // 'upload' | 'paste'
  const [file, setFile] = useState(null)
  const [pasteText, setPasteText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // ── Proper PDF text extraction using pdf.js ──────────────────────
  async function extractPDFText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          // Load pdf.js from CDN
          if (!window.pdfjsLib) {
            await new Promise((res, rej) => {
              const script = document.createElement('script')
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
              script.onload = res
              script.onerror = rej
              document.head.appendChild(script)
            })
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          }

          const typedArray = new Uint8Array(e.target.result)
          const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise
          let fullText = ''

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            const pageText = content.items.map(item => item.str).join(' ')
            fullText += pageText + '\n'
          }

          const cleaned = fullText.replace(/\s+/g, ' ').trim()
          if (cleaned.length < 50) {
            reject(new Error('PDF appears to be scanned/image-based. Please use the "Paste Text" tab instead.'))
          } else {
            resolve(cleaned)
          }
        } catch (err) {
          reject(new Error('Could not read PDF. Try the "Paste Text" tab to paste your resume directly.'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  async function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }
    setFile(selected)
    setError('')
    setExtracting(true)

    try {
      toast.loading('Reading your PDF...', { id: 'pdf' })
      const text = await extractPDFText(selected)
      toast.success('Resume loaded successfully!', { id: 'pdf' })
      onTextExtracted(text)
    } catch (err) {
      setError(err.message)
      toast.error(err.message, { id: 'pdf' })
      setFile(null)
    } finally {
      setExtracting(false)
    }
  }

  function handlePasteSubmit() {
    if (pasteText.trim().length < 100) {
      toast.error('Please paste more resume content (at least 100 characters)')
      return
    }
    onTextExtracted(pasteText.trim())
    toast.success('Resume text loaded!')
  }

  return (
    <div>
      <label className="text-xs font-semibold mb-2 block" style={{ color: '#94A3B8' }}>{label}</label>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl mb-3" style={{ background: '#0F1629', border: '1px solid #2D3F5E' }}>
        {[
          { id: 'upload', icon: Upload, label: 'Upload PDF' },
          { id: 'paste', icon: ClipboardPaste, label: 'Paste Text' },
        ].map(({ id, icon: Icon, label: tabLabel }) => (
          <button key={id} onClick={() => { setTab(id); setError('') }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === id ? '#1E293B' : 'transparent',
              color: tab === id ? '#F1F5F9' : '#64748B',
              boxShadow: tab === id ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            }}>
            <Icon size={12} />{tabLabel}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div>
          <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          {!file ? (
            <div className="rounded-xl p-6 text-center" style={{ border: '2px dashed #2D3F5E', background: 'rgba(10,15,30,0.4)' }}>
              {extracting ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#2D3F5E', borderTopColor: '#6366F1' }} />
                  <p className="text-sm" style={{ color: '#94A3B8' }}>Reading your PDF...</p>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mx-auto mb-2" style={{ color: '#64748B' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: '#F1F5F9' }}>Select your resume PDF</p>
                  <p className="text-xs mb-4" style={{ color: '#64748B' }}>PDF with selectable text only</p>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    <Upload size={14} /> Choose PDF File
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.3)' }}>
              <CheckCircle size={20} style={{ color: '#84CC16' }} />
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#84CC16' }}>{file.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Text extracted successfully</p>
              </div>
              <button onClick={() => { setFile(null); onTextExtracted(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="p-1.5 rounded-lg hover:bg-white/5">
                <X size={14} style={{ color: '#94A3B8' }} />
              </button>
            </div>
          )}
          {error && (
            <div className="mt-3 p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <AlertCircle size={14} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs" style={{ color: '#F87171' }}>{error}</p>
                <button onClick={() => setTab('paste')} className="text-xs font-semibold mt-1 underline" style={{ color: '#818CF8' }}>
                  Switch to Paste Text →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paste tab */}
      {tab === 'paste' && (
        <div>
          <div className="mb-2 p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <FileText size={13} style={{ color: '#818CF8', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              Open your resume in Google Docs or Word → Select All (Ctrl+A) → Copy (Ctrl+C) → Paste below
            </p>
          </div>
          <textarea
            className="input-field resize-none"
            rows={8}
            placeholder="Paste your full resume text here...&#10;&#10;Name, contact info, skills, experience, education..."
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: pasteText.length >= 100 ? '#84CC16' : '#64748B' }}>
              {pasteText.length} characters {pasteText.length >= 100 ? '✓' : '(min 100)'}
            </span>
            <button
              onClick={handlePasteSubmit}
              disabled={pasteText.trim().length < 100}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: pasteText.trim().length >= 100 ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#1E293B',
                color: pasteText.trim().length >= 100 ? 'white' : '#475569',
                cursor: pasteText.trim().length >= 100 ? 'pointer' : 'not-allowed',
              }}>
              <CheckCircle size={13} /> Use This Resume
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
