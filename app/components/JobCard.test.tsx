/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/dom";
import JobCard from "./JobCard";
import { act } from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <div {...props} data-testid="next-image" />,
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

jest.mock("@/app/service/data", () => ({
  useGetBookmarksQuery: jest.fn(),
  useCreateBookmarksMutation: jest.fn(),
  useDeleteBookmarkMutation: jest.fn(),
}));

const mockUseGetBookmarksQuery =
  require("@/app/service/data").useGetBookmarksQuery;
const mockUseCreateBookmarksMutation =
  require("@/app/service/data").useCreateBookmarksMutation;
const mockUseDeleteBookmarkMutation =
  require("@/app/service/data").useDeleteBookmarkMutation;

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();
Object.defineProperty(global, "localStorage", { value: mockLocalStorage });

const TEST_JOB_ID = "job-101";
const OTHER_JOB_ID = "job-999";
const MOCK_TOKEN = "fake-auth-token";

const mockJobProps = {
  id: TEST_JOB_ID,
  title: "Test Developer Role",
  orgName: "Test Corp",
  location: ["Remote"],
  description: "Test description.",
  opType: "Full-Time",
  categories: ["Test"],
  logoUrl: "/test-logo.png",
};

describe("JobCard Bookmarking Functionality", () => {
  let mockMutationTrigger: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("userToken", MOCK_TOKEN);

    mockMutationTrigger = jest.fn((id) => ({
      unwrap: () => Promise.resolve(),
    }));
    const mockMutationHook = [
      mockMutationTrigger,
      { isLoading: false, isError: false },
    ];

    mockUseCreateBookmarksMutation.mockReturnValue(mockMutationHook);
    mockUseDeleteBookmarkMutation.mockReturnValue(mockMutationHook);
  });

  test("should render the Job Card successfully with all details", async () => {
    mockUseGetBookmarksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    await act(async () => {
      render(<JobCard {...mockJobProps} />);
    });

    expect(screen.getByText("Test Developer Role")).toBeInTheDocument();
    expect(screen.getByText(/Test Corp/i)).toBeInTheDocument();
    expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    expect(screen.getByText("Full-Time")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();

    expect(screen.getByTestId("unfilled-bookmark-icon")).toBeInTheDocument();
  });

  test("should render Job Not Found content when essential props are missing", async () => {
    mockUseGetBookmarksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    const emptyJobProps = {
      id: "missing-job",
      title: "",
      orgName: "",
      location: [],
      description: "",
      opType: "",
      categories: [],
    };

    await act(async () => {
      render(<JobCard {...emptyJobProps} />);
    });

    expect(screen.queryByText("Test Developer Role")).not.toBeInTheDocument();
  });

  test("should create a bookmark that switches to filled when clicked", async () => {
    const mockCreateTrigger = jest.fn((id) => ({
      unwrap: () => Promise.resolve(),
    }));
    mockUseCreateBookmarksMutation.mockReturnValue([
      mockCreateTrigger,
      { isLoading: false, isError: false },
    ]);
    mockUseGetBookmarksQuery.mockReturnValue({
      data: [{ eventId: OTHER_JOB_ID }],
      isLoading: false,
      isSuccess: true,
    });
    let container;

    await act(async () => {
      container = render(<JobCard {...mockJobProps} />).container;
    });

    const unfilledIcon = screen.getByTestId("unfilled-bookmark-icon");
    await waitFor(() => {
      expect(unfilledIcon).toBeInTheDocument();
    });

    fireEvent.click(unfilledIcon.closest("button")!);

    await waitFor(() => {
      expect(mockCreateTrigger).toHaveBeenCalledWith(TEST_JOB_ID);
      expect(mockCreateTrigger).toHaveBeenCalledTimes(1);
    });
  });

  test("should switch from filled to unfilled upon delete success", async () => {
    mockMutationTrigger.mockClear();
    mockUseGetBookmarksQuery.mockReturnValue({
      data: [{ eventID: TEST_JOB_ID }, { eventID: OTHER_JOB_ID }],
      isLoading: false,
      isSuccess: true,
    });

    const mockDeleteTrigger = jest.fn((id) => ({
      unwrap: () => Promise.resolve(),
    }));
    mockUseDeleteBookmarkMutation.mockReturnValue([
      mockDeleteTrigger,
      { isLoading: false, isError: false },
    ]);

    await act(async () => {
      render(<JobCard {...mockJobProps} />);
    });

    const filledIcon = screen.getByTestId("filled-bookmark-icon");

    await waitFor(() => {
      expect(filledIcon).toBeInTheDocument();
    });

    fireEvent.click(filledIcon.closest("button")!);

    await waitFor(() => {
      expect(mockDeleteTrigger).toHaveBeenCalledWith(TEST_JOB_ID);
      expect(mockDeleteTrigger).toHaveBeenCalledTimes(1);
    });
  });
});
