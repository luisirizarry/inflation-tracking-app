"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const userRegisterSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { ensureCorrectUser } = require("../middleware/auth");

const router = express.Router();

/** POST /register  => { user }
 *
 * Registers a new user.
 * Expects { email, password }
 * Returns: { id, email, created_at }
 */
router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register(req.body);
    return res.status(201).json({ user: newUser });
  } catch (err) {
    return next(err);
  }
});

/** POST /login => { user }
 *
 * Logs in an existing user.
 * Expects { email, password }
 * Returns { id, email }
 */
router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestError("Email and password required");

    const user = await User.authenticate(email, password);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /users/:userId => { user }
 *
 * Returns { id, email, created_at }
 * Authorization: must be the correct user
 */
router.get("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /users/:userId => { updated user } */
router.patch("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.userId, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /users/:userId => { deleted: userId } */
router.delete("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.userId);
    return res.json({ deleted: req.params.userId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
