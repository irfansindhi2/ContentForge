import React, { useContext, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { PreviewModeContext } from '../../PreviewModeContext';

const TextBlock = ({ content, updateContent, isEditing, onEditComplete, setEditor }) => {
  const { previewMode } = useContext(PreviewModeContext);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content,
    editable: !previewMode && isEditing,
    onUpdate: ({ editor }) => {
      updateContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full h-full',
        style: 'border: none; outline: none;',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && isEditing) {
      editor.commands.focus('end');
    }
  }, [editor, isEditing]);

  const handleBlur = () => {
    if (isEditing) {
      onEditComplete(editor.getHTML());
    }
  };

  return (
    <EditorContent
      editor={editor}
      className={`w-full h-full`}
      onBlur={handleBlur}
    />
  );
};

export default TextBlock;