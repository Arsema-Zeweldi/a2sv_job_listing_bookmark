"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/navigation";
import { useAddNewUserMutation } from "../service/data";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ErrorPopup from "../components/ErrorPopup";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

const SignUp = () => {
  const router = useRouter();
  const form = useForm<FormValues>();

  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const [submitClicked, setSubmitClicked] = useState(false);

  const [addNewUser, { data, error, isLoading, isSuccess }] =
    useAddNewUserMutation();

  const passwordMatch = watch("password");

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormValues) => {
    setShowErrorPopup(false);
    setErrorMessage("");

    try {
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirm,
        role: "user",
      };
      await addNewUser(newUser).unwrap();
      router.push(`/Verify/${data.email}`);
    } catch (err: any) {
      console.error("Error adding new user:", err);
      const errMsg =
        err.data?.message || err.error || "An unexpected error has occurred.";
      setErrorMessage(errMsg);
      setShowErrorPopup(true);
    }
  };

  const closeError = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  const handleGoogleSignup = () => {
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <h1>Sign Up Today!</h1>
      <button
        onClick={handleGoogleSignup}
        className="flex flex-row min-w-[408px] gap-3 border rounded border-[#CCCCF5] items-center justify-center p-3 mt-5 mb-5 cursor-pointer"
      >
        <img
          src="google.jpeg"
          alt="google-icon"
          className="w-5 h-5 rounded-3xl "
        />
        <p className="font-bold text-[16px] text-[#4640DE]">
          Sign Up with Google
        </p>
      </button>
      <div className="flex flex-row min-w-[408px] items-center mb-8 gap-2">
        <div className="grow border-t border-[#202430]/40"></div>
        <p className="shrink text-center text-[#202430]/50">
          Or Sign Up with Email
        </p>
        <div className="grow border-t border-[#202430]/40"></div>
      </div>
      <div className="max-w-[408px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              {...register("name", {
                pattern: {
                  value: /^[A-Za-z\s]+$/i,
                  message: "Name can only contain letters and spaces",
                },
                required: {
                  value: true,
                  message: "Name is required",
                },
              })}
              className="border border-[#D6DDEB] rounded p-3"
            />
            <p className="text-red-500 text-[12px]">{errors.name?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-']+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              className="border border-[#D6DDEB] rounded p-3"
            />
            <p className="text-red-500 text-[12px]">{errors.email?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              {...register("password")}
              className="border border-[#D6DDEB] rounded p-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              placeholder="Enter password"
              {...register("confirm", {
                required: {
                  value: true,
                  message: "Confirmation is required",
                },
                validate: (fieldValue) => {
                  return fieldValue === passwordMatch || "Passwords must match";
                },
              })}
              className="border border-[#D6DDEB] rounded p-3"
            />
            {errors.confirm && (
              <p className="text-red-500 text-[12px]">
                {errors.confirm.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#4640DE] text-white my-6 min-w-[408px] p-3 rounded-3xl cursor-pointer"
          >
            Continue
          </button>
        </form>
        <p className="text-[14px] text-[#202430]/70">
          Already have an account?{" "}
          <Link href="/" className="text-[#4640DE]">
            Login
          </Link>
        </p>
        <p className="text-[12px] text-[#202430]/60 mt-5">
          By clicking 'Continue', you acknowledge that you have read and
          accepted out{" "}
          <span className="text-[#4640DE] text-[13px]">Terms or Service</span>{" "}
          and <span className="text-[#4640DE] text-[13px]">Privacy Policy</span>
          .
        </p>
      </div>
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={closeError}
          isVisible={showErrorPopup}
        />
      )}

      <DevTool control={control} />
    </div>
  );
};

export default SignUp;
