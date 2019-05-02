const Discord = require("discord.js")
const bot = new Discord.Client()
const config = require("./config.json")

bot.on("ready", function () {
	console.log("Log in as " + bot.user.tag + "!")
	console.log("Servers:")
	bot.guilds.forEach((guild) => {
		console.log(" - " + guild.name)
	})
	console.log("\n")
})

bot.on("error", function (error) {
	console.log("Error name: " + error.name + "\nError message:" + error.message)
})

var bannedWords = ["fuck", "pute", "fils de pute", "bite", "ta race", "ta mère", "te mere", "tamer", "tamere", "ta maman"]

function redirectCommands(message) {
	console.log("Message from server " + message.guild.name + ", and from user " + message.author.username + ":\n\"" + message.content + "\"\n")

	message.content = message.content.toLowerCase()

	bannedWords.forEach(function (bannedWord) {
		if (message.content.includes(bannedWord)) {
			message.delete()
			message.reply("fais attention à ton vocabulaire... 😠")
			return
		}
	})
}

function ownerDMCommands(message) {
	message.channel.send("Message bien reçu!")
}

function ownerCommands(message) {
//TODO fonction qui prend !cobraEvent et avec le message sous forme "date | sujet"  (utiliser split) qui renvoit un embed avec la date et le thème dans le chan évènement

	redirectCommands(message)
}

bot.on("message", message => {
	try {
		if (message.author.bot)
			return
		
		if (message.guild === null) {
			if (message.author.id === config.ownerID)
				ownerDMCommands(message)
			return
		}

		if (message.author.id !== config.ownerID)
			redirectCommands(message)
		else
			ownerCommands(message)
	} catch (exception) {
		message.channel.send({ embed: { color: 16711680, description: "__**ERREUR**__\nLa commande n'a pas fonctionnée <:surprised_carapuce:568777407046221824>\n\n__L'erreur suivante s'est produite:__\n*" + exception + "*"}})
		bot.users.get(config.ownerID).send({embed:{color: 16711680, description: "__**ERREUR**__\nL'utilisateur " + message.author.username + ", sur le serveur " + message.member.guild.name +  " a envoyé la commande:\n" + message.content + "\n\n__L'erreur suivante s'est produite:__\n*" + exception.stack + "*"}})
		console.log("ERREUR\nLors de l'arrivée de l'utilisateur " + message.author.username + " sur le serveur " + message.member.guild.name + "\nL'erreur suivante s'est produite:\n" + exception.stack)
	}
})

bot.login(config.token)