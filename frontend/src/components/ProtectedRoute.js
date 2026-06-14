
import React from 'react';
import {Navigate} from 'react-router-dom'

export default function ProtectedRoute({children,role,isAdminRequired})
{
    const token = localStorage.getItem("token");
    if(!token)
    {
        return <Navigate to="/login" replace />

    }

    if(isAdminRequired && role !== 'admin')
    {
        return <Navigate to="/" replace />
    }

    return children;
}