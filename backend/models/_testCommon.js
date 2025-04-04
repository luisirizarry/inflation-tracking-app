"use strict";

const db = require("../db");

async function commonBeforeAll() {
  // Clear tables
  await db.query("DELETE FROM inflation_data");
  await db.query("DELETE FROM tracked_items");
  await db.query("DELETE FROM categories");

  // Seed basic test data
  await db.query(`
    INSERT INTO categories (id, name)
    VALUES (1, 'Food'), (2, 'Housing')
    RETURNING id`);

  await db.query(`
    INSERT INTO tracked_items (category_id, name, series_id)
    VALUES (1, 'Test Food Item', 'TEST_SERIES_1'),
           (2, 'Test Housing Item', 'TEST_SERIES_2')
    RETURNING id`);

  await db.query(`
        INSERT INTO inflation_data (tracked_item_id, date, value)
        VALUES (1, '2023-01-01', 120.0),
               (1, '2023-02-01', 125.0),
               (2, '2023-01-01', 210.0)
      `);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
