"use client";
import JobCard from "./JobCard";
import JobListingInterface from "@/app/JobListingInterface";
import Header from "./Header";
import { useGetAllOpportunitiesQuery } from "@/app/service/data";
import Loading from "./Loading";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const JobListContainer = () => {
  const router = useRouter();
  // Get all opportunities
  const {
    data: jobs = [],
    isError,
    isLoading,
  } = useGetAllOpportunitiesQuery(undefined as any, {});

  const [isMounted, setIsMounted] = useState(false);

  // Turn the fetched data into an array
  const jobsList: any[] = Array.isArray(jobs)
    ? jobs
    : Array.isArray((jobs as any)?.data)
    ? (jobs as any).data
    : [];

  // Find the total number of opportunities fetched
  const len = jobsList.length;

  const jobsWithLogo = jobsList.filter((j) => (j.logoUrl ?? "").trim() !== "");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //If an error has occured while fetching the data, route to the error page
  useEffect(() => {
    if (isMounted && !isLoading && isError) {
      router.push("/error");
    }
  }, [isMounted, isLoading, isError, router]);

  //If the page is loading, render the loading component
  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Call the header component and pass the length */}
      <Header num={len} />
      {jobsWithLogo.map((job) => (
        <JobCard key={job.id} data-testid={`job-card-${job.id}`} {...job} />
      ))}
      {/* Call the JobCard component for each job to be rendered */}
      {/* {jobsWithLogo.length > 0 ? (
        jobsWithLogo.map((job) => (
          
        ))
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No job opportunities found.
        </p>
      )} */}
    </div>
  );
};

export default JobListContainer;
