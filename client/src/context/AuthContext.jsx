import { useContext, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userConnected, setUserConnected] = useState(null);

  console.log(userConnected);
  const login = async (values) => {
    setUserConnected(values);
  };

  const logout = () => {
    setUserConnected(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userConnected,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// // context/AuthContext.jsx
// /*
//   AuthContext Implementation
//   - Manages user authentication state
//   - Provides login, logout, and user verification
//   - Handles token management securely
//   - Includes error handling and loading states
// */

// import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
// import toast from 'react-hot-toast';

// // Auth Context
// const AuthContext = createContext();

// // Auth reducer for state management
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'AUTH_START':
//       return { ...state, loading: true, error: null };

//     case 'AUTH_SUCCESS':
//       return {
//         ...state,
//         loading: false,
//         user: action.payload.user,
//         isAuthenticated: true,
//         error: null,
//       };

//     case 'AUTH_FAILURE':
//       return {
//         ...state,
//         loading: false,
//         user: null,
//         isAuthenticated: false,
//         error: action.payload.error,
//       };

//     case 'LOGOUT':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//         error: null,
//       };

//     case 'UPDATE_USER':
//       return {
//         ...state,
//         user: { ...state.user, ...action.payload },
//       };

//     case 'CLEAR_ERROR':
//       return { ...state, error: null };

//     default:
//       return state;
//   }
// };

// // Initial state
// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: true, // Start with loading true to check existing auth
//   error: null,
// };

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // API base URL - adjust as needed
//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

//   // Generic API request function
//   const apiRequest = useCallback(async (url, options = {}) => {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       credentials: 'include', // Include cookies for auth
//       ...options,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, config);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || data.error || 'Request failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('API Request failed:', error);
//       throw error;
//     }
//   }, [API_BASE_URL]);

//   // Check if user is already authenticated (on app load)
//   const checkAuthStatus = useCallback(async () => {
//     try {
//       dispatch({ type: 'AUTH_START' });
//       const data = await apiRequest('/auth/verify');

//       dispatch({
//         type: 'AUTH_SUCCESS',
//         payload: { user: data.user },
//       });
//     } catch (error) {
//       dispatch({
//         type: 'AUTH_FAILURE',
//         payload: { error: error.message },
//       });
//     }
//   }, [apiRequest]);

//   // Login function
//   const login = useCallback(async (credentials) => {
//     try {
//       dispatch({ type: 'AUTH_START' });

//       const data = await apiRequest('/auth/login', {
//         method: 'POST',
//         body: JSON.stringify(credentials),
//       });

//       dispatch({
//         type: 'AUTH_SUCCESS',
//         payload: { user: data.user },
//       });

//       toast.success('Welcome back!');
//       return { success: true, user: data.user };
//     } catch (error) {
//       dispatch({
//         type: 'AUTH_FAILURE',
//         payload: { error: error.message },
//       });

//       toast.error(error.message || 'Login failed');
//       return { success: false, error: error.message };
//     }
//   }, [apiRequest]);

//   // Register function
//   const register = useCallback(async (userData) => {
//     try {
//       dispatch({ type: 'AUTH_START' });

//       const data = await apiRequest('/auth/register', {
//         method: 'POST',
//         body: JSON.stringify(userData),
//       });

//       dispatch({
//         type: 'AUTH_SUCCESS',
//         payload: { user: data.user },
//       });

//       toast.success('Account created successfully!');
//       return { success: true, user: data.user };
//     } catch (error) {
//       dispatch({
//         type: 'AUTH_FAILURE',
//         payload: { error: error.message },
//       });

//       toast.error(error.message || 'Registration failed');
//       return { success: false, error: error.message };
//     }
//   }, [apiRequest]);

//   // Logout function
//   const logout = useCallback(async () => {
//     try {
//       await apiRequest('/auth/logout', {
//         method: 'POST',
//       });
//     } catch (error) {
//       console.error('Logout request failed:', error);
//       // Continue with logout even if request fails
//     }

//     dispatch({ type: 'LOGOUT' });
//     toast.success('Logged out successfully');
//   }, [apiRequest]);

//   // Update user profile
//   const updateUser = useCallback(async (updates) => {
//     try {
//       const data = await apiRequest('/auth/profile', {
//         method: 'PATCH',
//         body: JSON.stringify(updates),
//       });

//       dispatch({
//         type: 'UPDATE_USER',
//         payload: data.user,
//       });

//       toast.success('Profile updated successfully');
//       return { success: true, user: data.user };
//     } catch (error) {
//       toast.error(error.message || 'Update failed');
//       return { success: false, error: error.message };
//     }
//   }, [apiRequest]);

//   // Change password
//   const changePassword = useCallback(async (passwordData) => {
//     try {
//       await apiRequest('/auth/change-password', {
//         method: 'POST',
//         body: JSON.stringify(passwordData),
//       });

//       toast.success('Password changed successfully');
//       return { success: true };
//     } catch (error) {
//       toast.error(error.message || 'Password change failed');
//       return { success: false, error: error.message };
//     }
//   }, [apiRequest]);

//   // Forgot password
//   const forgotPassword = useCallback(async (email) => {
//     try {
//       await apiRequest('/auth/forgot-password', {
//         method: 'POST',
//         body: JSON.stringify({ email }),
//       });

//       toast.success('Password reset email sent');
//       return { success: true };
//     } catch (error) {
//       toast.error(error.message || 'Request failed');
//       return { success: false, error: error.message };
//     }
//   }, [apiRequest]);

//   // Clear error
//   const clearError = useCallback(() => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   }, []);

//   // Check auth status on mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   // Context value
//   const value = {
//     // State
//     user: state.user,
//     isAuthenticated: state.isAuthenticated,
//     loading: state.loading,
//     error: state.error,

//     // Actions
//     login,
//     register,
//     logout,
//     updateUser,
//     changePassword,
//     forgotPassword,
//     clearError,
//     checkAuthStatus,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return context;
// };

// // Higher-order component for components that require auth
// export const withAuth = (Component) => {
//   return function AuthenticatedComponent(props) {
//     const { isAuthenticated, loading } = useAuth();

//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (!isAuthenticated) {
//       return <div>Please log in to access this content.</div>;
//     }

//     return <Component {...props} />;
//   };
// };
