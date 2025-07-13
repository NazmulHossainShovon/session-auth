import { PropsWithChildren, createContext, useEffect, useReducer } from 'react';
import { AppState, User } from './Types/types';
import { io } from 'socket.io-client';

const initialState: AppState = {
  userInfo: {
    name: '',
    email: '',
    friends: [],
    receivedFriendReqs: [],
    sentFriendReqs: [],
    token: '',
    profileImage: '',
  },
  searchQuery: '',
};

const socket = io(import.meta.env.VITE_API_URL);

type Action =
  | { type: 'sign-in'; payload: User }
  | { type: 'sign-out' }
  | { type: 'new-friend-req'; payload: string };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'sign-in':
      
      socket.emit('storeUser', action.payload.name);
      return { ...state, userInfo: action.payload };
    case 'sign-out':
      return {
        ...state,
        userInfo: {
          name: "",
          email: "",
          friends: [],
          receivedFriendReqs: [],
          sentFriendReqs: [],
          token: "",
          profileImage: "",
        },
      };
    case 'new-friend-req':
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          receivedFriendReqs: [
            ...state.userInfo.receivedFriendReqs,
            action.payload,
          ],
        },
      };
    default:
      return state;
  }
};

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

function StoreProvider(props: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  

  return <Store.Provider value={{ state, dispatch }} {...props} />;
}

export { Store, StoreProvider, socket };
