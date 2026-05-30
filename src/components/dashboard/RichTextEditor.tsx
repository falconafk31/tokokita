'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/shared/Toast'

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (c: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 border border-[#e5e5e5] shadow-sm',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] p-6 tiptap-editor text-[15px] leading-relaxed text-[#333]',
      },
    },
  })

  // Update editor content when content prop changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const data = await res.json()
      
      // Insert image to editor
      editor.chain().focus().setImage({ src: data.url }).run()
      
    } catch (error) {
      console.error('Error uploading image:', error)
      toast('Gagal mengunggah gambar. Pastikan bucket Supabase sudah dikonfigurasi.', 'error')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!editor) {
    return <div className="min-h-[400px] border border-[#e5e5e5] rounded-xl bg-white animate-pulse"></div>
  }

  const btnClass = (isActive: boolean) => 
    `px-3 py-1.5 rounded-md text-[13px] font-bold transition-all flex items-center justify-center min-w-[32px] ` +
    (isActive ? 'bg-[#1a1a1a] text-white shadow-md' : 'text-[#555] bg-white border border-[#e5e5e5] hover:border-[#1a1a1a] hover:text-[#1a1a1a]')

  return (
    <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#EE4D2D] focus-within:ring-1 focus-within:ring-[#EE4D2D] transition-all">
      <div className="border-b border-[#e5e5e5] bg-[#fdfdfd] p-3 flex gap-2 flex-wrap items-center">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
          <span className="italic">I</span>
        </button>
        <div className="w-[1px] h-5 bg-[#e5e5e5] mx-1"></div>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>H3</button>
        <div className="w-[1px] h-5 bg-[#e5e5e5] mx-1"></div>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>1. List</button>
        <div className="w-[1px] h-5 bg-[#e5e5e5] mx-1"></div>
        
        {/* Image Upload Button */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
        />
        <button 
          type="button" 
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()} 
          className={`px-3 py-1.5 rounded-md text-[13px] font-bold border flex items-center gap-1.5 transition-all
            ${isUploading ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-[#EE4D2D] border-[#FFD6C8] hover:bg-[#fff8f6]'}`}
        >
          {isUploading ? '⏳ Uploading...' : '🖼️ Sisipkan Gambar'}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
