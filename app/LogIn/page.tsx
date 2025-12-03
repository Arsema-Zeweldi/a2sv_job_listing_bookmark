"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLogInUserMutation } from "@/app/service/data";
import ErrorPopup from "@/app/components/ErrorPopup";
import { useRouter } from "next/navigation";

type FormValues = {
  email: string;
  password: string;
};

const page = () => {
  const router = useRouter();
  const form = useForm<FormValues>();

  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const [logInUser, { data, error, isLoading, isSuccess }] =
    useLogInUserMutation();

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (input: FormValues) => {
    setShowErrorPopup(false);
    setErrorMessage("");
    try {
      const newUser = {
        email: input.email,
        password: input.password,
      };
      const res = await logInUser(newUser).unwrap();

      const token = res.data.accessToken;
      if (token) {
        localStorage.setItem("userToken", token);
        router.push("/");
      }

      // console.log("Login Successful");
    } catch (err: any) {
      const errMsg =
        err.data?.message || err.error || "Invalid Email or Password";
      setErrorMessage(errMsg);
      setShowErrorPopup(true);
    }
  };

  const closeError = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };
  return (
    <div className="absolute top-25 right-35 min-w-[408px]">
      <div className="flex items-center mb-8">
        <div className="grow border-t border-gray-300 -mr-5 mt-12"></div>
        <h1 className="shrink text-center mb-3">Welcome Back,</h1>
        <div className="grow border-t border-gray-300 -ml-5 mt-12"></div>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mb-5">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="Enter email address"
              className="border border-[#D6DDEB] rounded p-3"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="Enter password"
              className="border border-[#D6DDEB] rounded p-3"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4640DE] text-white my-6 min-w-[408px] p-3 rounded-3xl cursor-pointer"
          >
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link href="/SignUp" className="text-[#4640DE] font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={closeError}
          isVisible={showErrorPopup}
        />
      )}
    </div>
  );
};

export default page;
