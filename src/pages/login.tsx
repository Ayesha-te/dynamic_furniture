import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/pexels-pixabay-416320.jpg";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { username: form.email, password: form.password };
      console.log("Login payload:", payload);
      await auth.login(form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error("Login error (raw):", err);
      if ((err as any)?.data) {
        console.error("Backend error body:", (err as any).data);
        alert(JSON.stringify((err as any).data));
      } else {
        alert("Login failed");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Office Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/95 rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-brand-black">
          Welcome Back
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Login to continue your journey with us.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Enter your password" required />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-full"
          >
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
