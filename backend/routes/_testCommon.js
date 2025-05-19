"use strict";

const bcrypt = require("bcrypt");
const db = require("../db");
const { createToken } = require("../helpers/tokens");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testUserId;
let testCategoryId;
const testUserEmail = "testuser@example.com";

async function commonBeforeAll() {
  await db.query("DELETE FROM users");

  const hashedPw = await bcrypt.hash("secret", BCRYPT_WORK_FACTOR);
  const result = await db.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id`,
    [testUserEmail, hashedPw]
  );

  testUserId = result.rows[0].id;

  userToken = createToken({ id: testUserId, email: testUserEmail });

  // Setup test categories
  await db.query("DELETE FROM categories");

  const categoryResult = await db.query(
    `INSERT INTO categories (name, description)
     VALUES ('Test Category', 'A category used for testing')
     RETURNING id`
  );

  testCategoryId = categoryResult.rows[0].id;

  // Setup test items for the category - using tracked_items table
  await db.query("DELETE FROM tracked_items");

  await db.query(
    `INSERT INTO tracked_items (name, category_id, series_id)
     VALUES ('Test Item', $1, 'TEST123')`,
    [testCategoryId]
  );
}

// Rest of the file remains the same

function commonBeforeEach() {
  return db.query("BEGIN");
}

function commonAfterEach() {
  return db.query("ROLLBACK");
}

function commonAfterAll() {
  return db.end();
}

function getTestUserId() {
  return testUserId;
}

function getUserToken() {
  return userToken;
}

function getTestCategoryId() {
  return testCategoryId;
}

let userToken;

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestUserId,
  getUserToken,
  testUserEmail,
  getTestCategoryId,
};
