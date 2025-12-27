import {MessageSquare, User, Mail, EyeOff, Eye, Lock, Loader2,} from "lucide-react";
import React, { useState } from "react";
import { useAuthStore} from "../store/useAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthBackground from "../components/AuthBackground";

const SignUpPage = () => {
  const[showPassword, setShowPassword] = useState(false);
  const[formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const{ signup, isSigningUp} = useAuthStore();


  const validateForm =()=>{
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Invalid email format");

    if(!formData.password) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    return true;
  }


  const handleSubmit =(e)=>{
    e.preventDefault();
    const sucess = validateForm()
    if(sucess=== true) signup(formData);
  };

  

  return <div className="min-h-screen relative flex items-center justify-center px-6 py-12">
    <AuthBackground variant="signup" />

    <div className="relative w-full max-w-md mt-10 space-y-8 rounded-2xl bg-base-100/85 p-8 shadow-xl border border-base-300/70">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center
                         group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-[rgb(176,154,204)]" />
            </div>
            <p className="text-xl uppercase font-extrabold tracking-[0.2em] text-[rgb(176,154,204)]">Chatty!</p>
            <h1 className="text-3xl font-bold mt-2 brand-serif">Create account</h1>
            <p className="text-base-content/70">
              Get started with your free account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className= "space-y-6">
        <div className= "form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="size-5 text-base-content/40" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}

              />
            </div>

        </div>
        <div className="form-control">
          <label className="label"> 
            <span className="label-text font-medium">Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="size-5 text-base-content/40"/>
            </div>
            <input
              type="email"
              className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="size-5 text-base-content/40" />
            </div>
            <input
              type={showPassword? "text" : "password"}
              className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
              placeholder="********"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword?(
                <Eye className="size-5 text-base-content/40" />
              ) : (
                <EyeOff className="size-5 text-base-content/40"/>
              
              )}
            </button>

          </div>
        </div>

        <button
          type="submit"
          className="btn w-full border border-base-300 bg-[rgba(198,180,220,0.85)] text-[rgb(64,52,82)] hover:bg-[rgba(198,180,220,0.95)]"
          disabled={isSigningUp}
        >
          {isSigningUp?(
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) :(
            "Create account"
          )
          }
        </button>

      </form>

      <div className="text-center">
        <p className="text-base-content/60">
          Already have an account?{""}
          <Link to ="/login" className="link text-[rgb(176,154,204)]">
            Sign in
          </Link>
        </p>
      </div>
      </div>
  </div>
};

export default SignUpPage;
