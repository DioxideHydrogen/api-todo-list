const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  token: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
