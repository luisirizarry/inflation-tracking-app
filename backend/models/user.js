"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /** Authenticate user by email and password.
   *
   * Returns { id, email }
   * Throws UnauthorizedError if email not found or password is wrong.
   */
  static async authenticate(email, password) {
    const result = await db.query(
      `SELECT id, email, password_hash
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (isValid) {
        return { id: user.id, email: user.email };
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register a new user with email and password.
   *
   * Returns { id, email }
   * Throws BadRequestError if email is already in use.
   */
  static async register({ email, password }) {
    const duplicateCheck = await db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, hashedPassword]
    );

    return result.rows[0];
  }

  /** Find user by ID.
   *
   * Returns { id, email, created_at }
   * Throws NotFoundError if no such user.
   */
  static async get(id) {
    const result = await db.query(
      `SELECT id, email, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user with ID: ${id}`);
    return user;
  }

  /** Find all users.
   *
   * Returns [{ id, email, created_at }, ...]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT id, email, created_at
       FROM users
       ORDER BY id`
    );
    return result.rows;
  }

  /** Update user data.
   *
   * Returns { id, email }
   * Throws NotFoundError if no such user.
   */
  static async update(id, data) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError("No data to update");
    }

    // If we're allowing password updates, we would hash it here
    // But this example only handles email updates
    
    const result = await db.query(
      `UPDATE users
       SET email = $1
       WHERE id = $2
       RETURNING id, email`,
      [data.email, id]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user with ID: ${id}`);
    
    return user;
  }

  /** Remove a user by ID. */
  static async remove(id) {
    const result = await db.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (!result.rows[0]) throw new NotFoundError(`No user with ID: ${id}`);
  }
}

module.exports = User;
