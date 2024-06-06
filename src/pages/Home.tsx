/* eslint-disable react-refresh/only-export-components */
import { addCommentAPI, getAllPosts, likePostAPI } from "@/APIS/postsAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { AiTwotoneMessage } from "react-icons/ai";
import { useInView } from "react-intersection-observer";

export interface posts {
  _id: string;
  caption: string;
  content: string;
  likes: string[];
  userId: {
    _id: string;
    username: string;
    avatar: string;
  };
  comments: [
    {
      _id: string;
      userId: {
        _id: string;
        avatar: string;
        username: string;
      };
      comment: string;
    }
  ];
}

const Home = ({ user }: { user: UserDataInterface }) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const [comment, setcomment] = useState<string>("");
  const {
    data: postData,
    isLoading,
    error,
    isError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getAllPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.data) {
        const { currentPage, totalPages } = lastPage.data.data;
        return currentPage > totalPages ? currentPage + 1 : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const { mutate: likePost } = useMutation({
    mutationFn: likePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = (postId: string) => {
    likePost({ postId });
  };

  const { mutate: addComment } = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const addCommentHandler = (postId: string) => {
    addComment({ postId, comment });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center overflow-y-scroll ">
      <div className="w-[90%] h-full  flex flex-col items-center py-4">
        {isError ? (
          <p className="text-center text-base font-normal">
            {error.message}...
          </p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          postData?.pages[0]?.data.data.posts.map((posts: posts) => {
            const isLiked = posts.likes.includes(user?._id);

            return (
              <Card
                className="w-5/6 mt-4 shadow-md shadow-gray-400"
                key={posts._id}
              >
                <CardHeader className="flex flex-row py-2 items-center gap-3 ">
                  <img
                    src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                      posts.userId.avatar
                    }`}
                    className="w-16 h-16 rounded-full object-contain"
                    alt="User-Avatar"
                  />
                  <CardTitle>{posts.userId.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full py-2 flex space-y-7 flex-col border-b border-black">
                    <p className="text-base font-normal pb-3 border-b border-black">
                      {posts.caption}
                    </p>
                    <img
                      src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                        posts.content
                      }`}
                      alt="content"
                      className="w-full h-56 object-contain shadow-black py-1 rounded-md"
                    />
                  </div>
                  <div className="flex my-2 gap-4 items-center ">
                    <div className="flex flex-col items-center">
                      <Heart
                        size={39}
                        cursor={"pointer"}
                        className={
                          isLiked
                            ? "hover:scale-110 duration-100 text-red-500 fill-current"
                            : "hover:scale-110 duration-100 text-black"
                        }
                        onClick={() => handleLike(posts._id)}
                      />
                      <p>{posts.likes.length}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <AiTwotoneMessage
                        size={39}
                        cursor={"pointer"}
                        onClick={() => setShowComments((prev) => !prev)}
                      />
                      <p>{posts.comments.length}</p>
                    </div>
                  </div>
                  {showComments && (
                    <div className="w-full py-3 flex flex-col gap-3">
                      <div className="w-full flex items-center gap-3">
                        <Input
                          placeholder="Enter your Comment"
                          className="w-[75%]"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setcomment(e.target.value)
                          }
                        />
                        <Button
                          className="flex-grow bg-[#987070] hover:bg-[#987070]/80"
                          onClick={() => addCommentHandler(posts._id)}
                        >
                          Add Comment
                        </Button>
                      </div>
                      <div className="w-full space-y-5">
                        {posts.comments.length > 0 ? (
                          posts.comments.map((comment) => (
                            <div
                              key={comment._id}
                              className="flex flex-col items-start  shadow-sm shadow-gray-500 p-3 rounded-md gap-2"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                                    comment.userId.avatar
                                  }`}
                                  className="w-11 h-11 rounded-full object-contain"
                                  alt="User Avatar"
                                />
                                <p className="text-sm font-medium">
                                  {comment.userId.username}
                                </p>
                              </div>
                              <p className="text-base font-normal">
                                {comment.comment}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No Comments Found!</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
        <div ref={ref}></div>
      </div>
    </div>
  );
};

export default AppLayout(Home);
