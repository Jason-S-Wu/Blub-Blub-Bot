const BaseEvent = require('../utils/structures/BaseEvent');
const Reaction = require('../database/model/reaction');

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    try{
      var ReactionChannelsNonParsed = (await Reaction.find({ __v: '0'})).toString()
      var ReactionChannelsParsed = ReactionChannelsNonParsed.match(/\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d/g)
      if(ReactionChannelsParsed.includes(message.channel.id)){
        await message.react('✅');
        await message.react('⛔');
      }
    } catch(err){ }
  }
}