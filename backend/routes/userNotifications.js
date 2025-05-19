"use strict";

const express = require("express");
const Notification = require("../models/notifications");
const { ensureCorrectUser } = require("../middleware/auth");

const router = new express.Router();

/** GET /notifications/:userId
 *
 * Get all notifications for a given user.
 * Authorization: must be the correct user.
 *
 * Returns: { notifications: [ { id, user_id, message, is_read, created_at }, ... ] }
 */
router.get("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAllForUser(userId);
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
});

/** POST /notifications
 *
 * Create a new notification.
 * Expects: { userId, message }
 * Authorization: none (used internally or from a system event).
 *
 * Returns: { notification: { id, user_id, message, is_read, created_at } }
 */
router.post("/", async function (req, res, next) {
  try {
    const { userId, message } = req.body;
    const notification = await Notification.create(userId, message);
    return res.status(201).json({ notification });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /notifications/:id/read
 *
 * Mark a specific notification as read.
 * Authorization: must be the notification owner.
 *
 * Returns: { notification: { ...updated notification... } }
 */
router.patch("/:id/read", async function (req, res, next) {
  try {
    const { id } = req.params;
    const userId = res.locals.user.id;
    const notification = await Notification.markAsRead(id, userId);
    return res.json({ notification });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /notifications/:id
 *
 * Delete a notification.
 * Authorization: must be the notification owner.
 *
 * Returns: { deleted: id }
 */
router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const userId = res.locals.user.id;
    const result = await Notification.delete(id, userId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
