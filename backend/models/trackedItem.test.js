"use strict";

const db = require("../db.js");
const TrackedItem = require("./trackedItem.js");
const { NotFoundError } = require("../expressError.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestItemIds,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("findAll", function () {
  test("returns all tracked items ordered by name", async function () {
    const result = await TrackedItem.findAll();
    expect(result.length).toBeGreaterThan(0);

    expect(result[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        category_id: expect.any(Number),
        name: expect.any(String),
        series_id: expect.any(String),
        created_at: expect.any(Date),
      })
    );
  });
});

describe("get", function () {
  test("returns single tracked item by ID", async function () {
    const { testItemId1 } = getTestItemIds();
    const item = await TrackedItem.get(testItemId1);

    expect(item).toEqual(
      expect.objectContaining({
        id: testItemId1,
        category_id: expect.any(Number),
        name: expect.any(String),
        series_id: expect.any(String),
        created_at: expect.any(Date),
      })
    );
  });

  test("throws NotFoundError for invalid ID", async function () {
    try {
      await TrackedItem.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
