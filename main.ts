import DiscordJS from "npm:discord.js@14";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { Octokit } from "https://esm.sh/octokit@2.0.19";
import { getModal } from "./utils.ts";

// @deno-types="npm:@types/express"
import express from "npm:express@4";

const app = express();
const PORT = Deno.env.get("PORT") || "3000";


app.use(express.json());

app.get("/", (req, res) => {
    res.send("Github issues bot!");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const client = new DiscordJS.Client({
    intents: ["Guilds", "GuildMessages"],
});

client.on("ready", () => {
    console.log("issue bot ready");
    const guildId = Deno.env.get("GUILD_ID") || "";

    const guild = client.guilds.cache.get(guildId);

    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: "Open github issue",
        type: 3,
    });
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isMessageContextMenuCommand()) {
        const { commandName, targetMessage } = interaction;
        if (commandName === "Open github issue") {
            const modal = getModal(targetMessage.content);
            interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        const { fields } = interaction;
        const issueTitle = fields.getField("issueTitle").value;
        const issueDescription = fields.getField("issueDescription").value;
        const octokit = new Octokit({
            auth: Deno.env.get("ACCESS_TOKEN"),
            baseUrl: "https://api.github.com",
        });

        octokit.rest.issues
            .create({
                owner: Deno.env.get("GITHUB_USERNAME") || "",
                repo: Deno.env.get("GITHUB_REPOSITORY") || "",
                title: issueTitle,
                body: issueDescription,
            })
            .then((res) => {
                interaction.reply(`Issue created: ${res.data.html_url}`);
            });
    }
});

client.login(Deno.env.get("BOT_TOKEN"));
