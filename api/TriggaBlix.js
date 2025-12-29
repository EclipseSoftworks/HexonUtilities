export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const expectedApiKey = "fdasfasfopkasdopfkopasd";
  const authHeader = req.headers.authorization || "";
  if (authHeader !== `Bearer ${expectedApiKey}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const {
    placeId,
    gameId,
    name,
    playersInServer,
    totalPlayers,
    visits,
    gameVersion,
    creatorName,
    creatorId,
    thumbnail,
    jobId
  } = req.body;

  if (!placeId || !name) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const playerCount = Number(totalPlayers) || 0;

  let discordWebhookUrl = "";

  if (playerCount >= 0 && playerCount <= 10) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1455315027123765486/X3HEW7axDRmJuoBL4REgWUVt-GJ5DJFczOXTf3J6q2s4XDE54LHllTf_H6l9ZPee616g";
  } else if (playerCount <= 50) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1455315050024931475/AW8UfkmFl9dblFRgf40q4IgqikQtinCpA5KnIoNXiHE-PXilXFdMA85LcKt9QmQMlXtF";
  } else if (playerCount <= 100) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1455315086624428217/GaU-bqbGS69Jfzz3ZzOuGSHS7lgpsLwX8yctWFDxYassO4aKR0TlG-fSTn5sVMN-M7Nq";
  } else {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1455315112473788507/OAZzyCnNe0IimkkDP_YP0jIxanWk_gZEu9ydayJr89DAjpjNhb6rjyU4oMmyS4SjAMT4";
  }

  const embed = {
    title: "Hexon Utilities",
    color: 0x000000,
    fields: [
      {
        name: "Game",
        value: `[${name}](https://www.roblox.com/games/${placeId})`
      },
      {
        name: "Players",
        value: `${playerCount}`
      },
      {
        name: "Server players",
        value: `${playersInServer || "0"}`
      },
      {
        name: "Visits",
        value: `${visits || "0"}`
      },
      {
        name: "Game Version",
        value: `${gameVersion || "N/A"}`
      },
      {
        name: "Creator",
        value: `${creatorName || "Unknown"}`
      },
      {
        name: "JobId",
        value: `\`\`\`js\nRoblox.GameLauncher.joinGameInstance(${placeId}, "${jobId || "unknown"}");\n\`\`\``
      }
    ],
    thumbnail: {
      url: thumbnail || ""
    },
    author: {
      name: "Hexon Gamelogs",
      icon_url:
        "https://media.discordapp.net/attachments/1449766127214268467/1454245596532834404/Hexon_Logo.png"
    },
    footer: {
      text: "Secured and Powered by isiah",
      icon_url:
        "https://media.discordapp.net/attachments/1449766127214268467/1454245596532834404/Hexon_Logo.png"
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Discord webhook error:", text);
      return res.status(500).json({ success: false, message: "Failed to send Discord embed" });
    }

    return res.status(200).json({ success: true, message: "Embed sent successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ success: false, message: "Unexpected server error" });
  }
}
