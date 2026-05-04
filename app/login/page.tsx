"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { setCredentials } from "@/app/appStore/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong!");
        return;
      }

      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        }),
      );

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/icons/logo.svg"
            alt="SohCahToa"
            width={120}
            height={40}
            priority
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Log in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-orange-400 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-orange-500 font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-orange-400 focus:bg-white transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold transition-colors mt-2"
            >
              {loading ? "Logging you in..." : "Log in"}
            </button>
          </form>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-6">
            <p className="text-xs font-semibold text-orange-600 mb-2">
              Demo credentials
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Admin:</span> admin@sohcahtoa.com
                / admin123
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Analyst:</span>{" "}
                analyst@sohcahtoa.com / analyst123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
