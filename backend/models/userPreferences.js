"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
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
  static async add(userId, trackedItemId, notify = true) {
    const result = await db.query(
      `
            INSERT INTO user_preferences (user_id, tracked_item_id, notify)
            VALUES ($1, $2, $3)
            RETURNING user_id, tracked_item_id, notify
          `,
      [userId, trackedItemId, notify]
    );

    if (!result.rows[0]) {
      throw new BadRequestError("Preference not added");
    }

    return result.rows[0];
  }

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

  static async get(userId, trackedItemId) {
    const result = await db.query(
      `
        SELECT user_id, tracked_item_id, notify
        FROM user_preferences
        WHERE user_id = $1 AND tracked_item_id = $2`,
      [userId, trackedItemId]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(
        `No preference found for user ${userId} and item ${trackedItemId}`
      );
    }

    return result.rows[0];
  }

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
