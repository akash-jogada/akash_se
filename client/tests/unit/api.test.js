// Placeholder no-op test to avoid Jest parsing ESM client code during server test runs
describe("noop", () => {
  it("does nothing (placeholder for client-only tests)", () => {
    expect(true).toBe(true);
  });
});
