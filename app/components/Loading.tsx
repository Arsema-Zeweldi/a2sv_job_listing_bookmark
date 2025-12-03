import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// @ts-ignore: allow importing CSS without type declarations
import "@/app/style/Loading.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
