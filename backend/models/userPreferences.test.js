"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const UserPreferences = require("./userPreferences");
const { NotFoundError, BadRequestError } = require("../expressError");

let userId, item1Id, item2Id;

beforeAll(async function () {
  // 1) Clean out everything in dependency order
  await db.query("DELETE FROM user_preferences");
  await db.query("DELETE FROM notifications");
  await db.query("DELETE FROM inflation_data");
  await db.query("DELETE FROM tracked_items");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");

  // 2) Seed a test user
  const hashedPw = await bcrypt.hash("password1", BCRYPT_WORK_FACTOR);
  const userRes = await db.query(
    `INSERT INTO users (email, password_hash)
     VALUES ('pref-test@example.com', $1)
     RETURNING id`,
    [hashedPw]
  );
  userId = userRes.rows[0].id;

  // 3) Seed a category
  const catRes = await db.query(
    `INSERT INTO categories (name)
     VALUES ('TestCat')
     RETURNING id`
  );
  const categoryId = catRes.rows[0].id;

  // 4) Seed two tracked items
  const itemRes = await db.query(
    `INSERT INTO tracked_items (category_id, name, series_id)
     VALUES 
       ($1, 'ItemOne', 'SERIES1'),
       ($1, 'ItemTwo', 'SERIES2')
     RETURNING id`,
    [categoryId]
  );
  item1Id = itemRes.rows[0].id;
  item2Id = itemRes.rows[1].id;
});

beforeEach(async () => {
  await db.query("BEGIN");
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

afterAll(async () => {
  await db.end();
});

describe("UserPreferences.add", () => {
  test("adds a preference with default notify=true", async () => {
    const pref = await UserPreferences.add(userId, item1Id);
    expect(pref).toEqual({
      user_id: userId,
      tracked_item_id: item1Id,
      notify: true,
    });
  });

  test("allows setting notify=false", async () => {
    const pref = await UserPreferences.add(userId, item2Id, false);
    expect(pref.notify).toBe(false);
  });

  test("throws BadRequestError on duplicate", async () => {
    await UserPreferences.add(userId, item1Id);
    await expect(UserPreferences.add(userId, item1Id)).rejects.toThrow(
      BadRequestError
    );
  });
});

describe("UserPreferences.get", () => {
  test("retrieves an existing preference", async () => {
    await UserPreferences.add(userId, item1Id, false);
    const got = await UserPreferences.get(userId, item1Id);
    expect(got).toEqual({
      user_id: userId,
      tracked_item_id: item1Id,
      notify: false,
    });
  });

  test("throws NotFoundError for missing", async () => {
    await expect(UserPreferences.get(userId, 9999)).rejects.toThrow(
      NotFoundError
    );
  });
});

describe("UserPreferences.findAll", () => {
  test("lists all preferences for a user", async () => {
    await UserPreferences.add(userId, item1Id, true);
    await UserPreferences.add(userId, item2Id, false);
    const all = await UserPreferences.findAll(userId);
    expect(all).toHaveLength(2);
    expect(all).toEqual(
      expect.arrayContaining([
        { user_id: userId, tracked_item_id: item1Id, notify: true },
        { user_id: userId, tracked_item_id: item2Id, notify: false },
      ])
    );
  });

  test("returns empty array when none exist", async () => {
    const all = await UserPreferences.findAll(9999);
    expect(all).toEqual([]);
  });
});

describe("UserPreferences.updateNotify", () => {
  test("toggles the notify flag", async () => {
    await UserPreferences.add(userId, item1Id, true);
    const updated = await UserPreferences.updateNotify(userId, item1Id, false);
    expect(updated).toEqual({
      user_id: userId,
      tracked_item_id: item1Id,
      notify: false,
    });
  });

  test("throws NotFoundError if no such preference", async () => {
    await expect(
      UserPreferences.updateNotify(userId, 9999, true)
    ).rejects.toThrow(NotFoundError);
  });
});

describe("UserPreferences.remove", () => {
  test("removes an existing preference", async () => {
    await UserPreferences.add(userId, item2Id);
    const res = await UserPreferences.remove(userId, item2Id);
    expect(res).toEqual({ deleted: { userId, trackedItemId: item2Id } });

    const { rows } = await db.query(
      `SELECT * FROM user_preferences
       WHERE user_id=$1 AND tracked_item_id=$2`,
      [userId, item2Id]
    );
    expect(rows).toHaveLength(0);
  });

  test("throws NotFoundError if none to remove", async () => {
    await expect(UserPreferences.remove(userId, 12345)).rejects.toThrow(
      NotFoundError
    );
  });
});
