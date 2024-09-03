import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";
import { SubmitHandler, FieldValues } from "react-hook-form";
import useRegister from "../hooks/useRegister";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, errors, isSubmitting, setError } =
    useRegister();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data: FieldValues) => {
    const { name, email, password } = data;
    try {
      console.log("upper");
      await apiClient.post("/auth/signup", { name, email, password });
      console.log("lower");
      navigate("/");
    } catch (error) {
      setError("root", {
        message: "Password must contain atleast 1 number and 1 character",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name?.message}</p>
          )}

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
            {isSubmitting ? "Loading..." : "Register"}
          </button>
          {errors.root && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {errors.root?.message}
            </p>
          )}
        </form>
        <p className="text-center text-gray-400 mt-4">
          Already Registered?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
