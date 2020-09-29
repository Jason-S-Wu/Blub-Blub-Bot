const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PruneCommand extends BaseCommand {
  constructor() {
    super('prune', 'admin', []);
  }

  run(client, message, args) {
    var amount = Number(args)
    console.log(amount)
    if (isNaN(amount)) return message.channel.send('The amount parameter isn\'t a number!');
    if (!amount) return message.channel.send('You haven\'t given an amount of messages which should be deleted!');
    if (amount < 1) return message.channel.send('You have to delete at least 1 message!');
    else message.channel.bulkDelete(amount)
  }
} 