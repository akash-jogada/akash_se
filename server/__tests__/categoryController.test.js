jest.mock("../models/Category");
const Category = require("../models/Category");
const httpMocks = require("node-mocks-http");
const categoryController = require("../controllers/categoryController");

describe("Category Controller", () => {
  afterEach(() => jest.resetAllMocks());

  test("createCategory returns 201 when new", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { name: "c1", description: "d" },
    });
    const res = httpMocks.createResponse();

    Category.findOne = jest.fn().mockResolvedValue(null);
    Category.create = jest.fn().mockResolvedValue({ id: "c1" });

    await categoryController.createCategory(req, res);
    expect(res.statusCode).toBe(201);
  });

  test("createCategory returns 400 when exists", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { name: "c1" },
    });
    const res = httpMocks.createResponse();

    Category.findOne = jest.fn().mockResolvedValue({ id: "c1" });
    await categoryController.createCategory(req, res);
    expect(res.statusCode).toBe(400);
  });

  test("getCategories returns list", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Category.find = jest
      .fn()
      .mockReturnValue({ sort: () => Promise.resolve([{ id: "c1" }]) });
    await categoryController.getCategories(req, res);
    expect(res.statusCode).toBe(200);
  });
});
