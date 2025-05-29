const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#000000' }, // Cor padrão
  description: { type: String, default: '' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

tagSchema.pre('validate', async function (next) {
  console.log('Pre-validate hook triggered for Tag model');
  
  // Verifica se o nome da tag já existe
  const existingTag = await mongoose.models.Tag.findOne({ name: this.name });
  if (existingTag) {
    const error = new Error('Tag com este nome já existe');
    error.status = 400; // Bad Request
    return next(error);
  }
  // Se não existir, gera uma cor aleatória se não for fornecida
  if (!this.color) {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    this.color = randomColor;
  }
  console.log(`Tag color set to: ${this.color}`);
  next();
});

module.exports = mongoose.model('Tag', tagSchema);