"use strict";

const bcrypt = require("bcrypt");
const db = require("../db");
const { createToken } = require("../helpers/tokens");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testUserId;
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
}

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

let userToken; 

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestUserId,
  getUserToken,
  testUserEmail,
};
