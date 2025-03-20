import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create Context
export const StoreContext = createContext();

// Context Provider Component
export const StoreContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
          try{
            const tokenResponse = await axios.get('http://localhost:8000/auth/getUserCookie', {
              withCredentials: true,
            });
            console.log(tokenResponse);
            
            
            if (tokenResponse?.data){
              const user = jwtDecode(tokenResponse.data);
              if (user != ""){
                setUser(user);
              }
            }
          }
          catch(error){
            console.error("Error Fetching User's ID: ", error);
          }
        }
        fetchUser();
    }, [])
    return (
        <StoreContext.Provider value={{ user, setUser }}>
            {children}
        </StoreContext.Provider>
    )
}