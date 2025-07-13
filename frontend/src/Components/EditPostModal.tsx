import React, { useState } from 'react';
import { useUpdatePost } from '../Hooks/postHooks';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Post } from '@/Types/types';

type EditPostModalProps = {
  post: string;
  id: string;
  onPostUpdate: (post: Post) => void;
};

const EditPostModal = (props: EditPostModalProps) => {
  const { post, id, onPostUpdate } = props;
  const [updatedPost, setUpdatedPost] = useState(post);
  const { mutateAsync: updatePost } = useUpdatePost();

  const handleUpdatePost = async () => {
    const result = await updatePost({ post: updatedPost, id: id });
    onPostUpdate(result.doc);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full text-left pl-2 hover:bg-slate-100">
        Edit
      </DialogTrigger>
      <DialogContent>
        <div className="w-[50%] flex flex-col gap-7">
          <Textarea
            onChange={e => setUpdatedPost(e.target.value)}
            defaultValue={post}
          />
          <DialogClose asChild>
            <Button onClick={handleUpdatePost}>Update</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

EditPostModal.displayName = 'EditPostModal';

export default EditPostModal;
