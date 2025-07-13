import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import UserProfile from './Pages/UserProfile';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Search from './Pages/Search';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicOnlyRoute from './Components/PublicOnlyRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index={true} element={<Home />} />
          <Route path={`/:userName`} element={<UserProfile />} />
        </Route>

        <Route path="search/:searchQuery" element={<Search />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
