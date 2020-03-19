const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

bot.on("ready", function () {
	console.log("Log in as " + bot.user.tag + "!");
	console.log("Servers:");
	bot.guilds.forEach((guild) => {
		console.log(" - " + guild.name);
	});
	console.log("\n");
});

bot.on("error", function (error) {
	console.log("Error name: " + error.name + "\nError message:" + error.message);
});

let bannedWords = ["fuck", "pute", "fils de pute", "bite", "ta race", "ta mère", "te mere", "tamer", "tamere", "ta maman"];

function redirectCommands(message) {
	console.log("Message from server " + message.guild.name + ", and from user " + message.author.username + ":\n\"" + message.content + "\"\n");

	message.content = message.content.toLowerCase();

	bannedWords.forEach(function (bannedWord) {
		if (message.content.includes(bannedWord)) {
//			message.delete();
			message.reply("fais attention à ton vocabulaire... 😠");
			return;
		}
	});
}

function ownerDMCommands(message) {
	message.channel.send("Message bien reçu!");
}

function ownerCommands(message) {
	if (message.content.startsWith(config.prefix + "Event")) {
		let args = message.content.split("|");
		args.shift();
		if (args.length != 3) {
			message.channel.send({embed:{color: 16711680, description: "__**ERREUR**__\nLe nombre d'arguments n'est pas bon.\nle message doit être sous le forme `!cobraEvent | channel | date | thème`"}});
			return;
		}
		args[0] = args[0].substring(1, args[0].length - 1);
		args[1] = args[1].substring(1, args[1].length);
		args[2] = args[2].substring(1, args[2].length);
		let chan = bot.guilds.first().channels.find(ch => ch.name === args[0]);
		if (!chan) {
			message.channel.send({embed:{color: 16711680, description: "__**ERREUR**__\nLe channel *"+ args[0] + "* n\'a pas été trouvé"}});
			bot.users.get(config.ownerID).send({embed:{color: 16711680, description: "__**ERREUR**__\nLe channel *"+ args[0] + "* n\'a pas été trouvé"}});
			return;
		}
		chan.send({embed: {color: 3447003, description: "__**Coding club à venir !**__", fields: [{name: "Le " + args[1], value: args[2]}]}});
	}
	redirectCommands(message);
}

bot.on("message", message => {
	try {
		if (message.author.bot)
			return;
		if (message.guild === null) {
			if (message.author.id === config.ownerID)
				ownerDMCommands(message);
			else
				bot.users.get(config.ownerID).send({ embed: { color: 3447003, description: `L\'utilisateur ${message.author.username} m\'a envoyé :\n\n${message.content}`}});
			return;
		}
		if (message.author.id !== config.ownerID)
			redirectCommands(message);
		else
			ownerCommands(message);
	} catch (exception) {
		message.channel.send({ embed: { color: 16711680, description: `__**ERREUR**__\nLa commande n\'a pas fonctionnée <:surprised_carapuce:568777407046221824>\n\n__L\'erreur suivante s\'est produite :__\n*${exception}*`}});
		bot.users.get(config.ownerID).send({embed:{color: 16711680, description: `__**ERREUR**__\nL\'utilisateur ${message.author.username}, sur le serveur ${message.member.guild.name} a envoyé la commande :\n${message.content}\n\n__L\'erreur suivante s\'est produite :__\n*${exception.stack}*`}});
		console.log(`ERREUR\nLors de l\'arrivée de l\'utilisateur ${message.author.username} sur le serveur ${message.member.guild.name}\nL\'erreur suivante s\'est produite : \n${exception.stack}`);
	}
});

bot.login(config.token);