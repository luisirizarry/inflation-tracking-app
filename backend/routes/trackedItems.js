"use strict";
const express = require("express");
const TrackedItem = require("../models/trackedItem");

const router = new express.Router();

/**
 * Tracked Items Routes
 *
 * Provides API routes for retrieving tracked inflation items.
 * These routes are used to fetch metadata (name, category, series ID)
 * about items tracked in the application.
 *
 * Base path: /tracked-items
 *
 * Routes:
 *  - GET /             → Returns all tracked items
 *  - GET /:id          → Returns a single tracked item by ID
 */

// GET /tracked-items
router.get("/", async function (req, res, next) {
  try {
    const items = await TrackedItem.findAll();
    return res.json({ trackedItems: items });
  } catch (err) {
    return next(err);
  }
});

// GET /tracked-items/:id
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const item = await TrackedItem.get(id);
    return res.json({ trackedItem: item });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
