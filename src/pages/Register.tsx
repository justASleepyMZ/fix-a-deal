import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useState } from "react";

const Register = () => {
  const [role, setRole] = useState<"user" | "worker">("user");

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join FixFlow today</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6 flex rounded-lg border bg-muted p-1">
            <button
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${role === "user" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setRole("user")}
            >
              I need repairs
            </button>
            <button
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${role === "worker" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setRole("worker")}
            >
              I'm a worker
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+7 (___) ___-__-__" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
            {role === "worker" && (
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" placeholder="e.g., Plumbing, Electrical" className="mt-1" />
              </div>
            )}
            <Button variant="hero" className="w-full" type="submit">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
