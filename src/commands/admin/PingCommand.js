const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('ping', 'admin', []);
  }

  async run(client, message, args) {
      message.channel.send("Pinging...").then(m =>{
        var ping = m.createdTimestamp - message.createdTimestamp;
        var embed = new MessageEmbed()
        .setAuthor(`Your ping is ${ping}ms`)
        m.edit(embed)
    });
  }  
}