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

// Let's add some test inflation data
let testItemId;

beforeAll(async () => {
  // Get a tracked item ID from the test setup
  const result = await db.query(
    `SELECT id FROM tracked_items LIMIT 1`
  );
  testItemId = result.rows[0].id;

  // Insert test inflation data for this item
  await db.query(`
    DELETE FROM inflation_data WHERE tracked_item_id = $1
  `, [testItemId]);

  // Add two data points - one older, one more recent
  await db.query(`
    INSERT INTO inflation_data (tracked_item_id, date, value)
    VALUES 
      ($1, '2023-01-01', 5.2),
      ($1, '2023-02-01', 5.4)
  `, [testItemId]);
});

describe("GET /inflation/latest", () => {
  test("returns latest inflation data point for each item", async () => {
    const resp = await request(app).get("/inflation/latest");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("data");
    expect(Array.isArray(resp.body.data)).toBe(true);
    
    // Find our test item data
    const itemData = resp.body.data.find(d => d.tracked_item_id === testItemId);
    expect(itemData).toBeDefined();
    expect(itemData.date).toContain("2023-02-01");
    expect(itemData.value).toBe(5.4);
  });
});

describe("GET /inflation/:itemId/range", () => {
  test("returns data points within date range", async () => {
    const resp = await request(app)
      .get(`/inflation/${testItemId}/range`)
      .query({ start: "2023-01-01", end: "2023-02-01" });
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("data");
    expect(Array.isArray(resp.body.data)).toBe(true);
    expect(resp.body.data.length).toBe(2);
    
    // Check that both our data points are included
    const jan = resp.body.data.find(d => d.date.includes("2023-01-01"));
    const feb = resp.body.data.find(d => d.date.includes("2023-02-01"));
    
    expect(jan).toBeDefined();
    expect(jan.value).toBe(5.2);
    
    expect(feb).toBeDefined();
    expect(feb.value).toBe(5.4);
  });

  test("returns 400 if start/end dates missing", async () => {
    const resp = await request(app)
      .get(`/inflation/${testItemId}/range`);
    expect(resp.statusCode).toBe(400);
  });

  test("returns 404 for valid range with no data", async () => {
    const resp = await request(app)
      .get(`/inflation/${testItemId}/range`)
      .query({ start: "2020-01-01", end: "2020-02-01" });
    
    expect(resp.statusCode).toBe(404);
  });
});

describe("GET /inflation/:itemId", () => {
  test("returns all data points for a specific item", async () => {
    const resp = await request(app)
      .get(`/inflation/${testItemId}`);
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("data");
    expect(Array.isArray(resp.body.data)).toBe(true);
    expect(resp.body.data.length).toBe(2);
    
    // Check that both our data points are included
    const jan = resp.body.data.find(d => d.date.includes("2023-01-01"));
    const feb = resp.body.data.find(d => d.date.includes("2023-02-01"));
    
    expect(jan).toBeDefined();
    expect(jan.value).toBe(5.2);
    
    expect(feb).toBeDefined();
    expect(feb.value).toBe(5.4);
  });

  test("returns 404 for item with no data", async () => {
    // Get max ID and add 1 to ensure a non-existent item ID
    const result = await db.query(`SELECT MAX(id) + 1 AS nonexistent_id FROM tracked_items`);
    const nonExistentId = result.rows[0].nonexistent_id || 9999;
    
    const resp = await request(app)
      .get(`/inflation/${nonExistentId}`);
    
    expect(resp.statusCode).toBe(404);
  });
});