"use client";
import JobCard from "./components/JobCard";
import JobListingInterface from "./JobListingInterface";
import Header from "./components/Header";
import { useGetAllOpportunitiesQuery } from "./service/data";
import Loading from "./components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  // Get all opportunities
  const {
    data: jobs = [],
    isError,
    isLoading,
  } = useGetAllOpportunitiesQuery(undefined as any);

  // Turn the fetched data into an array
  const jobsList: any[] = Array.isArray(jobs)
    ? jobs
    : Array.isArray((jobs as any)?.data)
    ? (jobs as any).data
    : [];

  // Find the total number of opportunities fetched
  const len = jobsList.length;

  const jobsWithLogo = jobsList.filter((j) => (j.logoUrl ?? "").trim() !== "");

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
      {jobs && (
        <>
          {/* Call the header component and pass the length */}
          <Header num={len} />
          {/* Call the JobCard component for each job to be rendered */}
          {jobsWithLogo.map((job: JobListingInterface) => (
            <JobCard key={job.id} {...job} />
          ))}
        </>
      )}
    </>
  );
}
