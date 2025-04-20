"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserEmail,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works with valid credentials", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        email: testUserEmail,
        password: "secret",
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        email: testUserEmail,
        password: "wrong",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({});
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        email: "not-an-email",
        password: "123",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("registers new user and returns token", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        email: "newuser@example.com",
        password: "newpass",
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ token: expect.any(String) });
  });

  test("returns 400 for duplicate email", async () => {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        email: testUserEmail,
        password: "secret",
      });
    expect(resp.statusCode).toBe(400);
  });

  test("returns 400 for invalid data", async () => {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        email: "not-an-email",
        password: "123",
      });
    expect(resp.statusCode).toBe(400);
  });
});
