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
const RegisterPage = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <section className="flex justify-center items-center h-screen flex-col">
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
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Username</Label>
                  <Input id="first-name" placeholder="Username" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="@example.com"
                  required
                />
              </div>
              <div className="gird gap-2">
                <Label htmlFor="picture">Avatar</Label>
                <Input id="picture" type="file"/>
              </div>

              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with Google
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
      </section>
    </ThemeProvider>
  );
};
export default RegisterPage;
