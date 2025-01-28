import pool from '../config/db.js';

class File {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM files');
    return rows;
  }

  static async getByName(filename) {
    const [rows] = await pool.query(
      'SELECT * FROM files WHERE filename = ?',
      [filename]
    );
    return rows[0];
  }

  static async create(filename, content, iconUrl) {
    await pool.query(
      'INSERT INTO files (filename, content, icon_url) VALUES (?, ?, ?)',
      [filename, content, iconUrl]
    );
  }

  static async update(filename, content) {
    await pool.query('UPDATE files SET content = ? WHERE filename = ?', [
      content,
      filename
    ]);
  }

  static async delete(filename) {
    await pool.query('DELETE FROM files WHERE filename = ?', [filename]);
  }
}

export default File;
