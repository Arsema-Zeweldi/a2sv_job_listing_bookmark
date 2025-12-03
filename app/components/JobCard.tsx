import React from "react";
import JobListingInterface from "../JobListingInterface";
import Link from "next/link";
import Image from "next/image";

const JobCard = (job: JobListingInterface) => {
  return (
    <div className="border-gray-300 border rounded-4xl mr-80 ml-30 mt-5 mb-5 p-5 hover:bg-gray-300">
      <div className="p-2 flex gap-6">
        <div className="w-50 h-20 overflow-hidden">
          <Image
            src={job.logoUrl}
            alt={`${job.title} logo`}
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
        <div className="">
          <Link
            href={`/Job/${job.id}`}
            className="text-[20px] font-semibold text-[#25324B] mb-1"
          >
            {job.title}
          </Link>
          <p className="text-[#7C8493] mb-2 text-[16px]">
            {job.orgName} <span className="text-4xl relative bottom-1">.</span>{" "}
            {job.location}
          </p>
          <p>{job.description}</p>
          <div className="flex align-center mt-2">
            <div className="text-[#56CDAD] bg-green-100 p-2 rounded-3xl text-center text-sm font-semibold">
              {job.opType}
            </div>
            <div className="h-9 w-0.5 bg-gray-300 mx-3"></div>
            <div className="flex gap-2 align-center justify-center  text-sm">
              {job.categories.map((category, idx) => {
                const isEven = idx % 2 === 0;
                const colorClasses = isEven
                  ? "text-amber-400"
                  : "text-[#4640DE]";

                return (
                  <div
                    key={idx}
                    className={`${colorClasses} min-w-20 text-center border-2 pt-2 pb-2 pr-4 pl-4 rounded-3xl font-semibold`}
                  >
                    {category}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
