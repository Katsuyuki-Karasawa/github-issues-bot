import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "npm:discord.js@14";

export const getModal = (description: string) => {
    const modal = new ModalBuilder()
        .setTitle("Create github issue")
        .setCustomId("AwesomeForm");

    const issueTitle = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueTitle")
        .setLabel("Issue title");

    const issueDescription = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId("issueDescription")
        .setLabel("Issue description")
        .setValue(description);

    const rows = [issueTitle, issueDescription].map((component) =>
        new ActionRowBuilder<TextInputBuilder>().addComponents([component])
    );

    // Add action rows to form
    modal.addComponents(rows);

    return modal;
};
