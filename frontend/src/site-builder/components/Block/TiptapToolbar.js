import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

const TiptapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-toolbar flex space-x-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bold') ? 'btn-active' : ''}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('italic') ? 'btn-active' : ''}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('underline') ? 'btn-active' : ''}`}
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TiptapToolbar;