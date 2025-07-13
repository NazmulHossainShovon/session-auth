import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreatePost, useGetPosts } from '../Hooks/postHooks';
import PostCard from '../Components/PostCard';
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useGetUserInfo,
  useSendFriendRequest,
} from '../Hooks/userHook';
import { Store } from '../Store';
import FriendOptionsMenu from '../Components/FriendOptionsMenu';
import { PageClickEvent, Post } from '../Types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import Pagination from '@/Components/Pagination';

function UserProfile() {
  const navigate = useNavigate();
  const { userName } = useParams();
  const [post, setPost] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const { mutateAsync: createPost } = useCreatePost();
  const { data: userData, refetch: refetchUser } = useGetUserInfo(userName);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, refetch } = useGetPosts({ userName, currentPage });
  const { mutateAsync: sendRequest } = useSendFriendRequest();
  const { mutateAsync: cancelRequest } = useCancelFriendRequest();
  const { mutateAsync: acceptRequest } = useAcceptFriendRequest();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(2);

  const isLoggedInUser = userInfo.name === userName;

  const getSirvToken = async () => {
    const response = await fetch('https://api.sirv.com/v2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        clientId: import.meta.env.VITE_SIRV_ID,
        clientSecret: import.meta.env.VITE_SIRV_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Sirv');
    }

    const { token } = await response.json();
    return token;
  };

  const uploadImagesToSirv = async (token: string) => {
    const uploadPromises = images.map(image => {
      return fetch(
        `https://api.sirv.com/v2/files/upload?filename=/post-images/${image.name}`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': image.type,
          },
          body: image,
        }
      );
    });

    const responses = await Promise.all(uploadPromises);
    const failedUploads = responses.filter(res => !res.ok);

    if (failedUploads.length > 0) {
      throw new Error(`${failedUploads.length} images failed to upload.`);
    }
    const imageUrls = images.map(
      image => `https://nazmul.sirv.com/post-images/${image.name}`
    );
    return imageUrls;
  };

  const handlePost = async () => {
    try {
      let imagesUrls: string[] = [];
      if (images.length > 0) {
        const token = await getSirvToken();
        imagesUrls = await uploadImagesToSirv(token);
      }

      await createPost({ post, images: imagesUrls });
      await refetch();
      setPost('');
      setImages([]);
    } catch (error) {
      console.error('Failed to create post:', error);
      // Optionally, show a notification to the user
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prevImages => [
        ...prevImages,
        ...Array.from(e.target.files || []),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const sendFriendRequest = async () => {
    const updatedUser = await sendRequest({
      sender: userInfo.name,
      receiver: userName,
    });
    dispatch({ type: 'sign-in', payload: updatedUser });
    await refetchUser();
  };

  const handleCancelRequest = async () => {
    const res = await cancelRequest({
      sender: userInfo.name,
      receiver: userName,
    });
    dispatch({ type: 'sign-in', payload: res.sender });
    await refetchUser();
  };

  const handleReject = async () => {
    const res = await cancelRequest({
      sender: userName,
      receiver: userInfo.name,
    });
    dispatch({ type: 'sign-in', payload: res.receiver });
    await refetchUser();
  };

  const handleAcceptRequest = async () => {
    const updatedUser = await acceptRequest({
      sender: userName,
      receiver: userInfo.name,
    });
    dispatch({ type: 'sign-in', payload: updatedUser });
    await refetchUser();
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handlePageClick = (event: PageClickEvent): void => {
    setCurrentPage(event.selected + 1);
  };

  

  useEffect(() => {
    if (data) {
      setAllPosts(data.posts);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <div className=" pt-[60px] h-full flex grow flex-col gap-3 items-center align-middle bg-[#F0F2F5]">
      <div className="flex flex-col gap-3 bg-white rounded-lg w-[90%] md:w-[30%] p-3 border border-gray-200 shadow">
        <Avatar className=" w-20 h-20 ">
          <AvatarImage src={userData?.profileImage} className=" object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h2>{userData?.name}</h2>
        {!isLoggedInUser && (
          <>
            {userData?.receivedFriendReqs.includes(userInfo.name) ? (
              <Button onClick={handleCancelRequest}>Cancel Request</Button>
            ) : userData?.sentFriendReqs.includes(userInfo.name) ? (
              <div className="flex flex-row gap-3">
                <Button onClick={handleAcceptRequest}>Accept Request</Button>
                <Button onClick={handleReject}>Reject</Button>
              </div>
            ) : userData?.friends.includes(userInfo.name) ? (
              <FriendOptionsMenu tempUser={userName} refetch={refetchUser} />
            ) : (
              <Button onClick={sendFriendRequest}>Send Request </Button>
            )}
          </>
        )}
      </div>

      <Dialog>
        <DialogTrigger>
          {isLoggedInUser && <Button>Whats on your mind?</Button>}
        </DialogTrigger>
        <DialogContent>
          <DialogDescription className="flex flex-col gap-3 p-3">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Create Post</Label>
              <Textarea
                onChange={e => setPost(e.target.value)}
                id="message"
                rows={10}
                className=" resize-none text-black"
              />
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
              />
              <div className="flex flex-row gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`preview ${index}`}
                      className="w-16 h-16 object-cover"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose
              className=" bg-black text-white p-2 rounded"
              onClick={handlePost}
            >
              Post
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {allPosts.map((post, index) => (
        <PostCard
          key={index}
          text={post.post}
          authorName={post.authorName}
          createdAt={post.createdAt}
          id={post._id}
          refetch={refetch}
          likers={post.likers}
          isLoggedInUser={isLoggedInUser}
          onPostUpdate={handlePostUpdate}
          comments={post.comments}
          images={post.images}
        />
      ))}
      <Pagination handlePageClick={handlePageClick} totalPages={totalPages} />
    </div>
  );
}

export default UserProfile;
