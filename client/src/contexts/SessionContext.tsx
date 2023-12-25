import * as React from 'react';
import { useState, createContext, useContext } from 'react';

type SessionContextType = {
  username: string,
  setUsername: (username: string) => void,
};

const SessionContext = createContext<SessionContextType>({
  username: '',
  setUsername: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
  return (
    <SessionContext.Provider value={{username, setUsername}}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  return useContext(SessionContext);
}
