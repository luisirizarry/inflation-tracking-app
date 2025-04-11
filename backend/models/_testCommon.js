"use strict";

const db = require("../db");

let testItemId1;
let testItemId2;

async function commonBeforeAll() {
  await db.query("DELETE FROM inflation_data");
  await db.query("DELETE FROM tracked_items");
  await db.query("DELETE FROM categories");

  await db.query(`
    INSERT INTO categories (id, name)
    VALUES (1, 'Food'), (2, 'Housing')`);

  const res = await db.query(`
    INSERT INTO tracked_items (category_id, name, series_id)
    VALUES (1, 'Test Food Item', 'TEST_SERIES_1'),
           (2, 'Test Housing Item', 'TEST_SERIES_2')
    RETURNING id`);

  testItemId1 = res.rows[0].id;
  testItemId2 = res.rows[1].id;

  await db.query(
    `
    INSERT INTO inflation_data (tracked_item_id, date, value)
    VALUES 
      ($1, '2023-01-01', 120.0),
      ($1, '2023-02-01', 125.0),
      ($2, '2023-01-01', 210.0)
  `,
    [testItemId1, testItemId2]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

function getTestItemIds() {
  return { testItemId1, testItemId2 };
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestItemIds, // ✅ export the function instead of the raw variables
};
