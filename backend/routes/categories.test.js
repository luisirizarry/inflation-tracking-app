"use strict";

const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestCategoryId,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let testCategoryId;

beforeEach(() => {
  testCategoryId = getTestCategoryId();
});

describe("GET /categories", () => {
  test("gets all categories", async () => {
    const resp = await request(app).get("/categories");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
        }),
      ]),
    });
    // Verify that our test category is included
    expect(resp.body.categories.some((c) => c.id === testCategoryId)).toBe(
      true
    );
  });
});

describe("GET /categories/:id", () => {
  test("gets a single category by id", async () => {
    const resp = await request(app).get(`/categories/${testCategoryId}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      category: {
        id: testCategoryId,
        name: expect.any(String),
        description: expect.any(String),
      },
    });
  });

  test("returns 404 for non-existent category", async () => {
    const resp = await request(app).get("/categories/9999");
    expect(resp.statusCode).toBe(404);
  });
});

describe("GET /categories/:id/items", () => {
  test("gets a category with its items", async () => {
    const resp = await request(app).get(`/categories/${testCategoryId}/items`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      categoryWithItems: {
        id: testCategoryId,
        name: expect.any(String),
        description: expect.any(String),
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            series_id: expect.any(String),
          }),
        ]),
      },
    });
  });

  test("returns 404 for non-existent category", async () => {
    const resp = await request(app).get("/categories/9999/items");
    expect(resp.statusCode).toBe(404);
  });
});
