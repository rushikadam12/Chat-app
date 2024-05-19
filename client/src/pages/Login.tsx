import React, { useEffect, useRef } from "react";
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
import { Link } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SiGooglechat } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginPost } from "@/Api call/AxiosInstance";
import { loginGoogle } from "@/Api call/AxiosInstance";
import axios from "axios";
const Login: React.FC = () => {
  const EmailRef = useRef<HTMLInputElement>(null);
  const PasswordRef = useRef<HTMLInputElement>(null);

  const mutation1 = useMutation({
    mutationFn: loginPost,
    onSuccess: (response) => {
      // Invalidate and refetch
      console.log(response.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const mutation2 = useMutation({
    mutationFn: loginGoogle,
    onSuccess: (response) => {
      // Invalidate and refetch
      console.log(response.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handelSubmit = () => {
    const email = EmailRef.current?.value;
    const password = PasswordRef.current?.value;
    if (!email || !password) {
      return alert("Pls enter your email and password");
    }
    mutation1.mutate({ email, password });
  };
  const handelGoogleSubmit = async () => {
    console.log(import.meta.env.VITE_URL);
    await window.open(
      `${import.meta.env.VITE_URL}/passport/google`,
      "_self"
    );
  };
  useEffect(() => {
    const fetchGoogleUser = async () => {
      const source = axios.CancelToken.source();
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_URL}/passport/login/success`,
          { withCredentials: true, cancelToken: source.token }
        );
        console.log(resp);
      } catch (error) {
        console.log(error);
      }
      return () => {
        source.cancel("Operation canceled by the user.");
      };
    };
    fetchGoogleUser();
  }, []);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <section className="flex justify-center items-center h-screen flex-col">
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
                  ref={EmailRef}
                  id="email"
                  type="email"
                  placeholder="ConverseSphere@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  ref={PasswordRef}
                  id="password"
                  type="password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={handelSubmit}>
                Sign in
              </Button>
              <Button
                className="w-full bg-slate-500 hover:bg-slate-400"
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
        </section>
      </ThemeProvider>
    </>
  );
};

export default Login;
