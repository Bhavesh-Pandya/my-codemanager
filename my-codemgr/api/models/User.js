import pool from '../config/db.js';

class User {
  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [
      username
    ]);
    return rows[0];
  }
}

export default User;
