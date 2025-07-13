import React, { useEffect, useState } from 'react';
import { useGetFriendPosts } from '../Hooks/postHooks';
import PostCard from '../Components/PostCard';
import Pagination from '@/Components/Pagination';
import { PageClickEvent } from '@/Types/types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, refetch } = useGetFriendPosts({ currentPage });
  const [totalPages, setTotalPages] = useState<number>(2);

  const handlePageClick = (event: PageClickEvent): void => {
    setCurrentPage(event.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <div className=" flex flex-col gap-4 pt-8 items-center">
      <h2>Home Page</h2>
      {data?.posts?.map((post, index) => (
        <PostCard
          key={index}
          text={post.post}
          authorName={post.authorName}
          createdAt={post.createdAt}
          id={post._id}
          likers={post.likers}
          isLoggedInUser={false}
          comments={post.comments}
          refetch={refetch}
          onPostUpdate={() => {
            return null;
          }}
        />
      ))}
      <Pagination handlePageClick={handlePageClick} totalPages={totalPages} />
    </div>
  );
}
