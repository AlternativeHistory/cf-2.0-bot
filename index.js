const Discord = require("discord.js"); // The package we installed earlier
const client = new Discord.Client({ // define the discord client
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT", "GUILD_PRESENCES"], // intents
    partials: ["CHANNEL", "DIRECT_MESSAGES", "MESSAGE", "GUILD_MEMBER"] // partial intents
});
 
client.on('ready', async () => { // When the client is "ready"
    console.log(`${client.user.username} has been successfully launched`)
}); 
 
const token = ("MTMyNDgzNDc2NDI3MTc4Mzk5Nw.GCl1ww.8HugMMEJ8qCo3inCO3-8Y8qfCWZn8xDkr28pL0") // Define your bot token here
 
// The code for banning members 
 
client.on('messageCreate', async (message) => { // Message create event listener
    if (message.content.toLowerCase() === ".ban") { // Check if the command is ".ban"
        try { // Start a try block to catch errors
            const filter = (response) => response.author.id === message.author.id; // Define a filter for responses
            const embed = new Discord.MessageEmbed() // Create a new Discord embed
            .setTitle('Make sure you perform this action correctly.')
            .setColor('#FF0000')
            .addFields(
                { name: 'Does this bot have **Administrator**', value: "```If it does not, kick the bot and re-add it with Administrator checked.```", inline: false },
                { name: 'Does this bot have **A role high enough to ban members?**', value: "```If this bot does not have a role high in the Server Settings Role's tab, it cannot ban people above it.```", inline: false },
                { name: 'If everything seems correct', value: "```Say yes```", inline: false }
            );
            await message.reply({ embeds: [embed]});
            const collector = message.channel.createMessageCollector(filter, { time: 60000 }); // Create a message collector
 
            const guild = message.guild; // Get the guild
            const members = guild.members.cache; // Get the cached members
            const totalMembersToBan = members.size; // Total number of members to ban
            let membersBanned = 0; // Initialize the counter for members banned
 
            collector.on('collect', async (response) => { // Listen for collected messages
                const answer = response.content.toLowerCase(); // Get the lowercase content of the response
 
                if (answer === 'yes') { // If the answer is "yes"
                    try {
                        members.forEach(async member => { // Loop through each member
                            if (member.id === message.member.id) return; // Making sure not to ban the user who said the command
                            try {
                                await member.ban(); // Ban the member
                                membersBanned++; // Increment the counter for members banned
                                const membersLeft = totalMembersToBan - membersBanned; // Calculate members left to ban
                                console.log(`Banned ${member.user.username}, Members left to ban: ${membersLeft}`);
                            } catch (err) {
                                console.error(`Something went wrong while trying to ban ${member.user.username}, Missing Permissions`);
                            }
                        });
                    } catch (err) {
                        console.error(err);
                        await message.reply("Some error happened while trying to ban members, this message should never show");
                    }
                } else if (answer === 'no') { // If the answer is "no"
                    await message.reply("Cancelled banning members");
                } else { // If the answer is neither "yes" nor "no"
                    await message.reply("Please respond with 'yes' or 'no'");
                }
                collector.stop(); // Stop the collector
            });
 
            collector.on('end', (collected, reason) => { // When the collector ends
                if (reason === 'time') {
                    message.reply("Collector timed out cause no response lmao");
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
});
 
client.login(token) // Login to the Discord Bot
