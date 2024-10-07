import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter as HighlightIcon,
  X,
} from 'lucide-react';

const TiptapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="tiptap-toolbar flex space-x-2">
      {/* Text Formatting Buttons */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bold') ? 'btn-active' : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('italic') ? 'btn-active' : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('underline') ? 'btn-active' : ''}`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('strike') ? 'btn-active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('code') ? 'btn-active' : ''}`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('highlight') ? 'btn-active' : ''}`}
        title="Highlight"
      >
        <HighlightIcon className="w-4 h-4" />
      </button>

      {/* Link Buttons */}
      {editor.isActive('link') ? (
        <button
          onClick={removeLink}
          className="btn btn-sm btn-ghost text-red-500"
          title="Remove Link"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => setShowLinkInput((prev) => !prev)}
          className={`btn btn-sm btn-ghost ${showLinkInput ? 'btn-active' : ''}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      )}

      {showLinkInput && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="input input-sm input-bordered"
          />
          <button onClick={addLink} className="btn btn-sm btn-primary">
            OK
          </button>
        </div>
      )}

      {/* Alignment Buttons */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`btn btn-sm btn-ghost ${editor.isActive({ textAlign: 'left' }) ? 'btn-active' : ''}`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`btn btn-sm btn-ghost ${editor.isActive({ textAlign: 'center' }) ? 'btn-active' : ''}`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`btn btn-sm btn-ghost ${editor.isActive({ textAlign: 'right' }) ? 'btn-active' : ''}`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`btn btn-sm btn-ghost ${editor.isActive({ textAlign: 'justify' }) ? 'btn-active' : ''}`}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      {/* Heading Buttons */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('heading', { level: 1 }) ? 'btn-active' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('heading', { level: 3 }) ? 'btn-active' : ''}`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      {/* List Buttons */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm btn-ghost ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TiptapToolbar;