const db = require('../../database');

class CategoriesRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const query = `SELECT * FROM categories ORDER BY name ${direction}`;

    const results = await db.query(query);
    return results;
  }

  async create({ name }) {
    const query = `INSERT INTO categories(name)
		VALUES ($1)
		RETURNING *
		`;

    const values = [
      name,
    ];

    const result = await db.query(query, values);

    return result[0];
  }
}

module.exports = new CategoriesRepository();
