import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/pexels-pixabay-416320.jpg";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", password_confirm: "", address: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      // Register and auto-login
      const payload = {
        username: form.email,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      };
      console.log("Signup payload:", payload);
      await auth.register(payload.username, payload.email, payload.password, payload.first_name, payload.last_name);
      navigate("/");
    } catch (err) {
      console.error("Signup error (raw):", err);
      // apiFetch throws { status, data }
      if ((err as any)?.data) {
        console.error("Backend error body:", (err as any).data);
        alert(JSON.stringify((err as any).data));
      } else {
        alert("Signup failed");
      }
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 ">
        <img
          src={heroImage}
          alt="Office Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 bg-white/95 rounded-3xl shadow-2xl p-10 w-full max-w-lg mt-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-brand-black">
          Create Your Account
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Join us and explore premium furniture collections.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">First Name</label>
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} type="text" placeholder="First name" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
              <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} type="text" placeholder="Last name" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Enter your email" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Create password" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
              <Input value={form.password_confirm} onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} type="password" placeholder="Confirm password" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} type="text" placeholder="Enter your address" required />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-full"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
