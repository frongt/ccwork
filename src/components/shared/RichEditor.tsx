import ReactQuill from 'react-quill-new';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['hr'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'blockquote', 'hr'];

/**
 * Render a configured rich-text editor using ReactQuill's Snow theme.
 *
 * Renders a controlled ReactQuill instance with a predefined toolbar and allowed formats.
 *
 * @param value - Current editor content (HTML or delta string)
 * @param onChange - Callback invoked with the updated editor content
 * @param placeholder - Optional placeholder text shown when the editor is empty
 * @returns The rendered ReactQuill element
 */
export function RichEditor({ value, onChange, placeholder, readOnly = false }: RichEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      readOnly={readOnly}
    />
  );
}
