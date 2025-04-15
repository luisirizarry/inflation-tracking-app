"use strict";

const express = require("express");
const UserPreferences = require("../models/userPreferences");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** GET /:userId/preferences
 *  Returns all preferences for a user.
 *  Authorization: user must be the same as :userId
 */
router.get("/:userId/preferences", ensureCorrectUser, async function (req, res, next) {
  try {
    const preferences = await UserPreferences.findAll(req.params.userId);
    return res.json({ preferences });
  } catch (err) {
    return next(err);
  }
});

/** POST /:userId/preferences
 *  Adds a tracked item to user preferences.
 *  Requires { trackedItemId, notify }
 *  Authorization: user must be the same as :userId
 */
router.post("/:userId/preferences", ensureCorrectUser, async function (req, res, next) {
  try {
    const { trackedItemId, notify } = req.body;
    if (!trackedItemId) throw new BadRequestError("trackedItemId is required");

    const preference = await UserPreferences.add(
      req.params.userId,
      trackedItemId,
      notify
    );
    return res.status(201).json({ preference });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /:userId/preferences/:itemId
 *  Updates the notify setting for a preference.
 *  Requires { notify }
 *  Authorization: user must be the same as :userId
 */
router.patch("/:userId/preferences/:itemId", ensureCorrectUser, async function (req, res, next) {
  try {
    const { notify } = req.body;
    const updated = await UserPreferences.updateNotify(
      req.params.userId,
      req.params.itemId,
      notify
    );
    return res.json({ preference: updated });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:userId/preferences/:itemId
 *  Removes a tracked item from user preferences.
 *  Authorization: user must be the same as :userId
 */
router.delete("/:userId/preferences/:itemId", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = await UserPreferences.remove(
      req.params.userId,
      req.params.itemId
    );
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
