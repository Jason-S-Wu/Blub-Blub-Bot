const BaseCommand = require('../../utils/structures/BaseCommand');
const { saveReaction } = require('../../utils/reaction.js');

module.exports = class ReactionCommand extends BaseCommand {
  constructor() {
    super('reaction', 'admin', []);
  }

  async run(client, message, args) {
    const id = args.toString().slice(2,20);
    const channel = client.channels.cache.get(id);
    console.log(id)
    if (channel) {
      try {
        const msg = await message.channel.send(`Confirm Reaction for ${args}`);
        await msg.react('✅');
        await msg.react('⛔');
        const filter = (reaction, user) => ['✅','⛔'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
        const reactions = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']});
        const choice = reactions.get('✅') || reactions.get('⛔');
        if (choice.emoji.name === '✅') {
            await saveReaction(id);
        } else if (choice.emoji.name === '⛔') {
          message.channel.send('Cancelled Reaction')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      message.channel.send('Channel Not Found')
    }
  }
}