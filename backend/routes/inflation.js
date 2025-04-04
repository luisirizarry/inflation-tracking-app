"use strict";
const express = require("express");
const InflationData = require("../models/inflationData");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/**
 * Inflation Data Routes
 *
 * Provides API routes to access historical and current inflation data
 * pulled from the FRED API and stored in the local database.
 *
 * Base path: /inflation
 *
 * Routes:
 *  - GET /latest                     → Returns latest data point per tracked item
 *  - GET /:itemId/range?start=...   → Returns data between two dates
 *  - GET /:itemId                   → Returns all data for a specific tracked item
 *
 * All routes are public and used to power data visualizations on the frontend.
 */

/** GET /inflation/latest → Latest data per tracked item */
router.get("/latest", async function (req, res, next) {
  try {
    const latestData = await InflationData.getLatestForAll();
    return res.json({ data: latestData });
  } catch (err) {
    return next(err);
  }
});

/** GET /inflation/:itemId/range?start=...&end=... */
router.get("/:itemId/range", async function (req, res, next) {
  try {
    const { itemId } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      throw new BadRequestError("Start and end query parameters are required.");
    }

    const itemRangedData = await InflationData.findByItemAndRange(
      itemId,
      start,
      end
    );
    return res.json({ data: itemRangedData });
  } catch (err) {
    return next(err);
  }
});

/** GET /inflation/:itemId → All inflation data for a tracked item */
router.get("/:itemId", async function (req, res, next) {
  try {
    const { itemId } = req.params;
    const itemData = await InflationData.findByItemId(itemId);
    return res.json({ data: itemData });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
