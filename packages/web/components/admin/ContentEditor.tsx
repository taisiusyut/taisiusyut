import React, { useEffect, useMemo, useRef } from 'react';
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
}

const createFromText = (value: string) =>
  EditorState.createWithContent(ContentState.createFromText(value));

export function ContentEditor({
  className = '',
  value = '',
  onChange,
  ...props
}: ContentEditorProps) {
  const editor = React.useRef<Editor>(null);
  const prev = useRef<string>(value);
  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    createFromText(value)
  );

  const { keyBindingFn, handlePastedText } = useMemo(() => {
    function keyBindingFn(event: React.KeyboardEvent<{}>) {
      if (event.key === 'Tab') {
        setEditorState(editorState => {
          const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            tabCharacter
          );
          return EditorState.push(
            editorState,
            contentState,
            'insert-characters'
          );
        });
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

  const handleChange = onChange || (() => void 0);

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
  }, [value, handlePastedText]);

  return (
    <div className={[Classes.INPUT, className].join(' ')}>
      <Editor
        {...props}
        ref={editor}
        editorState={editorState}
        keyBindingFn={keyBindingFn}
        handlePastedText={handlePastedText}
        onChange={state => {
          const text = state.getCurrentContent().getPlainText();
          prev.current = text;

          // prevent change event trigger by focus
          if (text !== editorState.getCurrentContent().getPlainText()) {
            setEditorState(state);
            handleChange(state.getCurrentContent().getPlainText());
          }
        }}
      />
    </div>
  );
}
