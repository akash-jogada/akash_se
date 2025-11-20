const httpMocks = require("node-mocks-http");
jest.mock("../models/Product");
const Product = require("../models/Product");
const productController = require("../controllers/productController");

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getProducts returns list", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/products",
    });
    const res = httpMocks.createResponse();

    const fakeProducts = [{ name: "A" }, { name: "B" }];
    Product.find.mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          sort: () => Promise.resolve(fakeProducts),
        }),
      }),
    }));

    await productController.getProducts(req, res);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBe(2);
  });

  test("getProductById returns 404 when not found", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/products/1",
      params: { id: "1" },
    });
    const res = httpMocks.createResponse();

    Product.findById.mockImplementation(() => ({
      populate: () => ({
        populate: () => Promise.resolve(null),
      }),
    }));

    await productController.getProductById(req, res);

    expect(res.statusCode).toBe(404);
    const data = res._getJSONData();
    expect(data.success).toBe(false);
  });

  test("createProduct validates required fields", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/products",
      body: {},
    });
    const res = httpMocks.createResponse();

    await productController.createProduct(req, res);

    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.success).toBe(false);
  });

  test("updateProduct returns 404 when product missing", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/api/products/1",
      params: { id: "1" },
      body: {},
      user: { _id: "u1", role: "artisan" },
    });
    const res = httpMocks.createResponse();

    Product.findById.mockResolvedValue(null);

    await productController.updateProduct(req, res);

    expect(res.statusCode).toBe(404);
  });

  test("deleteProduct returns 404 when product missing", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      url: "/api/products/1",
      params: { id: "1" },
      user: { _id: "u1", role: "artisan" },
    });
    const res = httpMocks.createResponse();

    Product.findById.mockResolvedValue(null);

    await productController.deleteProduct(req, res);

    expect(res.statusCode).toBe(404);
  });

  test("reorderProductImages handles missing product", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/api/products/1/reorder-images",
      params: { id: "1" },
      body: { primaryImageIndex: 0 },
      user: { _id: "u1" },
    });
    const res = httpMocks.createResponse();

    Product.findById.mockResolvedValue(null);

    await productController.reorderProductImages(req, res);

    expect(res.statusCode).toBe(404);
  });
});
