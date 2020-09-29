const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'admin', []);
  }

  run(client, message, args) {
    message.channel.send({embed: {
      color: 3447003,
      title: "Help Menu",
      description: `Prefix \`${client.prefix}\``,
      fields: [{
          name: "Create",
          value: "Creates a giveaway"
        },
        {
          name: "Ping",
          value: "Pings the bot"
        },
        {
          name: "Prune",
          value: "Delete multiple messages"
        }
        ,
        {
          name: "React",
          value: "Reacts to previous messages in channel with ✅ and ⛔"
        },
        {
          name: "Reaction",
          value: "Reacts to future messages in channel with ✅ and ⛔"
        },
        {
          name: "Webhook",
          value: "Creates a webhook with title and avatar"
        },
      ],
      timestamp: new Date(),
      footer: {
        text: "Blub Bot"
      }
    }
  });
  }
}