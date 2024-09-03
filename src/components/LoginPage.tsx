import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";
import { SubmitHandler, FieldValues } from "react-hook-form";
import useLogin from "../hooks/useLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NotificationBadge from "./NotificationBadge";


interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, errors, isSubmitting, setError } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);


  const onSubmit: SubmitHandler<FormData> = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.authToken);
      localStorage.setItem("user_id", response.data.user.id);
      setShowNotification(true);
      setTimeout(() => {
        navigate("/form");
      }, 2000); 
    } catch (error) {
      console.log(error)
      setError("root", {
        message: "Invalid Credentials",
      });
    }
    
  };

  return (
    <>
    {showNotification && (
      <NotificationBadge 
        message="Login successful!" 
        onClose={() => setShowNotification(false)} 
      />
    )}
    
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email?.message}</p>
          )}

          <div className="relative mb-4">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 p-3 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-3 rounded mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>

          {errors.root && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {errors.root?.message}
            </p>
          )}

          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
