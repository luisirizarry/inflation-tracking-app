"use strict";

const db = require("../db");
const Notifications = require("./notifications");
const { NotFoundError, UnauthorizedError } = require("../expressError");

let user1, user2;
let notif1, notif2;

beforeAll(async () => {
  // Clear users & notifications tables, then seed two users
  await db.query("DELETE FROM notifications");
  await db.query("DELETE FROM users");
  const uRes = await db.query(`
    INSERT INTO users (email, password_hash)
    VALUES ('u1@example.com','hash1'), ('u2@example.com','hash2')
    RETURNING id
  `);
  [user1, user2] = uRes.rows.map((r) => r.id);
});

beforeEach(async () => {
  // Clear notifications and seed one for each user
  await db.query("DELETE FROM notifications");
  notif1 = await Notifications.create(user1, "Message for user1");
  notif2 = await Notifications.create(user2, "Message for user2");
});

afterAll(async () => {
  await db.end();
});

describe("Notifications.create", () => {
  test("creates a new notification", async () => {
    const n = await Notifications.create(user1, "New msg");
    expect(n).toEqual({
      id: expect.any(Number),
      user_id: user1,
      message: "New msg",
      is_read: false,
      created_at: expect.any(Date),
    });
  });
});

describe("Notifications.findAllForUser", () => {
  test("returns notifications for a given user, ordered desc", async () => {
    const list = await Notifications.findAllForUser(user1);
    expect(list).toHaveLength(1);
    expect(list[0]).toEqual({
      id: notif1.id,
      user_id: user1,
      message: "Message for user1",
      is_read: false,
      created_at: expect.any(Date),
    });
  });

  test("throws NotFoundError if user has none", async () => {
    await db.query("DELETE FROM notifications WHERE user_id=$1", [user2]);
    try {
      await Notifications.findAllForUser(user2);
      throw new Error("fail test");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Notifications.markAsRead", () => {
  test("marks a notification as read when user owns it", async () => {
    const updated = await Notifications.markAsRead(notif1.id, user1);
    expect(updated).toEqual({
      id: notif1.id,
      user_id: user1,
      message: "Message for user1",
      is_read: true,
      created_at: expect.any(Date),
    });
  });

  test("throws NotFoundError for nonexistent id", async () => {
    try {
      await Notifications.markAsRead(9999, user1);
      throw new Error("fail test");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("throws UnauthorizedError if wrong user attempts update", async () => {
    try {
      await Notifications.markAsRead(notif1.id, user2);
      throw new Error("fail test");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe("Notifications.delete", () => {
  test("deletes a notification when user owns it", async () => {
    const res = await Notifications.delete(notif1.id, user1);
    expect(res).toEqual({ deleted: notif1.id });

    // confirm gone from DB:
    const { rows } = await db.query(
      "SELECT id FROM notifications WHERE id=$1",
      [notif1.id]
    );
    expect(rows).toHaveLength(0);
  });

  test("throws NotFoundError for nonexistent id", async () => {
    try {
      await Notifications.delete(9999, user1);
      throw new Error("fail test");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("throws UnauthorizedError if wrong user attempts delete", async () => {
    try {
      await Notifications.delete(notif1.id, user2);
      throw new Error("fail test");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});
