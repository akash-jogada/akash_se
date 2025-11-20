jest.mock("../models/User");
jest.mock("../utils/emailService");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");
const httpMocks = require("node-mocks-http");
const authController = require("../controllers/authController");

describe("Auth Controller", () => {
  afterEach(() => jest.resetAllMocks());

  test("register creates user and returns token", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/auth/register",
      body: { name: "Test", email: "a@b.com", password: "pass" },
    });
    const res = httpMocks.createResponse();

    const fakeUser = {
      _id: "u1",
      name: "Test",
      email: "a@b.com",
      role: "buyer",
      isEmailVerified: false,
      getSignedJwtToken: () => "token123",
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(fakeUser);
    sendEmail.mockResolvedValue(true);

    await authController.register(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.success).toBe(true);
    expect(data.token).toBe("token123");
  });

  test("login returns 400 when missing creds", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {},
    });
    const res = httpMocks.createResponse();

    await authController.login(req, res);

    expect(res.statusCode).toBe(400);
  });

  test("login returns 401 when user not found", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: { email: "no@a.com", password: "p" },
    });
    const res = httpMocks.createResponse();

    User.findOne.mockImplementation(() => ({
      select: () => Promise.resolve(null),
    }));

    await authController.login(req, res);

    expect(res.statusCode).toBe(401);
  });

  test("login returns 401 when password mismatch", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: { email: "a@b.com", password: "wrong" },
    });
    const res = httpMocks.createResponse();

    const fakeUser = {
      comparePassword: async () => false,
      getSignedJwtToken: () => "t",
    };
    User.findOne.mockImplementation(() => ({
      select: () => Promise.resolve(fakeUser),
    }));

    await authController.login(req, res);

    expect(res.statusCode).toBe(401);
  });

  test("getMe returns current user", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/auth/me",
      user: { id: "u1" },
    });
    const res = httpMocks.createResponse();

    const userObj = { _id: "u1", email: "a@b.com" };
    User.findById.mockResolvedValue(userObj);

    await authController.getMe(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.data).toEqual(userObj);
  });
});
