import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            const parsedTokens = JSON.parse(tokens);
            if (parsedTokens.access && typeof parsedTokens.access === "string") {
                return jwtDecode(parsedTokens.access);
            }
        }
        return null;
    });
    
    const [loading, setLoading] = useState(true);
    const history = useNavigate();

    const loginUser = async (email, password) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            });
            const data = await response.json();

            if(response.ok) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                return true; // Login successful
            } else {
                swal.fire({
                    title: "Username or password does not exist",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                return false; // Login failed
            }
        } catch (error) {
            console.error("Login error:", error);
            return false; // Login failed
        }
    };

    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })
        if(response.status === 201){
            history("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: true,

            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: true,

            })
        }
        
    };

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};