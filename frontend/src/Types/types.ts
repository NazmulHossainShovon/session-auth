type User = {
  name: string;
  email: string;
  friends: string[];
  receivedFriendReqs: string[];
  sentFriendReqs: string[];
  token: string;
  profileImage?: string;
};

type People = {
  name: string;
  image: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
  image: FileList;
};

type AppState = {
  userInfo: User;
  searchQuery: string;
};

type CommentType = {
  comment: string;
  userName: string;
  createdAt: string;
  _id: string;
};

type Post = {
  post: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  likers: string[];
  images: string[];
  _id: string;
  comments: CommentType[];
};

type PageClickEvent = {
  selected: number;
};

export type {
  User,
  AppState,
  SignupData,
  Post,
  People,
  CommentType,
  PageClickEvent,
};
