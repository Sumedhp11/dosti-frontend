/* eslint-disable react-refresh/only-export-components */
import { getAllPosts } from "@/APIS/postsAPI";
import EditProfile from "@/components/forms/EditProfileForm";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { posts } from "./Home";
import { useInView } from "react-intersection-observer";

const Setting = ({ user }: { user: UserDataInterface }) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [page, setPage] = useState<number>(1);
  const [openModal, setopenModal] = useState<boolean>(false);
  const { data: postData, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => getAllPosts({ page }),
  });
  useEffect(() => {
    if (inView && postData?.data.data.totalPages > page) {
      setPage((prev) => prev + 1);
    }
  }, [page, inView, postData]);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-[90%] mt-16 flex flex-col px-5 py-4 bg-[#987070] space-y-3">
        <h1 className="text-xl font-medium text-white">Settings</h1>
        <div className="w-full flex items-center justify-between px-2 shadow-md shadow-black py-3">
          <div className="flex flex-col items-center">
            <img
              className="w-28 h-28 rounded-full object-cover"
              src={`${import.meta.env.VITE_CLOUDINARY_URL}${user?.avatar}`}
              alt=""
            />
            <p className="text-white font-medium text-xl">{user?.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                to={"/friends"}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-white text-lg font-medium">Friends</p>
                <p className="text-white text-lg font-medium">
                  {user?.friends?.length}
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <p className="text-white text-lg font-medium">Posts</p>
                <p className="text-white text-lg font-medium">
                  {postData?.data.data.posts.length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Dialog open={openModal} setOpen={setopenModal}>
            <DialogTrigger>
              <Button
                className="bg-[#F1E5D1] hover:bg-[#F1E5D1]/90 text-black font-medium"
                onClick={() => setopenModal(true)}
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="md:w-[60%] w-[90%]">
              <DialogHeader>
                <DialogTitle>Edit Profile:</DialogTitle>
              </DialogHeader>
              <EditProfile user={user} setopen={setopenModal} />
            </DialogContent>
          </Dialog>

          <Button
            className="bg-[#F1E5D1] hover:bg-[#F1E5D1]/90 text-black font-medium"
            onClick={() => navigate("/forget-password")}
          >
            Reset Password
          </Button>
        </div>
        <p className="text-lg font-medium text-white">Posts : </p>
        <div className="w-full flex flex-wrap p-2 bg-[#F1E5D1] rounded-md">
          {postData?.data.data.posts.length === 0 ? (
            <p className="text-center text-black font-medium text-xl">
              No Posts Found!
            </p>
          ) : (
            postData?.data.data.posts.map((post: posts) => (
              <div className="w-[25%] flex items-center " key={post._id}>
                <img
                  className="object-cover w-full h-full"
                  src={`${import.meta.env.VITE_CLOUDINARY_URL}${post.content}`}
                  alt=""
                />
              </div>
            ))
          )}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout(Setting);
