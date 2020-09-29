const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ReactCommand extends BaseCommand {
  constructor() {
    super('react', 'admin', []);
  }

  async run(client, message, args) {
    try {
      await message.delete();
      const messages = await message.channel.messages.fetch({ limit: 100 });
      for (const [id, message] of messages) {
        await message.react('✅');
        await message.react('⛔');
      }
    }
     catch(err) {
      console.error(err);
    }
  }
}