import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import AuthBackground from "../components/AuthBackground";

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const {login, isLoggingIn} = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12">
      <AuthBackground variant="login" />

      <div className="relative w-full max-w-md space-y-8 rounded-2xl bg-base-100/85 p-8 shadow-xl border border-base-300/70">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-[rgb(176,154,204)]" />
              </div>
              <p className="text-2xl uppercase font-extrabold tracking-[0.2em] text-[rgb(176,154,204)]">Chatty!</p>
              <p className="text-sm mt-2 font-normal brand-serif">Welcome back</p>
              <p className="text-base-content/70">Sign in to continue the conversations.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                  placeholder="demo@gmail.com / demo2@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                  placeholder="1234567 / 9876543"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-full border border-base-300 bg-[rgba(198,180,220,0.85)] text-[rgb(64,52,82)] hover:bg-[rgba(198,180,220,0.95)]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link text-[rgb(176,154,204)]">
                Create account
              </Link>
            </p>
          </div>
        </div>
    </div>
  );
};
export default LoginPage;
