// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
