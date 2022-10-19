const db = require('../../database');

class ContactsRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const query = `SELECT contacts.*, categories.name AS category_name
		FROM contacts
		LEFT JOIN categories
		ON categories.id = contacts.category_id
		ORDER BY name ${direction}`;

    const results = await db.query(query);

    return results;
  }

  async findById(id) {
    const query = `SELECT contacts.*, categories.name AS category_name
		FROM contacts
		LEFT JOIN categories
		ON categories.id = contacts.category_id
		WHERE contacts.id = $1`;

    const result = await db.query(query, [id]);

    return result[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM contacts WHERE email = $1';

    const result = await db.query(query, [email]);

    return result[0];
  }

  async create({
    name, email, phone, category_id,
  }) {
    const query = `
			INSERT INTO contacts(name, email, phone, category_id)
			VALUES($1, $2, $3, $4)
			RETURNING *
		`;

    const values = [
      name,
      email,
      phone,
      category_id,
    ];

    const result = await db.query(query, values);

    return result[0];
  }

  async update(id, {
    name, email, phone, category_id,
  }) {
    const query = `UPDATE contacts
			SET name = $1,
			email = $2,
			phone = $3,
			category_id = $4
			WHERE id = $5
			RETURNING *
		`;

    const values = [
      name,
      email,
      phone,
      category_id,
      id,
    ];

    const result = await db.query(query, values);

    return result[0];
  }

  async delete(id) {
    const result = db.query('DELETE FROM contacts WHERE id = $1', [id]);

    return result;
  }
}

module.exports = new ContactsRepository();
