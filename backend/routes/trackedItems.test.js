"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
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

// Get test tracked item ID
let testItemId;

beforeEach(async () => {
  // Get a tracked item ID from the test setup
  const result = await db.query(`SELECT id FROM tracked_items LIMIT 1`);
  testItemId = result.rows[0].id;
});

describe("GET /items", () => {
  test("returns all tracked items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("trackedItems");
    expect(Array.isArray(resp.body.trackedItems)).toBe(true);
    expect(resp.body.trackedItems.length).toBeGreaterThan(0);

    // Verify structure of returned items
    const item = resp.body.trackedItems[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("category_id");
    expect(item).toHaveProperty("series_id");

    // Verify our test item is included
    const testItem = resp.body.trackedItems.find((i) => i.id === testItemId);
    expect(testItem).toBeDefined();
  });
});

describe("GET /items/:id", () => {
  test("returns a single tracked item by ID", async () => {
    const resp = await request(app).get(`/items/${testItemId}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("trackedItem");

    const item = resp.body.trackedItem;
    expect(item).toHaveProperty("id");
    expect(item.id).toBe(testItemId);
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("category_id");
    expect(item).toHaveProperty("series_id");
  });

  test("returns 404 for non-existent item", async () => {
    // Get max ID and add 1 to ensure a non-existent item ID
    const result = await db.query(
      `SELECT MAX(id) + 1 AS nonexistent_id FROM tracked_items`
    );
    const nonExistentId = result.rows[0].nonexistent_id || 9999;

    const resp = await request(app).get(`/items/${nonExistentId}`);
    expect(resp.statusCode).toBe(404);
  });

  test("returns 400 for invalid ID format", async () => {
    const resp = await request(app).get("/items/not-a-number");
    expect(resp.statusCode).toBe(400);
  });
});
