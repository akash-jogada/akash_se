const request = require("supertest");
const app = require("../server");

const Product = require("../models/Product");

jest.mock("../models/Product");

describe("GET /api/products", () => {
  it("returns products list", async () => {
    const products = [
      {
        _id: "1",
        name: "P1",
        createdAt: new Date().toISOString(),
        category: { name: "C" },
        artisan: { name: "A" },
      },
    ];

    // chainable mock for populate().populate().sort()
    const chain = {
      populate: () => chain,
      sort: () => Promise.resolve(products),
    };

    Product.find.mockReturnValue(chain);

    const res = await request(app).get("/api/products").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe("P1");
  });
});
