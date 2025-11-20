const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");
jest.mock("../models/User");
const User = require("../models/User");
const httpMocks = require("node-mocks-http");
const { protect, authorize } = require("../middleware/auth");

describe("Auth Middleware", () => {
  afterEach(() => jest.resetAllMocks());

  test("protect returns 401 without token", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  test("protect sets req.user with valid token", async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: "Bearer tok" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: "u1" });
    User.findById = jest.fn().mockResolvedValue({ _id: "u1" });

    await protect(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  test("protect returns 401 on invalid token", async () => {
    const req = httpMocks.createRequest({
      headers: { authorization: "Bearer bad" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("bad");
    });

    await protect(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  test("authorize returns 403 for unauthorized role", () => {
    const req = httpMocks.createRequest({ user: { role: "customer" } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mw = authorize("admin");
    mw(req, res, next);
    expect(res.statusCode).toBe(403);
  });

  test("authorize calls next for allowed role", () => {
    const req = httpMocks.createRequest({ user: { role: "admin" } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const mw = authorize("admin", "artisan");
    mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
