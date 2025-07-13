import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../Store';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);
  if (localStorage.getItem('user-info')) {
    if (userInfo) {
      return <Outlet />;
    } else {
      return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      );
    }
  } else {
    return <Navigate to="/login" />;
  }
}
