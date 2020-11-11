import { useContext } from 'react';
import { StateContext, ActionContext } from './authProvider';

export function useAuthState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

export function useAuthActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within a AuthProvider');
  }
  return context;
}

export function useAuth() {
  return [useAuthState(), useAuthActions()] as const;
}

export { AuthProvider } from './authProvider';
