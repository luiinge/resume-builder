import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';

const extensions = [css()];

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CssCodeEditor({ value, onChange, readOnly }: Props) {
  return (
    <CodeMirror
      value={value}
      height="560px"
      extensions={extensions}
      onChange={onChange}
      editable={!readOnly}
      basicSetup={{ foldGutter: true, autocompletion: true }}
      style={{ fontSize: 13, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}
    />
  );
}
