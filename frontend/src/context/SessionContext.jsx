import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);
  const [sessionLoading , setSessionLoading] = useState(true)

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_PORT}/api/get-user-by-token`,
          { withCredentials: true }
        );
        setSessionData(response.data.user);
        setSessionLoading(false)
      } catch (error) {
        setSessionData(null);
        setSessionLoading(false)
      }
    };
    fetchSessionData();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionData, sessionLoading , setSessionLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
