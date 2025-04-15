"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Notifications {
  static async create(userId, message) {
    const result = await db.query(
      `
          INSERT INTO notifications (user_id, message, is_read)
          VALUES ($1, $2, false)
          RETURNING id, user_id, message, is_read, created_at
          `,
      [userId, message]
    );

    return result.rows[0];
  }

  static async findAllForUser(userId) {
    const result = await db.query(
      `
        SELECT id, user_id, message, is_read, created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

    if (result.rows.length === 0)
      throw new NotFoundError(`No notifications for user ID: ${userId}`);

    return result.rows;
  }

  static async markAsRead(notificationId) {
    const result = await db.query(
      `
        UPDATE notifications
        SET is_read = true
        WHERE id = $1
        RETURNING id, user_id, message, is_read, created_at
      `,
      [notificationId]
    );

    const notification = result.rows[0];
    if (!notification)
      throw new NotFoundError(`No notification with ID: ${notificationId}`);

    return notification;
  }

  static async delete(notificationId) {
    const result = await db.query(
      `
        DELETE FROM notifications
        WHERE id = $1
        RETURNING id, user_id, message, is_read, created_at`,
      [notificationId]
    );

    const notification = result.rows[0];
    if (!notification)
      throw new NotFoundError(`No notification with ID: ${notificationId}`);

    return { deleted: notificationId };
  }
}
