"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/**
 * TrackedItem Model
 *
 * This model handles queries related to the `tracked_items` table,
 * which stores metadata for each item being monitored for inflation.
 * Each tracked item includes a name, FRED series ID, and category association.
 *
 * Core Methods:
 * - findAll(): Returns all tracked items, ordered alphabetically by name.
 * - get(id): Returns a single tracked item by its primary ID.
 *
 * Used to power category filtering, API requests to FRED, and user-facing selection components.
 */

class TrackedItem {
  static async findAll() {
    const allItems = await db.query(
      `SELECT id, category_id, name, series_id, created_at
        FROM tracked_items
        ORDER BY name`
    );

    return allItems.rows;
  }

  static async get(id) {
    if (isNaN(parseInt(id))) {
      throw new BadRequestError("Item ID must be a number");
    }

    const itemRes = await db.query(
      `SELECT id,category_id,name,series_id,created_at
        FROM tracked_items
        WHERE id = $1`,
      [id]
    );

    const item = itemRes.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);

    return item;
  }
}

module.exports = TrackedItem;
