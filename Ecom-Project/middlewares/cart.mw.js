const checkProductName = (req, res, next) => {
  const product = req.body.product || req.params.product;

  if (!product) {
    return res.status(400).send({
      message: "product name is required",
    });
  }
  next();
};

module.exports = {
  checkProductName: checkProductName,
};
