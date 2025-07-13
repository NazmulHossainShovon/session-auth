import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import UserProfile from './Pages/UserProfile';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import { useContext, useEffect } from 'react';
import { Store } from './Store';
import Home from './Pages/Home';
import Search from './Pages/Search';
import ProtectedRoute from './Components/ProtectedRoute';

const App: React.FC = () => {
  const { dispatch } = useContext(Store);

  useEffect(() => {
    // Retrieve user info from local storage
    const storedUserInfo = localStorage.getItem('user-info');

    if (storedUserInfo) {
      // Parse and update context store with user info
      dispatch({ type: 'sign-in', payload: JSON.parse(storedUserInfo) });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index={true} element={<Home />} />
          <Route path={`/:userName`} element={<UserProfile />} />
        </Route>

        <Route path="search/:searchQuery" element={<Search />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
