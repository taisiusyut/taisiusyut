import React from 'react';
import {
  Editor,
  EditorState,
  Modifier,
  ContentState,
  getDefaultKeyBinding
} from 'draft-js';
import { Classes } from '@blueprintjs/core';
import { Control } from '@/utils/form';
import classes from './Chapter.module.scss';
import 'draft-js/dist/Draft.css';

const tabCharacter = '	';

export function ChapterContentEditor({ value, onChange }: Control<string>) {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromText(value || ''))
  );

  const editor = React.useRef<Editor>(null);

  function focusEditor() {
    editor.current?.focus();
  }

  return (
    <div
      className={[Classes.INPUT, classes['editor-container']].join(' ')}
      onClick={focusEditor}
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={state => {
          setEditorState(state);
          onChange && onChange(state.getCurrentContent().getPlainText());
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
          return 'handled';
        }}
      />
    </div>
  );
}
