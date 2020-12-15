import { useContext } from 'react';
import { StateContext, ActionContext } from './bookShelfProvider';

export function useBookShelfState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useBookShelfState must be used within a BookShelfProvider'
    );
  }
  return context;
}

export function useBookShelfActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'useBookShelfActions must be used within a BookShelfProvider'
    );
  }
  return context;
}

export function useBookShelf() {
  return [useBookShelfState(), useBookShelfActions()] as const;
}
