import React, { useState } from "react";
import { register, login, saveToken } from "@/lib/api";
import { toast } from "sonner";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (isLogin) {
      const res = await login(username, password);
      if (res.token) {
        saveToken(res.token);
        setMessage("Login successful!");
        toast.success("Successfully logged in!", { duration: 3000 });
        if (onSuccess) onSuccess();
      } else {
        setMessage(res.error || "Login failed");
      }
    } else {
      const res = await register(username, password);
      if (res.message) {
        setMessage("Registration successful! You can now log in.");
        setIsLogin(true);
      } else {
        setMessage(res.error || "Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-coffee font-medium" htmlFor="username">Username</label>
        <input
          id="username"
          className="px-3 py-2 rounded border border-coffee focus:outline-none focus:ring-2 focus:ring-mpesa text-coffee bg-coffee-light/10 placeholder:text-coffee/50"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-coffee font-medium" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="px-3 py-2 rounded border border-coffee focus:outline-none focus:ring-2 focus:ring-mpesa text-coffee bg-coffee-light/10 placeholder:text-coffee/50"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-mpesa text-white font-semibold hover:bg-mpesa/90 transition"
      >
        {isLogin ? "Login" : "Register"}
      </button>
      <button
        type="button"
        className="w-full py-2 rounded border border-coffee text-coffee bg-white hover:bg-coffee-light/30 transition"
        onClick={() => setIsLogin(l => !l)}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
      {message && <div className={`text-center text-sm mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
    </form>
  );
} 