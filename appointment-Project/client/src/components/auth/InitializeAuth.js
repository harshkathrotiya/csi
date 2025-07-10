import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../config/axios';

const InitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch({
            type: 'auth/initializeAuth',
            payload: {
              user: response.user,
              token,
              isAuthenticated: true
            }
          });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

export default InitializeAuth;