const mongoose = require('mongoose');
const { generateUniqueNumericId } = require('../utils/functions'); // Certifique-se de que este caminho esteja correto
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uniqueId: { type: String, unique: true, required: true },
  description: String,
  date: Date,
  archived: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

taskSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    let exists = true;
    let newId;

    while (exists) {
      newId = generateUniqueNumericId();
      exists = await mongoose.models.Task.exists({ uniqueId: newId });
    }

    this.uniqueId = newId;
  }

  next();
});

module.exports = mongoose.model('Task', taskSchema);
