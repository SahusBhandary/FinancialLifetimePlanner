import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Define fetchUser function
    const fetchUser = async () => {
        try {
            const tokenResponse = await axios.get('http://localhost:8000/auth/getUserCookie', {
                withCredentials: true,
            });

            if (tokenResponse?.data) {
                const cookie = jwtDecode(tokenResponse.data);
                const userResponse = await axios.get(`http://localhost:8000/getUser/${cookie.googleID}`);
                const user = userResponse.data;

                if (user) {
                    setUser(user);
                }
            }
        } catch (error) {
            console.error("Error Fetching User's ID: ", error);
        }
    };

    // Fetch user data on component mount
    useEffect(() => {
        fetchUser();
    }, []);

    // Expose user, setUser, and refreshUser (fetchUser) to consumers
    return (
        <StoreContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
            {children}
        </StoreContext.Provider>
    );
};