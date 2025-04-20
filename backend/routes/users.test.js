"use strict";

const request = require("supertest");
const app = require("../app");
const { createToken } = require("../helpers/tokens");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestUserId,
  getUserToken,
  testUserEmail,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Use the getter functions to access the values
let testUserId;
let userToken;

beforeEach(() => {
  testUserId = getTestUserId();
  userToken = getUserToken();
});

describe("GET /users/:userId", () => {
  test("returns user data with valid token", async () => {
    const resp = await request(app)
      .get(`/users/${testUserId}`)
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      user: {
        id: testUserId,
        email: testUserEmail,
        created_at: expect.any(String),
      },
    });
  });

  test("unauthorized if no token", async () => {
    const resp = await request(app).get(`/users/${testUserId}`);
    expect(resp.statusCode).toBe(401);
  });

  test("unauthorized when requesting non-existent user", async () => {
    const resp = await request(app)
      .get("/users/9999")
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(401);
  });

  test("unauthorized if wrong user token", async () => {
    // Create a token for a different user
    const wrongUserToken = createToken({
      id: 9999,
      email: "wrong@example.com",
    });
    const resp = await request(app)
      .get(`/users/${testUserId}`)
      .set("authorization", `Bearer ${wrongUserToken}`);
    expect(resp.statusCode).toBe(401);
  });
});

describe("PATCH /users/:userId", () => {
  test("updates user email", async () => {
    const resp = await request(app)
      .patch(`/users/${testUserId}`)
      .send({ email: "newuser@example.com" })
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.user.email).toBe("newuser@example.com");
  });

  test("unauthorized without token", async () => {
    const resp = await request(app)
      .patch(`/users/${testUserId}`)
      .send({ email: "another@example.com" });
    expect(resp.statusCode).toBe(401);
  });

  test("not found for non-existent user", async () => {
    const resp = await request(app)
      .patch("/users/9999")
      .send({ email: "another@example.com" })
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(401);
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app)
      .patch(`/users/${testUserId}`)
      .send({ email: "not-an-email" })
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(400);
  });
});

describe("DELETE /users/:userId", () => {
  test("deletes user", async () => {
    const resp = await request(app)
      .delete(`/users/${testUserId}`)
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ deleted: `${testUserId}` });

    // Verify user is actually deleted
    const checkResp = await request(app)
      .get(`/users/${testUserId}`)
      .set("authorization", `Bearer ${userToken}`);
    expect(checkResp.statusCode).toBe(404);
  });

  test("unauthorized without token", async () => {
    const resp = await request(app).delete(`/users/${testUserId}`);
    expect(resp.statusCode).toBe(401);
  });

  test("unauthorized if wrong user", async () => {
    // Create a token for a different user
    const wrongUserToken = createToken({
      id: 9999,
      email: "wrong@example.com",
    });
    const resp = await request(app)
      .delete(`/users/${testUserId}`)
      .set("authorization", `Bearer ${wrongUserToken}`);
    expect(resp.statusCode).toBe(401);
  });
});
