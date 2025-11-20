jest.mock("../models/Order");
jest.mock("../models/Product");
const Order = require("../models/Order");
const Product = require("../models/Product");
const httpMocks = require("node-mocks-http");
const orderController = require("../controllers/orderController");

describe("Order Controller", () => {
  afterEach(() => jest.clearAllMocks());

  test("createOrder returns 400 when no items", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/orders",
      body: { items: [] },
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    await orderController.createOrder(req, res);

    expect(res.statusCode).toBe(400);
  });

  test("createOrder returns 404 when product not found", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/orders",
      body: { items: [{ product: "p1", quantity: 1 }] },
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    Product.findById.mockResolvedValue(null);

    await orderController.createOrder(req, res);

    expect(res.statusCode).toBe(404);
  });

  test("createOrder returns 400 when insufficient stock", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/orders",
      body: { items: [{ product: "p1", quantity: 5 }] },
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    const prod = { _id: "p1", name: "X", price: 10, stock: 1, save: jest.fn() };
    Product.findById.mockResolvedValue(prod);

    await orderController.createOrder(req, res);

    expect(res.statusCode).toBe(400);
  });

  test("createOrder creates order when valid", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/orders",
      body: { items: [{ product: "p1", quantity: 2 }], shippingAddress: {} },
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    const prod = {
      _id: "p1",
      name: "X",
      price: 10,
      stock: 5,
      save: jest.fn().mockResolvedValue(true),
    };
    Product.findById.mockResolvedValue(prod);
    Order.create.mockResolvedValue({ id: "o1" });

    await orderController.createOrder(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.success).toBe(true);
  });

  test("getUserOrders returns list", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/orders",
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    Order.find.mockImplementation(() => ({
      populate: () => ({ sort: () => Promise.resolve([{ id: "o1" }]) }),
    }));

    await orderController.getUserOrders(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(Array.isArray(data.data)).toBe(true);
  });
});
