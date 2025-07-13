import { Link, useNavigate } from 'react-router-dom';
import AvatarMenu from '../AvatarMenu';
import { useContext, useState } from 'react';
import { Store } from '../../Store';
import Input from '../Input';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import FriendReqsMenu from '../FriendReqsMenu';
import { Drawer } from '@mui/material';
import FriendList from '../FriendList';

function Navbar() {
  const {
    state: { userInfo },
  } = useContext(Store);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleSearchQuery = () => {
    navigate(`/search/${searchQuery}`);
  };

  return (
    <div className=" fixed top-0 left-0 z-50 w-full flex justify-between md:justify-start pl-5 items-center gap-5 bg-TK-background  text-white h-[60px]">
      {userInfo.name ? (
        <>
          <Link to={'/'}>Home</Link>
          <AvatarMenu />
          <div className="hidden md:flex  flex-row ml-5 items-center gap-2">
            <Input
              placeholder="Search anything..."
              onChange={e => setSearchQuery(e.target.value)}
            />
            <SearchIcon
              onClick={handleSearchQuery}
              className=" cursor-pointer"
            />
          </div>
          <FriendReqsMenu />
          <FriendList />
          <MenuIcon className=" xl:invisible" onClick={toggleDrawer(true)} />
          <Drawer open={open} onClose={toggleDrawer(false)}>
            <div className=" flex m-3 flex-row ml-5 items-center gap-2">
              <Input
                placeholder="Search anything..."
                onChange={e => setSearchQuery(e.target.value)}
              />
              <SearchIcon
                onClick={handleSearchQuery}
                className=" cursor-pointer"
              />
            </div>
          </Drawer>
        </>
      ) : (
        <>
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </>
      )}
    </div>
  );
}

export default Navbar;
