const contactsRepository = require('../repositories/ContactsRepository');

const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await contactsRepository.findAll(orderBy);

    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid Contact id' });
    }

    const contact = await contactsRepository.findById(id);

    if (!contact) {
      response.statusCode = 404;
      return response.json({ error: 'Contact not found!' });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid Category id' });
    }

    if (!name || name.trim().length === '') {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await contactsRepository.findByEmail(email);

    if (contactExists) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const contact = await contactsRepository.create({
      name,
      email: email || null,
      phone: phone || null,
      category_id: category_id || null,
    });

    response.status(201).json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid Contact id' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'Invalid Category id' });
    }

    if (!email) {
      return response.status(400).json({ error: 'E-mail is required' });
    }

    if (!name || name.trim().length === 0) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await contactsRepository.findById(id);

    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not found!' });
    }

    const contactByEmailExists = await contactsRepository.findByEmail(email);

    if (contactByEmailExists && contactByEmailExists.id !== id) {
      return response.status(400).json({ erro: 'This e-mail is already in use' });
    }

    const contact = await contactsRepository.update(id, {
      name,
      email: email || null,
      phone: phone || null,
      category_id: category_id || null,
    });

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid Contact id' });
    }

    contactsRepository.delete(id);
    response.sendStatus(204);
  }
}

// Singleton é um padrão que garante a existência de apenas uma instância de uma classe global.
module.exports = new ContactController();
