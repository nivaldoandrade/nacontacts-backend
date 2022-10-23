const categoriesRepository = require('../repositories/CategoriesRepository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;

    const categories = await categoriesRepository.findAll(orderBy);

    response.json(categories);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name || name.trim().length === 0) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const category = await categoriesRepository.create({ name });

    response.status(201).json(category);
  }
}

module.exports = new CategoryController();
