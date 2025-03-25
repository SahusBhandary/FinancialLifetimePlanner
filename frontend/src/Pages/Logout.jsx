import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.get('http://localhost:8000/auth/logout', { withCredentials: true });
                navigate("/", { replace: true });
                window.location.reload(); // ✅ Refreshes the page after navigation
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        logoutUser();
    }, [navigate]);

    return null; // No UI needed since it's handling redirect
};

export default Logout;