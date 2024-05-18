import React from "react";
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
const Login: React.FC = () => {
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
                  id="email"
                  type="email"
                  placeholder="ConverseSphere@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full">Sign in</Button>
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
