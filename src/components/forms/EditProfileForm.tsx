import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";

import { checkUsernameValidaty, editUserAPI } from "@/APIS/authAPI";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ImagePreview from "../ImagePreview";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const EditProfile = ({
  user,
  setopen,
}: {
  user: UserDataInterface;
  setopen: (open: boolean) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    import.meta.env.VITE_CLOUDINARY_URL + user.avatar
  );
  const queryClient = useQueryClient();
  const [isUsernameChecked, setIsUsernameChecked] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(user.username);
  const toastid = useRef<string | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      avatar: new File([], ""),
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: String(user.phone),
      password: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) form.setValue("avatar", file);
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
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsUsernameChecked(true);
  };

  const {
    mutate: checkUsername,
    data,
    error,
    isError,
  } = useMutation({
    mutationFn: checkUsernameValidaty,
  });
  useEffect(() => {
    if (isUsernameChecked && username && username.length > 3) {
      checkUsername({ username });
    }
  }, [username, checkUsername, isUsernameChecked]);

  const { mutate: editUserMutation, isPending } = useMutation({
    mutationFn: editUserAPI,
    onMutate: () => {
      toastid.current = toast.loading("Registering....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setopen(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });
  const editSubmitHandler = (values: {
    fullName: string;
    phone: string;
    email: string;
    avatar: File;
  }) => {
    const userData = new FormData();
    userData.append("fullName", values.fullName);
    userData.append("username", username);
    userData.append("phone", values.phone);
    userData.append("email", values.email);
    if (values.avatar) {
      userData.append("avatar", values.avatar);
    }
    editUserMutation(userData);
  };

  return (
    <div className="w-full px-5 py-3 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(editSubmitHandler)}
          className="space-y-4"
        >
          <div className="w-full flex flex-col justify-center items-center">
            <FormField
              name="avatar"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="avatar">Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      className="hidden"
                      accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                      type="file"
                      id="image"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageChange(e)
                      }
                    />
                  </FormControl>
                  <FormLabel htmlFor="image" className="w-full">
                    <ImagePreview
                      imagePreview={imagePreview}
                      classname="rounded-full  w-24 h-24"
                      Icon={FaRegUser}
                    />
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm font-medium my-2">
              Click On Icon To Update Dp🐼
            </p>
          </div>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Full Name"
                    {...field}
                    className="border border-black focus:outline-none focus:border-2  placeholder:text-sm placeholder:font-mono placeholder:font-normal text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Full Name"
                    {...field}
                    className="border border-black focus:outline-none focus:border-2  placeholder:text-sm placeholder:font-mono placeholder:font-normal text-base"
                    onChange={(e) => handleUsernameChange(e)}
                    value={username}
                  />
                </FormControl>
                <FormMessage
                  className={`${isError ? "text-red-500" : "text-green-500"}`}
                >
                  {isError ? error.message : data?.data.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email"
                    {...field}
                    className="border border-black focus:outline-none focus:border-2  placeholder:text-sm placeholder:font-mono placeholder:font-normal text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Phone Number"
                    {...field}
                    className="border border-black focus:outline-none focus:border-2  placeholder:text-sm placeholder:font-mono placeholder:font-normal text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full font-mono hover:bg-[#987070]/90 bg-[#a77979]"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
