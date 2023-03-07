const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  contactNumber: { type: String },
  profileImageUrl: { type: String }
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
