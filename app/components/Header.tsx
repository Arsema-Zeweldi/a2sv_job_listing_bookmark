"use client";
import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Header = ({ num }: { num: number }) => {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push("/LogIn");
  };
  const handleSignupClick = () => {
    router.push("/SignUp");
  };
  const handleLogout = () => {
    localStorage.clear();
    setInterval(() => 4000);
    router.push("/");
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-10 ml-30 mr-80 mt-15">
        <div>
          <h1 className="text-[#25324B] font-black text-3xl">Opportunities</h1>
          <p className="text-gray-500">Showing {num} results</p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-gray-500">Sort by:</p>
          <select name="sort" id="sort">
            <option value="relevance">Most relevant</option>
            <option value="date">Date Posted</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>
      <div>
        {localStorage.getItem("userToken") ? (
          <div className="absolute top-3 right-5">
            <div className="flex flex-row gap-2">
              <IoPersonCircleOutline className="text-4xl text-gray-400" />
              <button
                className="text-lg text-gray-500 hover:underline hover:text-gray-600 cursor-pointer"
                onClick={handleLogout}
              >
                Logout{" "}
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute top-3 right-2 ">
            <button
              className="bg-[#56CDAD] mr-2 px-3 py-2 rounded text-white cursor-pointer"
              onClick={handleSignupClick}
            >
              Signup
            </button>
            <button
              className="bg-[#4640DE] px-3 py-2 text-white rounded cursor-pointer"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
