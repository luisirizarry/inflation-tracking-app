"use strict";

const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../expressError");

/**
 * Notifications Model
 *
 * This model manages user-specific notifications.
 * Notifications are tied to users and can be created, retrieved, marked as read, or deleted.
 *
 * Core Methods:
 * - create(userId, message): Add a new notification for a user.
 * - findAllForUser(userId): Return all notifications for a specific user.
 * - markAsRead(notificationId, currentUserId): Mark a notification as read after verifying user ownership.
 * - delete(notificationId, currentUserId): Delete a notification after verifying user ownership.
 */

class Notifications {
  /** Create a new notification for a user.
   *
   * Returns { id, user_id, message, is_read, created_at }
   */
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

  /** Get all notifications for a specific user.
   *
   * Returns array of { id, user_id, message, is_read, created_at }
   * Throws NotFoundError if user has no notifications.
   */
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

  /** Mark a notification as read, only if it belongs to the user.
   *
   * Returns updated notification object.
   * Throws NotFoundError if not found, or UnauthorizedError if user is not the owner.
   */
  static async markAsRead(notificationId, currentUserId) {
    const checkRes = await db.query(
      `SELECT id, user_id FROM notifications WHERE id = $1`,
      [notificationId]
    );
    const notification = checkRes.rows[0];

    if (!notification)
      throw new NotFoundError(`No notification with ID: ${notificationId}`);

    if (notification.user_id !== +currentUserId)
      throw new UnauthorizedError("Not authorized to modify this notification.");

    const result = await db.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING id, user_id, message, is_read, created_at`,
      [notificationId]
    );

    return result.rows[0];
  }

  /** Delete a notification, only if it belongs to the user.
   *
   * Returns { deleted: notificationId }
   * Throws NotFoundError or UnauthorizedError as appropriate.
   */
  static async delete(notificationId, currentUserId) {
    const checkRes = await db.query(
      `SELECT id, user_id FROM notifications WHERE id = $1`,
      [notificationId]
    );
    const notification = checkRes.rows[0];

    if (!notification)
      throw new NotFoundError(`No notification with ID: ${notificationId}`);

    if (notification.user_id !== +currentUserId)
      throw new UnauthorizedError("Not authorized to delete this notification.");

    await db.query(`DELETE FROM notifications WHERE id = $1`, [notificationId]);

    return { deleted: notificationId };
  }
}

module.exports = Notifications;
