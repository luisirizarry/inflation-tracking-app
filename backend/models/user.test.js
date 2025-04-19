"use strict";

const db = require("../db");
const User = require("./user");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testUser;

beforeAll(async () => {
  // Clear users table and seed one test user
  await db.query("DELETE FROM users");
  const hashedPw = await bcrypt.hash("password1", BCRYPT_WORK_FACTOR);
  const res = await db.query(
    `INSERT INTO users (email, password_hash)
     VALUES ('test@example.com', $1)
     RETURNING id, email`,
    [hashedPw]
  );
  testUser = res.rows[0];
});

beforeEach(async () => {
    await db.query("BEGIN");
});

afterAll(async () => {
  await db.end();
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

describe("User.authenticate", () => {
  test("works with correct credentials", async () => {
    const user = await User.authenticate("test@example.com", "password1");
    expect(user).toEqual({ id: testUser.id, email: "test@example.com" });
  });

  test("throws UnauthorizedError for wrong email", async () => {
    await expect(
      User.authenticate("nope@example.com", "password1")
    ).rejects.toThrow(UnauthorizedError);
  });

  test("throws UnauthorizedError for wrong password", async () => {
    await expect(
      User.authenticate("test@example.com", "wrong")
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe("User.register", () => {
  test("registers a new user", async () => {
    const newUser = await User.register({
      email: "new@example.com",
      password: "newpassword",
    });
    expect(newUser).toEqual({
      id: expect.any(Number),
      email: "new@example.com",
    });

    // confirm in DB
    const check = await db.query(
      "SELECT email FROM users WHERE id = $1",
      [newUser.id]
    );
    expect(check.rows[0].email).toBe("new@example.com");
  });

  test("throws BadRequestError on duplicate email", async () => {
    await expect(
      User.register({ email: "test@example.com", password: "password1" })
    ).rejects.toThrow(BadRequestError);
  });
});

describe("User.get", () => {
  test("retrieves a user by id", async () => {
    const user = await User.get(testUser.id);
    expect(user).toEqual({
      id: testUser.id,
      email: "test@example.com",
      created_at: expect.any(Date),
    });
  });

  test("throws NotFoundError for invalid id", async () => {
    await expect(User.get(0)).rejects.toThrow(NotFoundError);
  });
});

describe("User.findAll", () => {
  test("returns list of users", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: testUser.id,
        email: "test@example.com",
        created_at: expect.any(Date),
      },
    ]);
  });
});

describe("User.remove", () => {
  test("removes a user", async () => {
    await User.remove(testUser.id);
    const check = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [testUser.id]
    );
    expect(check.rows).toHaveLength(0);
  });

  test("throws NotFoundError for invalid id", async () => {
    await expect(User.remove(0)).rejects.toThrow(NotFoundError);
  });
});
