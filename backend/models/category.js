"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/**
 * Category Model
 *
 * This model provides methods for accessing and interacting with
 * category data from the `categories` table. Categories group
 * inflation-tracked items into broader types like "Food", "Housing", etc.
 *
 * Core Methods:
 * - findAll(): Returns all categories, ordered by name.
 * - get(id): Returns a single category by its ID.
 * - getWithItems(id): Returns a category and its associated tracked items,
 *   including each item's id, name, and series_id.
 *
 */

class Category {
  /** Find all categories, ordered by name */
  static async findAll() {
    const data = await db.query(`
      SELECT id, name, description
      FROM categories
      ORDER BY name`);

    if (data.rows.length === 0)
      throw new NotFoundError(`No data for categories`);

    return data.rows;
  }

  /** Get a single category by ID */
  static async get(id) {
    const data = await db.query(
      `SELECT id, name, description
       FROM categories
       WHERE id = $1`,
      [id]
    );

    const category = data.rows[0];
    if (!category) throw new NotFoundError(`No data for category ID: ${id}`);

    return category;
  }

  /** Get a category along with its associated tracked items */
  static async getWithItems(id) {
    const result = await db.query(
      `SELECT c.id AS category_id, c.name AS category_name, c.description, t.id AS item_id, t.name AS item_name, t.series_id
       FROM categories AS c
       LEFT JOIN tracked_items AS t ON c.id = t.category_id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`No data for category ID: ${id}`);
    }

    const { category_id, category_name, description } = result.rows[0];

    const items = result.rows
      .filter((r) => r.item_id !== null)
      .map((r) => ({
        id: r.item_id,
        name: r.item_name,
        series_id: r.series_id,
      }));

    return {
      id: category_id,
      name: category_name,
      description,
      items,
    };
  }
  
}

module.exports = Category;
