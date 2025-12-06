/// <reference types="cypress" />

describe("Job Bookmarking End-to-End Tests", () => {
  const TEST_JOB_ID = "job-101";
  const jobCardSelector = `[data-testid="job-card-${TEST_JOB_ID}"]`;
  const unfilledIconSelector = `${jobCardSelector} [data-testid="unfilled-bookmark-icon"]`;
  const filledIconSelector = `${jobCardSelector} [data-testid="filled-bookmark-icon"]`;

  beforeEach(() => {
    cy.intercept("GET", "**/opportunities/search", {
      statusCode: 200,
      body: [
        {
          id: "job-101",
          title: "Frontend Developer",
          logoUrl: "https://via.placeholder.com/100",
          orgName: "Acme Corp",
          location: "Remote",
          opType: "Full-time",
          categories: ["Tech"],
        },
      ],
    }).as("getJobs");

    cy.intercept("OPTIONS", "**/bookmarks", {
      statusCode: 200,
      body: {},
    });

    cy.intercept("GET", "**/bookmarks", {
      statusCode: 200,
      body: [],
    }).as("getBookmarks");

    cy.intercept("POST", "**/bookmarks/*", {
      statusCode: 200,
      body: { success: true },
    });

    cy.intercept("DELETE", "**/bookmarks/*", {
      statusCode: 200,
      body: { success: true },
    });

    cy.intercept("POST", "**/bookmarks/*").as("addBookmark");
    cy.intercept("DELETE", "**/bookmarks/*").as("removeBookmark");

    cy.window().then((win) => {
      win.localStorage.setItem("userToken", "fake-e2e-auth-token");
    });

    cy.visit("/");

    cy.get('[data-test-id="job-card-list"]', { timeout: 20000 }).should(
      "exist"
    );
  });

  it("should bookmark a job and appear in bookmark list", () => {
    cy.get(jobCardSelector, { timeout: 10000 }).should("exist");
    cy.get(unfilledIconSelector, { timeout: 10000 }).should("be.visible");

    cy.get(unfilledIconSelector).closest("button").click();

    cy.get(unfilledIconSelector).should("not.exist");
    cy.get(filledIconSelector).should("be.visible");

    cy.get(jobCardSelector).should("exist");

    cy.get(filledIconSelector).should("be.visible");
  });

  it("should unbookmark a job and remove it from the bookmark list", () => {
    // cy.get(jobCardSelector, { timeout: 10000 }).should("exist");
    cy.get(unfilledIconSelector, { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.wait("@addBookmark");

    cy.get(filledIconSelector, { timeout: 5000 }).should("be.visible");

    cy.get(filledIconSelector).click();

    cy.wait("@removeBookmark");

    cy.get(filledIconSelector).should("not.exist");
    cy.get(unfilledIconSelector).should("be.visible");
  });
});
