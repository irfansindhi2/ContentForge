import React, { useContext } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { PreviewModeContext } from '../../PreviewModeContext';

const TextBlock = ({ content, updateContent }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content,
    editable: !previewMode,
    onUpdate: ({ editor }) => {
      updateContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full h-full',
      },
    },
  });

  return (
      <EditorContent
        editor={editor}
        className="w-full h-full"
      />
  );
};

export default TextBlock;