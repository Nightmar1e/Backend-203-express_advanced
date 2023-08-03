// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { collection: 'message' });





const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
