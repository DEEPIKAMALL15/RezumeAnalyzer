import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import LoadingScreen from "../../../components/LoadingScreen";

const Protected = ({children}) => {
    const { loading, user } = useAuth()

    if(loading){
        return (
            <LoadingScreen 
                title="Authenticating" 
                subtitle="Verifying your session credentials..." 
                steps={["Checking secure login session...", "Loading user preferences..."]} 
            />
        )
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected