const category_model = require("../models/category.model");

exports.createNewCategory = async (req, res) => {
  const cat_data = {
    name: req.body.name,
    description: req.body.description,
  };
  try {
    const category = await category_model.create(cat_data);
    return res.status(201).send(category);
  } catch (error) {
    console.log("Error while creating the category ", error);
    res.status(500).send({
      message: "Error while creating the category",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { name } = req.query;

  try {
    const category_deleted = await category_model.findOneAndDelete({
      name: name,
    });

    if (!category_deleted) {
      return res.status(404).send({
        message: "Category not found",
      });
    }
    return res.status(200).send({
      message: "category deleted",
    });
  } catch (error) {
    console.log("Error while deleting the category ", error);
    res.status(500).send({
      message: "Error while deleting the category",
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { name } = req.query;
  const { name: newName, description } = req.body;

  try {
    if (!newName && !description) {
      return res.status(400).send({
        msg: "Provide at least one field (name or description) to update",
      });
    }

    const updates = {};
    if (newName) {
      updates.name = newName;
    }
    if (description) {
      updates.description = description;
    }

    const category_updated = await category_model.findOneAndUpdate(
      { name: name },
      { $set: updates }
    );

    if (!category_updated) {
      return res.status(404).send({
        message: "Category not found",
      });
    }
    return res.status(200).send({
      message: "category updated",
    });
  } catch (error) {
    console.log("error while updating the category ", error);
    res.status(500).send({
      message: "Error while updating the category",
    });
  }
};
