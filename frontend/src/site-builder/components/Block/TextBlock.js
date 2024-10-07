import React, { useContext, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { PreviewModeContext } from '../../PreviewModeContext';

const TextBlock = ({ content, updateContent, isEditing, onEditComplete, setEditor, onHeightChange }) => {
  const { previewMode } = useContext(PreviewModeContext);
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: content,
    editable: !previewMode && isEditing,
    onUpdate: ({ editor }) => {
      updateContent(editor.getHTML());
      if (editorRef.current) {
        onHeightChange(editorRef.current.offsetHeight);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full',
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

  useEffect(() => {
    if (editorRef.current) {
      onHeightChange(editorRef.current.offsetHeight);
    }
  }, [content, onHeightChange]);

  const handleBlur = (event) => {
    setTimeout(() => {
      const focusedElement = document.activeElement;
      if (
        focusedElement &&
        (focusedElement.closest('.tiptap-toolbar') || focusedElement.closest('.ProseMirror'))
      ) {
        // Focus is still within editor or toolbar, do not end editing
        return;
      }
      if (isEditing) {
        onEditComplete(editor.getHTML());
      }
    }, 0);
  };

  return (
    <EditorContent
      editor={editor}
      className="w-full"
      onBlur={handleBlur}
      ref={editorRef}
    />
  );
};

export default TextBlock;