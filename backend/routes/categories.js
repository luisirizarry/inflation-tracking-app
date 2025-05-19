"use strict";
const express = require("express");
const Category = require("../models/category");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/**
 * Category Routes
 *
 * This file defines API endpoints for interacting with the `categories` resource.
 * Categories group tracked inflation items into logical sets like "Food", "Housing", etc.
 *
 * Routes:
 *   GET /categories
 *     → Returns a list of all category records.
 *     → Response: { categories: [{ id, name, description }, ...] }
 *
 *   GET /categories/:id
 *     → Returns a single category by its ID.
 *     → Response: { category: { id, name, description } }
 *
 *   GET /categories/:id/items
 *     → Returns a category and all of its tracked items.
 *     → Response:
 *         {
 *           categoryWithItems: {
 *             id,
 *             name,
 *             description,
 *             items: [{ id, name, series_id }, ...]
 *           }
 *         }
 *
 * Notes:
 * - Throws NotFoundError if category ID is invalid or has no associated data.
 * - This route layer only handles GET requests; no modification routes exist for categories yet.
 */

/** GET /categories → list all categories */
router.get("/", async function (req, res, next) {
  try {
    const allCategories = await Category.findAll();
    return res.json({ categories: allCategories });
  } catch (err) {
    return next(err);
  }
});

/** GET /categories/:id → get a single category by ID */
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const categoryData = await Category.get(id);
    return res.json({ category: categoryData });
  } catch (err) {
    return next(err);
  }
});

/** GET /categories/:id/items → get a category and its tracked items */
router.get("/:id/items", async function (req, res, next) {
  try {
    const { id } = req.params;
    const categoryData = await Category.getWithItems(id);
    return res.json({ categoryWithItems: categoryData });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
