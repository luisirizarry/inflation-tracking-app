"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/**
 * InflationData Model
 *
 * This model provides methods for retrieving inflation-related data
 * from the `inflation_data` table. Each record in the table represents
 * a CPI observation for a specific tracked item on a specific date.
 *
 * Core Methods:
 * - findByItemId(itemId): Returns all inflation observations for a tracked item.
 * - findByItemAndRange(itemId, startDate, endDate): Returns observations in a specific date range.
 * - getLatestForAll(): Returns the most recent observation for each tracked item.
 *
 * Data is ordered by date for consistent display and charting.
 */


class InflationData {
  static async findByItemId(itemId) {
    const data = await db.query(
      `SELECT id, tracked_item_id, date, value
        FROM inflation_data 
        WHERE tracked_item_id = $1 
        ORDER BY date`,
      [itemId]
    );

    if (data.rows.length === 0)
      throw new NotFoundError(`No data for itemID: ${itemId}`);

    return data.rows;
  }

  static async findByItemAndRange(itemId, startDate, endDate) {
    const data = await db.query(
      `SELECT id, tracked_item_id, date, value
          FROM inflation_data 
          WHERE tracked_item_id = $1 
          AND date BETWEEN $2 AND $3
          ORDER BY date`,
      [itemId, startDate, endDate]
    );
    if (data.rows.length === 0)
      throw new NotFoundError(`No data for itemID: ${itemId}`);

    return data.rows;
  }

  static async getLatestForAll() {
    const data = await db.query(
      `SELECT DISTINCT ON (tracked_item_id)
        id, tracked_item_id, date, value
        FROM inflation_data
        ORDER BY tracked_item_id, date DESC`
    );

    if (data.rows.length === 0)
      throw new NotFoundError("No inflation data found.");

    return data.rows;
  }
}

module.exports = InflationData;
