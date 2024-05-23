import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { SiGooglechat } from "react-icons/si";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RegisterCall } from "@/Api call/AxiosInstance";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
interface Inputs {
  username: string;
  email: string;
  password: string;
}
const RegisterPage = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await registerMutation.mutate(data);
    } catch (error) {
      console.log(error);
    }
  };

  const registerMutation = useMutation({
    mutationFn: RegisterCall,
    onSuccess: (response) => {
      toast.success("asdasd");
      Navigate("/");
      console.log(response);
    },
    onError: async (error: any) => {
      toast.error(error.response?.data?.message || "!something went wrong");
      console.log(error.response.data);
    },
  });
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors />

      <form
        className="flex justify-center items-center h-screen flex-col p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="py-5 w-fit">
          <p className="text-4xl flex gap-2 font-semibold">
            <SiGooglechat size={40} />
            ConverseSphere
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="@example.com"
                  {...register("email", {
                    required: "Pls enter your email",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  aria-label="email"
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Password</Label>
                  <Input
                    id="first-name"
                    placeholder="Password"
                    type="password"
                    {...register("password", {
                      required: "pls enter your password",
                      minLength: {
                        value: 5,
                        message: "password is too short",
                      },
                    })}
                    aria-label="password"
                  />
                  {errors.password && (
                    <span className="text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Username</Label>
                  <Input
                    id="first-name"
                    placeholder="Username"
                    {...register("username", {
                      required: "pls enter your name",
                      minLength: {
                        value: 3,
                        message: "minimum 4 character required",
                      },
                    })}
                    aria-label="username"
                  />
                  {errors.username && (
                    <span className="text-red-500">
                      {errors.username.message}
                    </span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </ThemeProvider>
  );
};
export default RegisterPage;
