import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SiGooglechat } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authCall, loginPost } from "@/Api call/AxiosInstance";
import { CircleSpinner } from "react-spinners-kit";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
type Inputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const Navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await LoginMutate.mutateAsync(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoginMutate = useMutation({
    mutationFn: loginPost,
    onSuccess: async (response) => {
      // Invalidate and refetch

      console.log(response.data);
      Navigate("/chat-app/home");

      setIsLoading(false);
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });
  const authMutation = useMutation({
    mutationFn: authCall,
    onSuccess: (response) => {
      // Invalidate and refetch
      if (response.data.data.auth) {
        Navigate("/chat-app/home");
      } else {
        Navigate("/");
      }
    },
    onError: (error) => {
      console.log(error);
      Navigate("/");
    },
  });
  // const handelSubmit = () => {
  //   const email = EmailRef.current?.value;
  //   const password = PasswordRef.current?.value;
  //   if (!email || !password) {
  //     return alert("Pls enter your email and password");
  //   }
  //   mutation1.mutate({ email, password });
  // };
  const handelGoogleSubmit = async () => {
    try {
      await window.open(`${import.meta.env.VITE_URL}/passport/google`, "_self");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    authMutation.mutate();
  }, [Navigate]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <form
          className="flex justify-center items-center h-screen flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="py-8 w-fit">
            <p className="text-4xl flex gap-2 font-semibold">
              <SiGooglechat size={40} />
              ConverseSphere
            </p>
          </div>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Sign in continue to ConverseSphere
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ConverseSphere@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password is too short" },
                  })}
                  id="password"
                  type="password"
                />
                {errors.password && (
                  <span className="text-red-500 ">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <CircleSpinner size={25} /> : "SignIn"}
              </Button>
              <Button
                className="w-full bg-slate-500 hover:bg-slate-400"
                type="button"
                onClick={handelGoogleSubmit}
              >
                Sign in with Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Register your account{" "}
                <Link to="/signup" className="underline">
                  SignUp
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </ThemeProvider>
    </>
  );
};

export default Login;
