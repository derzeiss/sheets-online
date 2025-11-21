import { useState } from 'react';

export type BasicState = 'idle' | 'loading' | 'success' | 'error' | 'info';

export const useStateMachine = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const [msg, setMsg] = useState<string | null>(null);

  const nextState = (state: T, msg?: string | null) => {
    setState(state);
    if (msg) {
      setMsg(msg);
    } else {
      setMsg(null);
    }
  };

  return { state, msg, nextState };
};

export const useBasicStateMachine = (initialState: BasicState = 'idle') => {
  return useStateMachine(initialState);
};
