const { Client, Intents, TextChannel, Message} = require('discord.js');
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES];
const { mainToken } = require('./token.json');
const client = new Client({intents});

const send = async (channel = new TextChannel(), msg = new Message()) => {
  try {
    let webhooks = await channel.fetchWebhooks();
    if (webhooks.size === 0) {
      channel.createWebhook('test').then((webhook) => webhook.send({embeds: msg.embeds, attachments: msg.attachments, content: msg.content + `\n[Jump to!](${msg.url})` || '\u200B' + `\n[Jump to!](${msg.url})`, avatarURL: msg.author.avatarURL(),username: msg.author.tag}))
    } else {
      await webhooks.first().send({embeds: msg.embeds, attachments: msg.attachments, content: msg.content + `\n[Jump to!](${msg.url})` || '\u200B' + `\n[Jump to!](${msg.url})`, avatarURL: msg.author.avatarURL(),username: msg.author.tag});
    }
  } catch (error) {
    console.error(error);
  }
};

client.once('ready', () => {
  client.application.commands.set([{name: 'update', description: 'Update all channels'}, {name: 'delete', description: 'Delete all channels'}], '929571256947339306');
  client.user.setStatus('with your feelings');
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', (interaction) => {
  if (interaction.isCommand() && interaction.command.name === 'update') {
    client.guilds.cache.get('929571256947339306').channels.cache.forEach((channel) => {
      channel.delete();
    });
    client.guilds.cache.get('925222827399987200').channels.cache.forEach((channel) => {
      if (channel.type === 'GUILD_TEXT') client.guilds.cache.get('929571256947339306').channels.create(channel.name, {type: 'GUILD_TEXT' }).then((channel2) => channel2.setTopic(channel.id));
    });
  } else if (interaction.isCommand() && interaction.command.name === 'delete') {
    client.guilds.cache.get('929571256947339306').channels.cache.forEach((channel) => {
      channel.delete();
    });
  }
});

client.on('messageCreate', (message) => {
  if (message.author.id === '925633114703814748' || message.webhookId !== null) return;
  if (message.guild.id === '925222827399987200') {
    client.guilds.cache.get('929571256947339306').channels.cache.forEach((channel) => {
      if (channel.topic === message.channel.id.toString()) {
        send(channel, message);
      }
    });
  } else {
    client.guilds.cache.get('925222827399987200').channels.cache.forEach((channel) => {
      if (message.channel.topic === channel.id.toString()) {
        channel.send({embeds: message.embeds, attachments: message.attachments, content: message.content || '\u200B'})
      }
    });
  }
});

client.on('typingStart', (message) => {
  if (message.guild.id === '929571256947339306') {
    client.guilds.cache.get('925222827399987200').channels.cache.forEach((channel) => {
      if (message.channel.topic === channel.id.toString()) {
        channel.sendTyping();
      }
    });
  }
})

client.login(mainToken).then();