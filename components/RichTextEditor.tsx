'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-xs font-bold ${editor.isActive('bold') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-xs italic ${editor.isActive('italic') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-xs line-through ${editor.isActive('strike') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          S
        </button>
        <span className="w-px bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-xs font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          H3
        </button>
        <span className="w-px bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-xs ${editor.isActive('bulletList') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-xs ${editor.isActive('orderedList') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          1. List
        </button>
        <span className="w-px bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded text-xs ${editor.isActive('blockquote') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          &ldquo; Quote
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          className={`px-2 py-1 rounded text-xs ${editor.isActive('link') ? 'bg-slate-800 text-white' : 'hover:bg-slate-200'}`}
        >
          🔗 Link
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="px-2 py-1 rounded text-xs hover:bg-slate-200 text-red-500"
          >
            Remove Link
          </button>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
