"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class InflationData {
  static async findByItemId(itemId) {
    const data = await db.query(
      `SELECT id, tracked_item_id, date, value
        FROM inflation_data WHERE tracked_item_id = $1 ORDER BY date`,
      [itemId]
    );

    
  }
}

module.exports = InflationData;
