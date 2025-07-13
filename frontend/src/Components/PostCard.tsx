import { useContext, useEffect, useState } from 'react';
import {
  useCommentPost,
  useDeleteComment,
  useDeletePost,
  useLikePost,
  useUnlikePost,
} from '../Hooks/postHooks';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import EditPostModal from './EditPostModal';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { CommentType, Post } from '../Types/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { twMerge } from 'tailwind-merge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import MenuDotsIcon from '@/icons/MenuDotsIcon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

type PostCardProps = {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
  isLoggedInUser: boolean;
  refetch: () => void;
  likers: string[];
  comments: CommentType[];
  onPostUpdate: (updatedPost: Post) => void;
  images?: string[];
};

function convertDateFormat(dateString: string) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export default function PostCard({
  text,
  authorName,
  createdAt,
  id,
  refetch,
  isLoggedInUser,
  likers,
  onPostUpdate,
  comments,
  images,
}: PostCardProps) {
  const {
    state: { userInfo },
  } = useContext(Store);
  const { mutateAsync: deletePost } = useDeletePost();
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: unlikePost } = useUnlikePost();
  const { mutateAsync: commentPost } = useCommentPost();
  const { mutateAsync: deleteComment } = useDeleteComment();
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState<CommentType[]>([]);
  const [likersDialogOpen, setLikersDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deletePost({ id });
    await refetch();
  };

  const handleLike = async () => {
    if (likers.includes(userInfo.name)) {
      await unlikePost({ userName: userInfo.name, postId: id });
    } else {
      await likePost({ userName: userInfo.name, postId: id });
    }

    await refetch();
  };

  const handleComment = async () => {
    const updatedPost = await commentPost({
      userName: userInfo.name,
      postId: id,
      comment,
    });

    setAllComments(updatedPost.comments);

    setComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await deleteComment({ postId: id, commentId });
    setAllComments(res.post.comments);
  };

  useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  return (
    <div
      data-testid="post-card"
      className="flex flex-col gap-3 bg-white rounded-lg w-[90%] md:w-[30%] p-3 border border-gray-200 shadow"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
          <Link to={`/${authorName}`}>
            <Avatar>
              <AvatarImage
                src={userInfo.profileImage}
                className=" object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <p className="font-bold">{authorName}</p>
            <p className=" text-xs">{convertDateFormat(createdAt)}</p>
          </div>
        </div>
        {/* options button and menu */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger data-testid="options">
              <MenuDotsIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isLoggedInUser && (
                <>
                  <DropdownMenuItem
                    data-testid="delete-post"
                    onClick={handleDelete}
                  >
                    Delete Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <EditPostModal
                    onPostUpdate={onPostUpdate}
                    id={id}
                    post={text}
                  />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p>{text}</p>
      <div className="flex flex-row gap-2">
        {images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`post content ${index}`}
            className="w-16 h-16 object-cover"
          />
        ))}
      </div>
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        <Button
          className={twMerge(
            'bg-white text-slate-400 hover:bg-slate-100',
            likers?.includes(userInfo.name) && 'text-blue-600'
          )}
          onClick={handleLike}
        >
          {likers?.includes(userInfo.name) ? 'Unlike' : 'Like'}
        </Button>

        <Dialog open={likersDialogOpen} onOpenChange={setLikersDialogOpen}>
          <DialogTrigger>
            <button className=" hover:underline hover:cursor-pointer">
              {' '}
              {likers?.length} people{' '}
            </button>
          </DialogTrigger>
          <DialogContent>
            {likers?.map(liker => (
              <div key={liker}>
                <Link
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  to={`/${liker}`}
                  onClick={() => setLikersDialogOpen(false)}
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://nazmul.sirv.com/facebook/${liker}.png`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>{liker}</p>
                </Link>
              </div>
            ))}
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <CommentIcon className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogDescription className=" flex flex-col gap-2 p-3">
              <div className="flex flex-row gap-3 pl-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="comment">write a comment</Label>
                  <Textarea
                    onChange={e => setComment(e.target.value)}
                    id="comment"
                    value={comment}
                    rows={3}
                    className=" resize-none"
                  />
                </div>

                <Button className="relative top-4" onClick={handleComment}>
                  Comment
                </Button>
              </div>

              <div className=" flex flex-col gap-4 h-60 pr-3 overflow-y-scroll">
                {allComments?.map((comment, index) => (
                  <div
                    key={index}
                    className="flex flex-row bg-slate-200  rounded-md gap-3 p-2"
                  >
                    <Link to={`/${comment.userName}`}>
                      <DialogClose>
                        <Avatar>
                          <AvatarImage
                            src={`https://nazmul.sirv.com/facebook/${comment.userName}.png`}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </DialogClose>
                    </Link>

                    <div className="w-[75%] flex flex-col gap-1">
                      <p className=" font-bold text-black">
                        {comment.userName}
                      </p>
                      <p className=" text-black">{comment.comment}</p>
                    </div>
                    {comment.userName === userInfo.name && (
                      <DeleteIcon
                        onClick={() => handleDeleteComment(comment._id)}
                        className=" cursor-pointer"
                        fontSize="small"
                      />
                    )}
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
