import React from "react";
import api from "../utils/axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [])


    const register = async (name, email, password) => {
       try {
        const {data} = await api.post('/auth/register', {name, email, password});
        setUser(data);
        return data;
       
    } catch (error) {
        console.error("Registration failed :",error);
        throw error;
       }
    }

    const login = async (email, password) => {
       try {
           console.log("ss", email);

        const {data} = await api.post('/auth/login', {email, password});
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        return data;
       
    } catch (error) {
        console.error("Login failed :",error);
        throw error;
       }
    }

    const verifyOtp = async (email, otp) => {
       try {
        console.log(email, " " , otp);
        const {data} = await api.post('/auth/verifyotp', {email, otp});
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        return data;
       
    } catch (error) {
        console.error("Otp verification failed :",error);
        throw error;
       }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{user, loading, login, logout, verifyOtp, register}}>
            {children}
        </AuthContext.Provider>
    )
}