const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

const prompts = [
  'Webhook Title',
  'Avatar Link',
];

module.exports = class WebhookCommand extends BaseCommand {
  constructor() {
    super('webhook', 'admin', []);
  }

  async run(client, message, args) {
      try {
        const response = await getResponses(message);
        const embed = new MessageEmbed()
          .addField('Title', response.title, true)
          .addField('Avatar', response.avatar, true);
        const msg = await message.channel.send('Confirm', embed);
        await msg.react('✅');
        await msg.react('⛔');
        const filter = (reaction, user) => ['✅','⛔'].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
        const reactions = await msg.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']});
        const choice = reactions.get('✅') || reactions.get('⛔');
        if (choice.emoji.name === '✅') {
          message.channel.createWebhook(`${response.title}`, {
            avatar: `${response.avatar}`,})
            .then(wb => message.author.send({embed: {color: 3447003, title: `${response.title}`, description: `https://discordapp.com/api/webhooks/${wb.id}/${wb.token}`,}}))
            .then(message.channel.bulkDelete(6))
        } else if (choice.emoji.name === '⛔') {
          message.channel.bulkDelete(6)
        }
      } catch (err) {
        console.log(err)
      }
  }
}

async function getResponses(message){

  const responses = { }

  for(let i = 0; i < prompts.length; i++) {
    await message.channel.send(prompts[i]);
    const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1});
    const { content } = response.first();
    if(i === 0) 
      responses.title = content;
    else if (i === 1)
      responses.avatar = content; 
  }
    return responses; 
}