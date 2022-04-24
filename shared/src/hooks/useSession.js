import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentSession } from "../util";

const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const [swellId, setSwellId] = useState();
  const [userAgent, setUserAgent] = useState();

  // Get current session
  useEffect(() => {
    const { swellId: foundSwellId, userAgent: foundUserAgent } =
      getCurrentSession();
    foundSwellId && setSwellId(foundSwellId);
    foundUserAgent && setUserAgent(foundUserAgent);
  }, []);

  return (
    <SessionContext.Provider value={{ swellId, userAgent }}>
      {children}
    </SessionContext.Provider>
  );
}

// Use current browser info
export function useSession() {
  return useContext(SessionContext);
}
