import API from "../services/api";

describe("API service (vitest only)", () => {
  beforeAll(() => {
    globalThis.localStorage = { getItem: () => null };
  });

  it("has correct baseURL and content-type header", () => {
    expect(API.defaults.baseURL).toBe("http://localhost:5000/api");

    const headers = API.defaults.headers || API.defaults.headers.common || {};
    const contentType =
      headers["Content-Type"] ||
      (headers.common && headers.common["Content-Type"]);
    expect(contentType).toBe("application/json");
  });
});
