const BaseCommand = require('../../utils/structures/BaseCommand');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { saveGiveaway, scheduleGiveaways } = require('../../utils/giveaway.js');

const prompts = [
  'Giveaway Title',
  'What are you giving away?',
  'How long is this giveaway?',
  'How many winners?'
];

module.exports = class CreateCommand extends BaseCommand {
  constructor() {
    super('create', 'giveaway', []);
  }

 async run(client, message, args) {
    const id = args.toString().slice(2,20);
    const channel = client.channels.cache.get(id);
    console.log(id)
    if (channel) {
      try {
        const response = await getResponses(message);
        const embed = new MessageEmbed()
          .addField('Title', response.title, true)
          .addField('Prize', response.prize, true)
          .addField('# of Winners', response.winners, false)
          .addField('Duration', response.duration, true);
        const msg = await message.channel.send('Confirm', embed);
        await msg.react('✅');
        await msg.react('⛔');

        const filter = (reaction, user) => ['✅','⛔'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
        const reactions = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']});
        const choice = reactions.get('✅') || reactions.get('⛔');
        if (choice.emoji.name === '✅') {
          response.endsOn = new Date(Date.now() + ms(response.duration));
          const giveawayEmbed = new MessageEmbed()
            .setTitle(response.title)
            .setDescription(`Prize: ${response.prize}\n
            Number of Winners: ${response.winners}\n
            Ends On: ${response.endsOn}\n
            **REACT with 🎉 to ENTER!!**`);
            const giveawayMsg = await channel.send(giveawayEmbed);
            await giveawayMsg.react('🎉');
            response.messageId = giveawayMsg.id;
            response.guildId = giveawayMsg.guild.id;
            response.channelId = id;
            await saveGiveaway(response);
            await scheduleGiveaways(client, [response]);
        } else if (choice.emoji.name === '⛔') {
          message.channel.send('Cancelled Giveaway')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      message.channel.send('Channel Not Found')
    }
  }
}

async function getResponses(message){

  const validTime = /^\d+(s|m|h|d)$/;
  const validNumber = /\d+/;
  const responses = { }

  for(let i = 0; i < prompts.length; i++) {
    await message.channel.send(prompts[i]);
    const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1});
    const { content } = response.first();
    if(i === 0) 
      responses.title = content;
    else if (i === 1)
      responses.prize = content; 
    else if (i === 2) {
      if (validTime.test(content))
        responses.duration = content;
      else
        throw new Error('Invalid Time Format')
    }
    else if (i === 3) {
      if (validNumber.test(content))
        responses.winners = content;
      else 
        throw new Error('Invalid Entry for Winners') 
    }
  }
    return responses; 
}
