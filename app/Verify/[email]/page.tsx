"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";
import { useVerifyUserMutation } from "@/app/service/data";
import { useRouter } from "next/navigation";
import ErrorPopup from "@/app/components/ErrorPopup";

type verifyCode = {
  one: string;
  two: string;
  three: string;
  four: string;
};

const defaultTime = 30;
const Verify = () => {
  const router = useRouter();
  const form = useForm<verifyCode>();

  const params = useParams();
  const email_percent = params.email as string;

  const email = decodeURIComponent(email_percent);
  // console.log(email);

  const { register, handleSubmit, watch, setValue } = form;
  const [timer, setTimer] = useState(defaultTime);
  const [timerDone, setTimerDone] = useState(false);

  const [verifyUser, { data, error, isLoading, isSuccess }] =
    useVerifyUserMutation();

  const watchInputs = watch();

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isCodeComplete = Object.values(watchInputs).every(
    (value) => typeof value === "string" && value.trim().length > 0
  );

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleResend = () => {
    setTimer(defaultTime);
    setTimerDone(false);
  };

  const onSubmit: SubmitHandler<verifyCode> = async (input) => {
    setShowErrorPopup(false);
    setErrorMessage("");
    try {
      const fullCode = input.one + input.two + input.three + input.four;
      const verifyCode = {
        email: email,
        OTP: fullCode,
      };

      const res = await verifyUser(verifyCode).unwrap();
      const token = res.data.accessToken;

      if (token) {
        console.log("Verification Successful!");
        localStorage.setItem("userToken", token);
        router.push("/");
      }
    } catch (err: any) {
      const errMsg = err.data?.message || err.error || "Verification Failed.";
      setErrorMessage(errMsg);
      setShowErrorPopup(true);
    }
  };

  const closeError = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: keyof verifyCode
  ) => {
    const { value } = e.target;
    const digit = value.slice(-1);

    setValue(fieldName, digit, { shouldValidate: true });

    if (digit && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  useEffect(() => {
    if (timerDone) return;
    const intervalId = setInterval(() => {
      setTimer((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setTimerDone(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerDone]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-10">Verify Email</h1>
      <p className="max-w-[408px] text-[14px] mb-17">
        We've sent a verification code to the email address you provided. To
        complete the verifivation process, please enter the code here.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="flex flex-row gap-7">
          <input
            type="text"
            maxLength={1}
            id="one"
            {...register("one")}
            ref={inputRefs[0]}
            onChange={(e) => handleChange(e, 0, "one")}
            placeholder="0"
            className="text-2xl border-2 border-[#4640DE]/40 w-[76px] h-[50px] rounded text-center"
          />
          <input
            type="text"
            maxLength={1}
            id="two"
            {...register("two")}
            ref={inputRefs[1]}
            onChange={(e) => handleChange(e, 1, "two")}
            placeholder="0"
            className="text-2xl border-2 border-[#4640DE]/40 w-[76px] h-[50px] rounded text-center"
          />
          <input
            type="text"
            maxLength={1}
            id="three"
            {...register("three")}
            ref={inputRefs[2]}
            onChange={(e) => handleChange(e, 2, "three")}
            placeholder="0"
            className="text-2xl border-2 border-[#4640DE]/40 w-[76px] h-[50px] rounded text-center"
          />
          <input
            type="text"
            maxLength={1}
            id="four"
            {...register("four")}
            ref={inputRefs[3]}
            onChange={(e) => handleChange(e, 3, "four")}
            placeholder="0"
            className="text-2xl border-2 border-[#4640DE]/40 w-[76px] h-[50px] rounded text-center"
          />
        </div>
        <p className="text-[14px] mb-13 mt-5 max-w-[250px] text-center">
          You can request to{" "}
          <button
            className="text-[#4640DE] cursor-pointer"
            onClick={handleResend}
          >
            Resend code
          </button>{" "}
          in <span className="text-[#4640DE]">0:{timer}</span>
        </p>
        <button
          type="submit"
          disabled={!isCodeComplete}
          className={`min-w-[408px] p-3 text-white rounded-3xl ${
            isCodeComplete ? "bg-[#4640DE] cursor-pointer" : "bg-[#4640DE]/40"
          }`}
        >
          Continue
        </button>
      </form>
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

export default Verify;
