"use client";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import JobListContainer from "./components/JobListContainer";

// const LazyJobListContainer = lazy(
//   () => import("./components/JobListContainer")
// );

export default function Home() {
  return (
    <div data-test-id="job-card-list">
      {/* <Suspense fallback={<Loading />}>
        <JobListContainer />
      </Suspense> */}
      <div data-testid="job-card-list">
        <JobListContainer />
      </div>
    </div>
  );
}
