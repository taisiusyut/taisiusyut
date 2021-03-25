import React, { CSSProperties } from 'react';
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

const relativeStyle: CSSProperties = {
  position: 'relative'
};

const absoluteStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
};

const createFromText = (value?: string) =>
  EditorState.createWithContent(ContentState.createFromText(value || ''));

export function ContentEditor({
  className = '',
  value,
  onChange,
  ...props
}: ContentEditorProps) {
  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    createFromText(value)
  );

  const editor = React.useRef<Editor>(null);

  function focusEditor() {
    editor.current?.focus();
    setEditorState(EditorState.moveFocusToEnd(editorState));
  }

  const handleChange = onChange || (() => void 0);

  return (
    <div className={[Classes.INPUT, className].join(' ')} style={relativeStyle}>
      <div style={absoluteStyle} onClick={focusEditor}></div>
      <Editor
        {...props}
        ref={editor}
        editorState={editorState}
        onChange={state => {
          setEditorState(state);
          const isEqual =
            state.getCurrentContent() === editorState.getCurrentContent();
          if (!isEqual) {
            handleChange(state.getCurrentContent().getPlainText());
          }
        }}
        keyBindingFn={event => {
          if (event.key === 'Tab') {
            const newState = Modifier.replaceText(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              tabCharacter
            );
            const newEditorState = EditorState.push(
              editorState,
              newState,
              'insert-characters'
            );
            setEditorState(newEditorState);
            return 'handled';
          }
          return getDefaultKeyBinding(event);
        }}
        handlePastedText={(text: string, _html, editorState) => {
          // https://stackoverflow.com/a/58234972/9633867
          const pastedBlocks = ContentState.createFromText(text).getBlockMap();
          const newState = Modifier.replaceWithFragment(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            pastedBlocks
          );
          const newEditorState = EditorState.push(
            editorState,
            newState,
            'insert-fragment'
          );

          setEditorState(newEditorState);

          handleChange(text);

          return 'handled';
        }}
      />
    </div>
  );
}
