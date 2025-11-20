jest.mock("../models/User");
jest.mock("../models/Product");
jest.mock("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const httpMocks = require("node-mocks-http");
const adminController = require("../controllers/adminController");

describe("Admin Controller", () => {
  afterEach(() => jest.resetAllMocks());

  test("getDashboardStats returns aggregated data", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    User.countDocuments = jest.fn().mockResolvedValue(5);
    Product.countDocuments = jest.fn().mockResolvedValue(10);
    Order.countDocuments = jest
      .fn()
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(2);
    Order.aggregate = jest.fn().mockResolvedValue([{ total: 1000 }]);

    await adminController.getDashboardStats(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.data.totalUsers).toBe(5);
    expect(data.data.totalRevenue).toBe(1000);
  });

  test("getAllUsers returns list", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    User.find = jest
      .fn()
      .mockReturnValue({
        select: () => ({ sort: () => Promise.resolve([{ id: "u1" }]) }),
      });

    await adminController.getAllUsers(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.count).toBe(1);
  });

  test("deleteUser handles not found and self-delete", async () => {
    const req = httpMocks.createRequest({
      params: { id: "u1" },
      user: { _id: "me" },
    });
    const res = httpMocks.createResponse();

    User.findById = jest.fn().mockResolvedValue(null);
    await adminController.deleteUser(req, res);
    expect(res.statusCode).toBe(404);

    const userObj = { _id: "me", deleteOne: jest.fn() };
    User.findById = jest.fn().mockResolvedValue(userObj);
    req.user._id = "me";
    const res2 = httpMocks.createResponse();
    await adminController.deleteUser(req, res2);
    expect(res2.statusCode).toBe(400);
  });

  test("getAllProducts returns list", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Product.find = jest
      .fn()
      .mockReturnValue({
        populate: () => ({
          populate: () => ({ sort: () => Promise.resolve([{ id: "p1" }]) }),
        }),
      });

    await adminController.getAllProducts(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.count).toBe(1);
  });

  test("deleteProduct handles not found and deletion", async () => {
    const req = httpMocks.createRequest({ params: { id: "p1" } });
    const res = httpMocks.createResponse();

    Product.findById = jest.fn().mockResolvedValue(null);
    await adminController.deleteProduct(req, res);
    expect(res.statusCode).toBe(404);

    const prod = { _id: "p1", deleteOne: jest.fn().mockResolvedValue(true) };
    Product.findById = jest.fn().mockResolvedValue(prod);
    const res2 = httpMocks.createResponse();
    await adminController.deleteProduct(req, res2);
    expect(res2.statusCode).toBe(200);
  });

  test("getAllOrders returns list and updateOrderStatus updates", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Order.find = jest
      .fn()
      .mockReturnValue({
        populate: () => ({
          populate: () => ({ sort: () => Promise.resolve([{ id: "o1" }]) }),
        }),
      });
    await adminController.getAllOrders(req, res);
    expect(res.statusCode).toBe(200);

    const req2 = httpMocks.createRequest({
      params: { id: "o1" },
      body: { status: "shipped" },
    });
    const res2 = httpMocks.createResponse();
    Order.findById = jest.fn().mockResolvedValue(null);
    await adminController.updateOrderStatus(req2, res2);
    expect(res2.statusCode).toBe(404);

    const order = { _id: "o1", save: jest.fn().mockResolvedValue(true) };
    Order.findById = jest.fn().mockResolvedValue(order);
    const res3 = httpMocks.createResponse();
    await adminController.updateOrderStatus(req2, res3);
    expect(res3.statusCode).toBe(200);
  });
});
