const Reaction = require('../database/model/reaction');

async function saveReaction(channelId) {
    const reaction = new Reaction({
        channelId,
    });
    return reaction.save();
}

module.exports = {
    saveReaction
}