import { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../Store';
import { Box, CircularProgress } from '@mui/material';
import { useGetUserInfo } from '../Hooks/userHook';

function AuthCheck() {
  const { dispatch } = useContext(Store);
  const { data: currentUser, isLoading, isError } = useGetUserInfo(undefined);

  useEffect(() => {
    if (currentUser) {
      dispatch({ type: 'sign-in', payload: currentUser });
    }
  }, [currentUser, dispatch]);

  if (isLoading) {
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

  if (isError) {
    return <Navigate to="/login" />;
  }

  if (currentUser) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);

  if (userInfo.name) {
    return <Outlet />;
  }

  return <AuthCheck />;
}
