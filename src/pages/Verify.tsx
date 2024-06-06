import { VerifyUserAPI } from "@/APIS/authAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();

  const isloggedIn = sessionStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (isloggedIn === "true") {
      navigate("/");
    }
  }, [isloggedIn, navigate]);
  const [value, setValue] = useState("");
  let toastId: string;
  const { isPending, mutate: VerifyUser } = useMutation({
    mutationFn: VerifyUserAPI,
    onMutate: () => {
      toastId = toast.loading("Verifying...");
    },
    onSuccess: (data) => {
      const successMessage = data?.data.message;
      toast.success(successMessage, { id: toastId });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message, { id: toastId });
    },
  });
  const handleVerification = () => {
    VerifyUser(value);
  };
  return (
    <div className="w-full min-h-screen flex justify-center">
      <Card className="shadow-md shadow-gray-400 w-[90%] md:w-[65%] lg:w-[45%]  md:mt-16 h-fit py-3">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Verify your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full justify-center items-center  space-y-10">
          <div className="w-[65%] flex flex-col items-center justify-center space-y-2">
            <p className="text-base font-medium">
              Verification Code is Sent To your email
            </p>
          </div>
          <div>
            <InputOTP
              className="w-fit"
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
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
          <div className="px-5 w-full space-y-4">
            <Button
              onClick={handleVerification}
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
            <span className="text-xs font-medium">
              Note : If the verification code expires, you will need to register
              again to activate your Dosti account."
            </span>

            <span className="text-xs font-medium text-blue-500 mx-2">
              <Link to={"/register"}>Register</Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
