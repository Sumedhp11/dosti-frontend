import loginSchema from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { loginAPI } from "@/APIS/authAPI";
const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const toastid = useRef<string | undefined>(undefined);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginAPI,
    onMutate: () => {
      toastid.current = toast.loading("Signing In....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });
  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    loginUser({ userData: data });
  };
  return (
    <div className="w-full px-5 py-3 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username: </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Username"
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
                      autoComplete="true"
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
          <div className="space-y-2">
            <Link
              to={"/forget-password"}
              className="text-sm  font-medium text-blue-800"
            >
              Forgot Password?
            </Link>
            <Button
              className="w-full font-mono hover:opacity-90"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Login"}
            </Button>
          </div>
          <div className="flex gap-3">
            <span className="font-mono">Dont have An Account?</span>
            <span
              className="font-mono text-blue-800 cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
