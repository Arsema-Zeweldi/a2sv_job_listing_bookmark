"use client";
import React from "react";
import JobListingInterface from "../../JobListingInterface";
import { LuCirclePlus, LuCalendarCheck, LuCalendar1 } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { useGetOpportunityByIdQuery } from "@/app/service/data";
import Loading from "@/app/components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type IconBoxProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

const IconBox = ({ children, size = "md", className = "" }: IconBoxProps) => {
  const base =
    "flex items-center justify-center rounded-3xl border border-gray-300";
  const sizing = size === "sm" ? "p-1 w-8 h-8" : "p-3 w-12 h-12";
  return <div className={`${base} ${sizing} ${className}`}>{children}</div>;
};

export default function Job() {
  //Page to show the details of each data? card by data? id
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) {
    return <div className="p-10">data? not found.</div>;
  }

  const router = useRouter();
  //Get the current id's information from the api
  const { data, isError, isLoading } = useGetOpportunityByIdQuery(id);

  //If an error has occured while fetching the data, route to the error page
  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/error");
    }
  }, [isLoading, isError, router]);

  //If the page is loading, render the loading component
  if (isLoading) return <Loading />;

  return (
    <>
      {data && (
        <div className="flex flex-row flex-1 p-10 gap-10">
          <div>
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mb-2 mt-10">
                Description
              </h1>
              <p className="text-md">{data?.data.description}</p>
            </div>
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
                Responsibilities
              </h1>
              <ul>
                {data?.data.responsibilities
                  ?.split("\n")
                  .map((resp: string, idx: number) => (
                    <li key={idx} className="flex gap-3 items-start text-md">
                      <IconBox size="sm" className="border-0 bg-transparent">
                        <FaRegCircleCheck
                          className="text-[#56CDAD] text-lg"
                          aria-hidden
                        />
                      </IconBox>
                      <span className="mt-0.5">{resp}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
                Ideal Candidate we want
              </h1>
              <ul>
                {data?.data?.idealCandidate
                  ?.split("\n")
                  .map((detail: string, idx: string) => (
                    <li key={idx} className="flex gap-3 items-start text-md">
                      <IconBox size="sm" className="border-0 bg-transparent">
                        <GoDotFill className="text-xs" aria-hidden />
                      </IconBox>
                      <div className="inline-flex">
                        <p className="mt-1.5 inline">
                          <span className="font-bold">{detail}</span>
                        </p>
                        <p className="inline  mt-1.5"></p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
                When & Where
              </h1>
              <div className="flex items-center gap-4">
                <IconBox size="sm">
                  <GrLocation
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <p className="text-md">{data?.data.whenAndWhere}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mb-5">About</h1>
              <div className="flex gap-4 mb-4">
                <IconBox size="sm">
                  <LuCirclePlus
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <div>
                  <p className="text-[#515B6F] text-[14px] mt-[-5]">
                    Posted On
                  </p>
                  <p className="font-semibold text-[14px]">
                    {data?.data.datePosted.slice(0, 10)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <IconBox size="sm">
                  <MdOutlineLocalFireDepartment
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <div>
                  <p className="text-[#515B6F] text-[14px] mt-[-5]">Deadline</p>
                  <p className="font-semibold text-[14px]">
                    {data?.data.deadline.slice(0, 10)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <IconBox size="sm">
                  <GrLocation
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <div>
                  <p className="text-[#515B6F] text-[14px] mt-[-5]">Location</p>
                  <p className="font-semibold text-[14px]">
                    {data?.data.location}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <IconBox size="sm">
                  <LuCalendar1
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <div>
                  <p className="text-[#515B6F] text-[14px] mt-[-5]">
                    Start Date
                  </p>
                  <p className="font-semibold text-[14px]">
                    {data?.data.startDate.slice(0, 10)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <IconBox size="sm">
                  <LuCalendarCheck
                    className="text-[#26A4FF] text-base"
                    aria-hidden
                  />
                </IconBox>
                <div>
                  <p className="text-[#515B6F] text-[14px] mt-[-5]">End Date</p>
                  <p className="font-semibold text-[14px]">
                    {data?.data.endDate.slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
            <hr className="text-gray-400 mt-10" />
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
                Categories
              </h1>
              <div className="flex gap-2">
                {data?.data.categories?.map((category: string, idx: number) => {
                  const isEven = idx % 2 === 0;
                  const colorClasses = isEven
                    ? "text-amber-400 bg-amber-100"
                    : "text-green-600 bg-green-100";

                  return (
                    <div
                      key={idx}
                      className={`${colorClasses} text-[12px] px-3 py-1 rounded-3xl`}
                    >
                      {category}
                    </div>
                  );
                })}
              </div>
            </div>
            <hr className="text-gray-400 mt-6" />
            <div>
              <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
                Required Skills
              </h1>
              <div className="flex gap-2">
                {data?.data.requiredSkills?.map(
                  (skill: string, idx: string) => (
                    <div
                      key={idx}
                      className="text-[12px] text-[#4640DE] bg-gray-100 pl-3 pr-3 pt-1 pb-1 rounded"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
