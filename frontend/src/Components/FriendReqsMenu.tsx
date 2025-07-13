import { Avatar, Badge, Menu, MenuItem, Snackbar } from '@mui/material';
import { socket, Store } from '../Store';
import { Link } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useContext, useEffect, useState } from 'react';

export default function FriendReqsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    socket.on('friendRequest', data => {
      dispatch({ type: 'new-friend-req', payload: data.from });
      setOpenSnackbar(true);
    });

    return () => {
      socket.off('friendRequest');
    };
  }, []);

  return (
    <div>
      <Badge badgeContent={userInfo.receivedFriendReqs?.length} color="error">
        <PeopleAltIcon className="cursor-pointer" onClick={handleClick} />
      </Badge>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="p-2"
      >
        <MenuItem disabled>Friend Requests</MenuItem>
        {userInfo.receivedFriendReqs?.map(user => (
          <MenuItem onClick={handleClose} key={user}>
            <Link className="flex flex-row gap-2" to={`/${user}`}>
              <Avatar src={`https://nazmul.sirv.com/facebook/${user}.png`} />
              <div>{user}</div>
            </Link>
          </MenuItem>
        ))}
        {userInfo.receivedFriendReqs?.length === 0 && (
          <MenuItem disabled>No Friend Requests</MenuItem>
        )}
      </Menu>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message="You have a new friend request"
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}
