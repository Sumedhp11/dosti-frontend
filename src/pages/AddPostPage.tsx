/* eslint-disable react-refresh/only-export-components */
import { AddNewPostAPI } from "@/APIS/postsAPI";
import ImagePreview from "@/components/ImagePreview";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdAddAPhoto } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AddPostPage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [content, setContent] = useState<File | null>();
  const toastid = useRef<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) setContent(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader?.result === null) return;
        setImagePreview(reader.result.toString());
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleImagePreviewClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const { mutate: AddNewPost, isPending } = useMutation({
    mutationFn: AddNewPostAPI,
    onMutate: () => {
      toastid.current = toast.loading("Posting....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      setImagePreview(null);
      setContent(null);
      setCaption("");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });

  const handlePostSubmit = () => {
    if (!content) {
      return;
    }
    const postData = new FormData();
    postData.append("caption", caption);
    postData.append("content", content);
    AddNewPost(postData);
  };
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="flex flex-col h-fit w-[80%] items-center bg-[#987070] mt-9 px-3 py-5 rounded-lg  space-y-4">
        <h1 className="text-2xl font-medium text-white">Add New Post</h1>
        <div className="w-full h-[100%]  space-y-4">
          <div className="h-[35vh] max-h-[400px] w-full ">
            <Input
              ref={fileInputRef}
              className="hidden"
              accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
              type="file"
              id="image"
              disabled={isPending}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageChange(e)
              }
            />
            <ImagePreview
              classname="h-full w-full cursor-pointer rounded-md"
              Icon={MdAddAPhoto}
              imagePreview={imagePreview}
              onClick={handleImagePreviewClick}
            />
          </div>
          <div className="w-full space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="caption"
                className="text-base font-medium text-white"
              >
                Caption :
              </Label>
              <Textarea
                id="caption"
                disabled={isPending}
                className="py-4 text-lg font-medium text-black bg-white placeholder:font-medium placeholder:text-base"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setCaption(e.target.value)
                }
              />
            </div>
            <Button
              disabled={isPending}
              onClick={handlePostSubmit}
              className="w-full bg-[#2A629A] hover:bg-[#2A629A]/90"
            >
              {isPending ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout(AddPostPage);
