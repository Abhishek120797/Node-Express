const product_details_check = (req, res, next) => {
  const product = req.body;

  if (!product.name) {
    return res.status(400).send({
      message: "product name is required",
    });
  }
  if (!product.description) {
    return res.status(400).send({
      message: "product description is required",
    });
  }
  if (!product.category) {
    return res.status(400).send({
      message: "product category is required",
    });
  }
  next();
};

const categoryCheck = (req, res, next) => {
  const category = req.body.category || req.params.category;

  if (!category) {
    return res.status(400).send({
      message: "Category name is required",
    });
  }
  next();
};

const productNameCheck = (req, res, next) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).send({
      message: "product name is required",
    });
  }
  next();
};

module.exports = {
  product_details_check: product_details_check,
  categoryCheck: categoryCheck,
  productNameCheck: productNameCheck,
};
