import { useContext } from 'react';
import { PreviewModeContext } from '../../PreviewModeContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';

const TextEditorBlock = ({ block, updateBlockContent }) => {
  const { previewMode } = useContext(PreviewModeContext); // Access previewMode

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,       // Enable bold formatting
      Italic,     // Enable italic formatting
      Underline,  // Enable underline formatting
    ],
    content: block.content || '<p>New text block</p>',
    onUpdate({ editor }) {
      updateBlockContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null; // Return null if editor isn't initialized yet
  }

  if (previewMode) {
    // Only show plain content in preview mode
    return <div dangerouslySetInnerHTML={{ __html: block.content }} />;
  }

  // Show editor with toolbar if not in preview mode
  return (
    <div className="p-4 border rounded-md shadow-lg bg-white flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn ${editor.isActive('bold') ? 'btn-active' : ''}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn ${editor.isActive('italic') ? 'btn-active' : ''}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`btn ${editor.isActive('underline') ? 'btn-active' : ''}`}
        >
          Underline
        </button>
      </div>

      {/* TipTap Editor Content */}
      <EditorContent editor={editor} className="flex-grow min-h-[200px]" />
    </div>
  );
};

export default TextEditorBlock;