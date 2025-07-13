import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../Store';
import { Box, CircularProgress } from '@mui/material';
import { fetchCurrentUser } from '../Hooks/userHook';

export default function PublicOnlyRoute() {
  const { dispatch } = useContext(Store);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          dispatch({ type: 'sign-in', payload: user });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking current user:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
