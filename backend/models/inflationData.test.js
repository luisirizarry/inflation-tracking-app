"use strict";

const db = require("../db.js");
const InflationData = require("./inflationData.js");
const { NotFoundError } = require("../expressError.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestItemIds, // ✅ use function to safely access test IDs
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("findByItemId", function () {
  test("returns full data series for item", async function () {
    const { testItemId1 } = getTestItemIds(); // ✅ safely get value
    const result = await InflationData.findByItemId(testItemId1);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(
      expect.objectContaining({
        tracked_item_id: testItemId1,
        date: expect.any(Date),
        value: expect.any(Number),
      })
    );
  });

  test("throws NotFoundError for invalid ID", async function () {
    try {
      await InflationData.findByItemId(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("findByItemAndRange", function () {
  test("returns data in range", async function () {
    const { testItemId1 } = getTestItemIds();
    const result = await InflationData.findByItemAndRange(
      testItemId1,
      "2023-01-01",
      "2023-01-31"
    );
    expect(result.length).toBe(1);
    expect(result[0].value).toBe(120.0);
  });

  test("throws NotFoundError if no data in range", async function () {
    const { testItemId1 } = getTestItemIds();
    try {
      await InflationData.findByItemAndRange(
        testItemId1,
        "2022-01-01",
        "2022-01-31"
      );
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("getLatestForAll", function () {
  test("returns latest entry for each item", async function () {
    const result = await InflationData.getLatestForAll();
    expect(result.length).toBeGreaterThan(0);
    const itemIds = new Set(result.map((r) => r.tracked_item_id));
    expect(itemIds.size).toBe(result.length); // should be unique per item
  });
});
