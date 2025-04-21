"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTestUserId,
  getUserToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let testUserId;
let userToken;
let testItemId;
let testPreference;

beforeEach(async () => {
  testUserId = getTestUserId();
  userToken = getUserToken();
  
  // Get a test tracked item ID
  const itemResult = await db.query(`SELECT id FROM tracked_items LIMIT 1`);
  testItemId = itemResult.rows[0].id;
  
  // Clear any existing preferences for this user
  await db.query(
    `DELETE FROM user_preferences WHERE user_id = $1`,
    [testUserId]
  );
  
  // Create a test preference
  const prefResult = await db.query(
    `INSERT INTO user_preferences (user_id, tracked_item_id, notify)
     VALUES ($1, $2, true)
     RETURNING user_id, tracked_item_id, notify`,
    [testUserId, testItemId]
  );
  testPreference = prefResult.rows[0];
});

describe("GET /:userId/preferences", () => {
  test("gets all preferences for authorized user", async () => {
    const resp = await request(app)
      .get(`/preferences/${testUserId}/preferences`)
      .set("authorization", `Bearer ${userToken}`);
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("preferences");
    expect(Array.isArray(resp.body.preferences)).toBe(true);
    expect(resp.body.preferences.length).toBeGreaterThan(0);
    
    // Verify our test preference is included
    const foundPref = resp.body.preferences.find(p => 
      p.user_id === testUserId && 
      p.tracked_item_id === testItemId
    );
    expect(foundPref).toBeDefined();
    expect(foundPref.notify).toBe(true);
  });
  
  test("returns 401 if unauthorized", async () => {
    const resp = await request(app)
      .get(`/preferences/${testUserId}/preferences`);
    
    expect(resp.statusCode).toBe(401);
  });
  
  test("returns 401 for wrong user", async () => {
    // Create a different user
    const otherUserResult = await db.query(
      `INSERT INTO users (email, password_hash)
       VALUES ('wronguser@example.com', 'hash')
       RETURNING id`
    );
    const otherUserId = otherUserResult.rows[0].id;
    
    const resp = await request(app)
      .get(`/preferences/${otherUserId}/preferences`)
      .set("authorization", `Bearer ${userToken}`);
    
    expect(resp.statusCode).toBe(401);
  });
});

describe("POST /:userId/preferences", () => {
  test("adds a new preference for authorized user", async () => {
    // First delete our test preference
    await db.query(
      `DELETE FROM user_preferences 
       WHERE user_id = $1 AND tracked_item_id = $2`,
      [testUserId, testItemId]
    );
    
    const resp = await request(app)
      .post(`/preferences/${testUserId}/preferences`)
      .set("authorization", `Bearer ${userToken}`)
      .send({
        trackedItemId: testItemId,
        notify: false
      });
    
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty("preference");
    expect(resp.body.preference.user_id).toBe(testUserId);
    expect(resp.body.preference.tracked_item_id).toBe(testItemId);
    expect(resp.body.preference.notify).toBe(false);
  });
  
  test("returns 400 for missing trackedItemId", async () => {
    const resp = await request(app)
      .post(`/preferences/${testUserId}/preferences`)
      .set("authorization", `Bearer ${userToken}`)
      .send({ notify: true });
    
    expect(resp.statusCode).toBe(400);
  });
  
  test("returns 400 for duplicate preference", async () => {
    // Our test preference already exists, so this should fail
    const resp = await request(app)
      .post(`/preferences/${testUserId}/preferences`)
      .set("authorization", `Bearer ${userToken}`)
      .send({
        trackedItemId: testItemId,
        notify: true
      });
    
    expect(resp.statusCode).toBe(400);
  });
  
  test("returns 401 if unauthorized", async () => {
    const resp = await request(app)
      .post(`/preferences/${testUserId}/preferences`)
      .send({
        trackedItemId: testItemId,
        notify: true
      });
    
    expect(resp.statusCode).toBe(401);
  });
});

describe("PATCH /:userId/preferences/:itemId", () => {
  test("updates notify setting for authorized user", async () => {
    const resp = await request(app)
      .patch(`/preferences/${testUserId}/preferences/${testItemId}`)
      .set("authorization", `Bearer ${userToken}`)
      .send({ notify: false });
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("preference");
    expect(resp.body.preference.user_id).toBe(testUserId);
    expect(resp.body.preference.tracked_item_id).toBe(testItemId);
    expect(resp.body.preference.notify).toBe(false);
  });
  
  test("returns 404 for non-existent preference", async () => {
    // Get another item ID that the user doesn't have a preference for
    const otherItemResult = await db.query(
      `SELECT id FROM tracked_items 
       WHERE id != $1 
       LIMIT 1`,
      [testItemId]
    );
    
    let otherItemId;
    if (otherItemResult.rows.length > 0) {
      otherItemId = otherItemResult.rows[0].id;
    } else {
      // If there's no other item, use a non-existent ID
      otherItemId = 9999;
    }
    
    const resp = await request(app)
      .patch(`/preferences/${testUserId}/preferences/${otherItemId}`)
      .set("authorization", `Bearer ${userToken}`)
      .send({ notify: false });
    
    expect(resp.statusCode).toBe(404);
  });
  
  test("returns 401 if unauthorized", async () => {
    const resp = await request(app)
      .patch(`/preferences/${testUserId}/preferences/${testItemId}`)
      .send({ notify: false });
    
    expect(resp.statusCode).toBe(401);
  });
});

describe("DELETE /:userId/preferences/:itemId", () => {
  test("deletes preference for authorized user", async () => {
    const resp = await request(app)
      .delete(`/preferences/${testUserId}/preferences/${testItemId}`)
      .set("authorization", `Bearer ${userToken}`);
    
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty("deleted");
    expect(resp.body.deleted).toHaveProperty("userId");
    expect(resp.body.deleted).toHaveProperty("trackedItemId");
    expect(Number(resp.body.deleted.userId)).toBe(testUserId);
    expect(Number(resp.body.deleted.trackedItemId)).toBe(testItemId);
    
    // Verify it's actually deleted
    const checkResult = await db.query(
      `SELECT * FROM user_preferences
       WHERE user_id = $1 AND tracked_item_id = $2`,
      [testUserId, testItemId]
    );
    expect(checkResult.rows.length).toBe(0);
  });
  
  test("returns 404 for non-existent preference", async () => {
    // Delete our test preference first
    await db.query(
      `DELETE FROM user_preferences 
       WHERE user_id = $1 AND tracked_item_id = $2`,
      [testUserId, testItemId]
    );
    
    const resp = await request(app)
      .delete(`/preferences/${testUserId}/preferences/${testItemId}`)
      .set("authorization", `Bearer ${userToken}`);
    
    expect(resp.statusCode).toBe(404);
  });
  
  test("returns 401 if unauthorized", async () => {
    const resp = await request(app)
      .delete(`/preferences/${testUserId}/preferences/${testItemId}`);
    
    expect(resp.statusCode).toBe(401);
  });
});