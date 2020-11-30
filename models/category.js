const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

categorySchema.statics.getCategories = async function getCategorys(
  categoryIds
) {
  const categorys = [];
  for (let i = 0; i < categoryIds.length; i++) {
    const category = await this.findById(categoryIds[i]);
    if (!category) continue;
    categorys.push({
      _id: category._id,
      name: category.name,
    });
  }
  return categorys;
};

const Category = mongoose.model('category', categorySchema);

function validateRequest(req) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
  };
  return (valResult = Joi.validate(req.body, schema));
}

exports.Category = Category;
exports.categorySchema = categorySchema;
exports.validate = validateRequest;
