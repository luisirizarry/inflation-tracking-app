"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

/**
 * UserPreferences Model
 *
 * This model manages user-specific preferences related to tracked inflation items.
 * Each user can choose to follow specific tracked items and toggle notifications on/off.
 *
 * Table: user_preferences
 * - user_id: foreign key to users
 * - tracked_item_id: foreign key to tracked_items
 * - notify: boolean flag for notification preference
 *
 * Core Methods:
 * - add(userId, trackedItemId, notify): Adds a new preference entry for a user.
 * - remove(userId, trackedItemId): Removes a user’s preference for a specific item.
 * - get(userId, trackedItemId): Fetches a single preference row.
 * - findAll(userId): Returns all preferences for a user.
 * - updateNotify(userId, trackedItemId, notify): Updates the `notify` flag for a given preference.
 */
class UserPreferences {
  /** Add a new preference. Throws BadRequestError on duplicate. */
  static async add(userId, trackedItemId, notify = true) {
    let result;
    try {
      result = await db.query(
        `
          INSERT INTO user_preferences (user_id, tracked_item_id, notify)
          VALUES ($1, $2, $3)
          RETURNING user_id, tracked_item_id, notify
        `,
        [userId, trackedItemId, notify]
      );
    } catch (err) {
      // 23505(duplicate entry)
      if (err.code === "23505") {
        throw new BadRequestError(
          `Preference for user ${userId} and item ${trackedItemId} already exists.`
        );
      }
      throw err;
    }

    if (!result.rows[0]) {
      throw new BadRequestError("Preference not added");
    }

    return result.rows[0];
  }

  /** Remove an existing preference. */
  static async remove(userId, trackedItemId) {
    const result = await db.query(
      `
        DELETE FROM user_preferences
        WHERE user_id = $1 AND tracked_item_id = $2
        RETURNING user_id, tracked_item_id, notify
      `,
      [userId, trackedItemId]
    );

    const deleted = result.rows[0];
    if (!deleted) {
      throw new NotFoundError(
        `No preference found for user ${userId} and item ${trackedItemId}`
      );
    }

    return { deleted: { userId, trackedItemId } };
  }

  /** Get a single preference. */
  static async get(userId, trackedItemId) {
    const result = await db.query(
      `
        SELECT user_id, tracked_item_id, notify
        FROM user_preferences
        WHERE user_id = $1 AND tracked_item_id = $2
      `,
      [userId, trackedItemId]
    );

    const pref = result.rows[0];
    if (!pref) {
      throw new NotFoundError(
        `No preference found for user ${userId} and item ${trackedItemId}`
      );
    }

    return pref;
  }

  /** List all preferences for a user. */
  static async findAll(userId) {
    const result = await db.query(
      `
        SELECT user_id, tracked_item_id, notify
        FROM user_preferences
        WHERE user_id = $1
      `,
      [userId]
    );
    return result.rows;
  }

  /** Update the notify flag on an existing preference. */
  static async updateNotify(userId, trackedItemId, notify) {
    const result = await db.query(
      `
        UPDATE user_preferences
        SET notify = $1
        WHERE user_id = $2 AND tracked_item_id = $3
        RETURNING user_id, tracked_item_id, notify
      `,
      [notify, userId, trackedItemId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(
        `No preference found for user ${userId} and item ${trackedItemId}`
      );
    }

    return result.rows[0];
  }
}

module.exports = UserPreferences;
