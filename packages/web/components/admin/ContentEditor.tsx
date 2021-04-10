import React, {
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  ReactNode
} from 'react';
import {
  Editor,
  EditorState,
  EditorProps,
  Modifier,
  ContentState,
  getDefaultKeyBinding
} from 'draft-js';
import { Classes } from '@blueprintjs/core';
import { Control } from '@/utils/form';
import 'draft-js/dist/Draft.css';

const tabCharacter = '	';
export interface ContentEditorProps
  extends Control<string>,
    Partial<Omit<EditorProps, 'onChange'>> {
  className?: string;
  children?: ReactNode;
}

export type ContentEditorRef = {
  insertText: (text: string) => void;
};

const createFromText = (value: string) =>
  EditorState.createWithContent(ContentState.createFromText(value));

export function inserText(editorState: EditorState, text: string) {
  const contentState = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text
  );
  return EditorState.push(editorState, contentState, 'insert-characters');
}

export const ContentEditor = React.forwardRef<
  ContentEditorRef,
  ContentEditorProps
>(({ className = '', value = '', onChange, children, ...props }, ref) => {
  const editor = React.useRef<Editor>(null);
  const prev = useRef<string>(value);
  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    createFromText(value)
  );

  const { keyBindingFn, handlePastedText } = useMemo(() => {
    function keyBindingFn(event: React.KeyboardEvent<{}>) {
      if (event.key === 'Tab') {
        setEditorState(editorState => inserText(editorState, tabCharacter));
        return 'handled';
      }
      return getDefaultKeyBinding(event);
    }

    const handlePastedText: EditorProps['handlePastedText'] = (
      text,
      _html,
      editorState
    ) => {
      // https://stackoverflow.com/a/58234972/9633867
      const pastedBlocks = ContentState.createFromText(text).getBlockMap();
      const contentState = Modifier.replaceWithFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        pastedBlocks
      );
      setEditorState(
        EditorState.push(editorState, contentState, 'change-block-data')
      );
      return 'handled';
    };

    return { keyBindingFn, handlePastedText };
  }, []);

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      setEditorState(editorState => inserText(editorState, text));
    }
  }));

  // for value change by form instance (e.g. file upload)
  useEffect(() => {
    setEditorState(editorState => {
      if (prev.current === value) {
        return editorState;
      }
      prev.current = value;

      return EditorState.push(
        editorState,
        ContentState.createFromText(value),
        'change-block-data'
      );
    });
  }, [value]);

  useEffect(() => {
    const text = editorState.getCurrentContent().getPlainText();
    if (prev.current !== text) {
      prev.current = text;
      onChange && onChange(text);
    }
  }, [editorState, onChange]);

  return (
    <div className={[Classes.INPUT, className].join(' ')}>
      {children}
      <Editor
        {...props}
        ref={editor}
        editorState={editorState}
        keyBindingFn={keyBindingFn}
        handlePastedText={handlePastedText}
        onChange={setEditorState}
      />
    </div>
  );
});
