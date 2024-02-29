const category_model = require("../models/category.model");

const categoryCheck = async (req, res, next) => {
  const category = req.body;

  if (!category.name) {
    return res.status(400).send({
      message: "category name is not provided",
    });
  }

  if (!category.description) {
    return res.status(400).send({
      message: "category description is not provided",
    });
  }

  const checkCategoryPresent = await category_model.findOne({
    name: category.name,
  });

  if (checkCategoryPresent) {
    return res.status(409).send({
      message:
        "This category name is already present try diferent category name",
    });
  }

  next();
};

const categoryNameCheck = (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).send({
      message: "Category name is required",
    });
  }
  next();
};

module.exports = {
  categoryCheck: categoryCheck,
  categoryNameCheck: categoryNameCheck,
};
