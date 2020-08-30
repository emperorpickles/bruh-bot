require('dotenv').config();

// discord.js setup
const Discord = require('discord.js');
const client = new Discord.Client();


client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	// Check for activation command
	if (message.content == 'bruh') { play(message) };
});

async function play(message) {
	// Join channel and play file
	try {
		var voiceChannel = message.member.voice.channel;

		// Finds any other active channel if user is not currently in one
		if (!voiceChannel) {
			message.guild.channels.cache.forEach(channel => {
				if (channel.type == 'voice' && channel.members.size > 0) {
					voiceChannel = channel;
				};
			});
			if (!voiceChannel) return
		};

		// Ensure correct permissions to join and speak
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need permission to join this channel');
		};

		// Plays file
		const connection = await voiceChannel.join();
		const dispatcher = connection.play('./media/bruh.mp3')
		dispatcher.on('finish', () => {
			console.log('bruh');
			voiceChannel.leave();
		});
	} catch (err) {
		console.error(err)
		return
	};
};

client.login(process.env.BOT_TOKEN);

// TODO - decide how to best run web server to trigger bot

// const http = require('http');

// var server = http.createServer(function (req, res) {
// 	if (req.url == '/') {
// 		res.writeHead(200, { 'Content-Type': 'text/html'});

// 		res.write('<html><body><p>Hello!</p></body></html>');
// 		res.end();
// 	}
// });

// server.listen(3000);