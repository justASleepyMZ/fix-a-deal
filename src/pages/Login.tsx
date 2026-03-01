import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your FixFlow account</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <Button variant="hero" className="w-full" type="submit">Sign In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
