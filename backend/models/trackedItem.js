"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/**
 * The TrackedItem class provides methods to interact with the tracked_items table in the database.
 * It includes functionality to retrieve all tracked items or a specific tracked item by its ID.
 */
class TrackedItem {
  static async findAll() {
    const allItems = await db.query(
      `SELECT id,
                    category_id,
                    name,
                    series_id,
                    created_at
             FROM tracked_items
             ORDER BY name`
    );

    return allItems.rows;
  }

  static async get(id) {
    const itemRes = await db.query(
      `SELECT id,
                    category_id,
                    name,
                    series_id,
                    created_at
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
