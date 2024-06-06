import { resetPasswordAPI, sendForgetPasswordEmailAPI } from "@/APIS/authAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [showSendEmailButton, setShowSendEmailButton] = useState<boolean>(true);
  const [code, setCode] = useState("");
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const toastid = useRef<string | undefined>(undefined);

  const { mutate: sendEmailForForgetPassword, isPending } = useMutation({
    mutationFn: sendForgetPasswordEmailAPI,
    onMutate: () => {
      toastid.current = toast.loading("Sending Forget Password Code....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      setShowSendEmailButton(false);
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });
  const { mutate: resetPassword, isPending: ResettingPassword } = useMutation({
    mutationFn: resetPasswordAPI,
    onMutate: () => {
      toastid.current = toast.loading("Sending Forget Password Code....");
    },
    onSuccess: (data) => {
      toast.success(data?.data.message, { id: toastid.current });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastid.current });
    },
  });
  const handleSendEmail = () => {
    sendEmailForForgetPassword(email);
  };
  const handleResetPassword = () => {
    resetPassword({ code, password });
  };
  return (
    <div className="w-full min-h-screen flex justify-center ">
      <Card className="shadow-md shadow-gray-400 w-[90%] md:w-[60%] lg:w-[36%]  md:mt-16 h-fit py-3">
        <CardHeader>
          <CardTitle className="font-medium text-2xl text-center font-mono">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full px-5 py-3 flex justify-center space-y-14">
            {showSendEmailButton && (
              <div className="w-full px-3 space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  Enter Your Email:{" "}
                </Label>
                <Input
                  disabled={isPending}
                  id="email"
                  className=""
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter Your Email"
                />

                <Button
                  disabled={isPending}
                  className="w-full"
                  onClick={handleSendEmail}
                >
                  Send Code to Reset Password
                </Button>
              </div>
            )}
            {!showSendEmailButton && (
              <div className="flex w-[85%] justify-center flex-col items-center space-y-5">
                <div className="space-y-2 w-fit">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Enter Forgot Password Code :{" "}
                  </Label>
                  <InputOTP
                    disabled={ResettingPassword}
                    className="w-fit"
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    id="code"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={1} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={3} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={4} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="w-full">
                  <Label htmlFor="password">Enter New Password : </Label>
                  <div className="w-full relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter Your New Password"
                      disabled={ResettingPassword}
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
                </div>
                <Button
                  onClick={handleResetPassword}
                  disabled={ResettingPassword}
                  className="w-full"
                >
                  Reset Password
                </Button>
                <p
                  onClick={() => setShowSendEmailButton(true)}
                  className="text-sm font-medium text-blue-800 cursor-pointer"
                >
                  Get New Code
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
