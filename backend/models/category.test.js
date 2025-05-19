"use strict";

const db = require("../db");
const Category = require("./category");
const { NotFoundError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Category.findAll", () => {
  test("returns all categories ordered by name", async () => {
    const categories = await Category.findAll();
    expect(categories).toHaveLength(2);
    // should be alphabetically: 'Food', then 'Housing'
    expect(categories[0]).toEqual({
      id: 1,
      name: "Food",
      description: null,
    });
    expect(categories[1]).toEqual({
      id: 2,
      name: "Housing",
      description: null,
    });
  });

  test("throws NotFoundError if no categories exist", async () => {
    // clear out categories table
    await db.query("DELETE FROM categories");
    await db.query("DELETE FROM tracked_items");
    await db.query("DELETE FROM inflation_data");

    try {
      await Category.findAll();
      throw new Error("fail test, expected NotFoundError");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Category.get", () => {
  test("returns a single category by id", async () => {
    const category = await Category.get(1);
    expect(category).toEqual({
      id: 1,
      name: "Food",
      description: null,
    });
  });

  test("throws NotFoundError for invalid id", async () => {
    try {
      await Category.get(0);
      throw new Error("fail test, expected NotFoundError");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Category.getWithItems", () => {
  test("returns category together with its tracked items", async () => {
    const result = await Category.getWithItems(1);
    expect(result).toEqual({
      id: 1,
      name: "Food",
      description: null,
      items: [
        {
          id: expect.any(Number),
          name: "Test Food Item",
          series_id: "TEST_SERIES_1",
        },
      ],
    });
    // ensure the item id matches the seeded one
    const seededItems = await db.query(
      `SELECT id FROM tracked_items WHERE name = 'Test Food Item'`
    );
    expect(result.items[0].id).toBe(seededItems.rows[0].id);
  });

  test("returns category with empty items array if no tracked items", async () => {
    // insert a new category with no items
    await db.query(`INSERT INTO categories (id, name) VALUES (3, 'Empty')`);
    const result = await Category.getWithItems(3);
    expect(result).toEqual({
      id: 3,
      name: "Empty",
      description: null,
      items: [],
    });
  });

  test("throws NotFoundError for invalid category id", async () => {
    try {
      await Category.getWithItems(0);
      throw new Error("fail test, expected NotFoundError");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
