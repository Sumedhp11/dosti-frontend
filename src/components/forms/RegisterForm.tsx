import registerSchema from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";

import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import { RegisterAPI, checkUsernameValidaty } from "@/APIS/authAPI";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const toastid = useRef<string | undefined>(undefined);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      avatar: new File([], ""),
      username: "",
      fullName: "",
      email: "",
      phone: "",
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
    if (username && username.length > 3) {
      checkUsername({ username });
    }
  }, [username, checkUsername]);

  const { mutate: RegisterUser, isPending } = useMutation({
    mutationFn: RegisterAPI,
    onMutate: () => {
      toastid.current = toast.loading("Registering....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      navigate("/verify");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });
  const registerSubmitHandler = (values: z.infer<typeof registerSchema>) => {
    const userData = new FormData();
    userData.append("fullName", values.fullName);
    userData.append("username", username);
    userData.append("phone", values.phone);
    userData.append("email", values.email);
    userData.append("password", values.password);
    userData.append("avatar", values.avatar);
    RegisterUser(userData);
  };

  return (
    <div className="w-full px-5 py-3 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(registerSubmitHandler)}
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
              Click On Icon To Upload Dp🐼
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password: </FormLabel>
                <FormControl>
                  <div className="relative ">
                    <Input
                      placeholder="Enter Your Password"
                      {...field}
                      className="border border-black focus:outline-none focus:border-2  placeholder:text-sm placeholder:font-mono placeholder:font-normal text-base"
                      type={showPassword ? "text" : "password"}
                    />
                    {showPassword ? (
                      <FaRegEyeSlash
                        className="absolute right-1 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setshowPassword(false)}
                      />
                    ) : (
                      <FaRegEye
                        className="absolute right-1 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setshowPassword(true)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full font-mono hover:opacity-90"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
          <div className="flex gap-3">
            <span className="font-mono">Already Have an Account?</span>
            <span
              className="font-mono text-blue-800 cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
