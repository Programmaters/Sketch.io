import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import {PlayerType} from "../domain/PlayerType";

type SessionType = PlayerType;

type SessionContextType = {
  session?: SessionType,
  setSession: (session: SessionType) => void,
};

const SessionContext = createContext<SessionContextType>({
  session: undefined,
  setSession: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionType>();
  return (
    <SessionContext.Provider value={{session, setSession}}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  return useContext(SessionContext);
}
