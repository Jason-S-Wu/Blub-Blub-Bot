const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    channelId: { type: String, required: true},
});

const Reaction = module.exports = mongoose.model('Reaction', ReactionSchema);
