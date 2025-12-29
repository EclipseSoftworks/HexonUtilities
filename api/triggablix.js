export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const expectedApiKey = "https://discord.com/api/webhooks/1455070136200335455/QtrM3J9k0gbfe_IClyu-ZuQTtVLQBmcXC1tRYXMHrSF9JUaaLhSi2In4Oku-HVULACSu";
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

  const discordWebhookUrl = "https://discord.com/api/webhooks/1455070136200335455/QtrM3J9k0gbfe_IClyu-ZuQTtVLQBmcXC1tRYXMHrSF9JUaaLhSi2In4Oku-HVULACSu";

  const embed = {
    title: "Hexon Utilities",
    color: 8126685,
    fields: [
      {
        name: "Game",
        value: ` [${name}](https://www.roblox.com/games/${placeId})`
      },
      {
        name: "Players",
        value: ` ${totalPlayers || "0"}`
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
      icon_url: "https://media.discordapp.net/attachments/1449766127214268467/1454245596532834404/Hexon_Logo.png?ex=69525d80&is=69510c00&hm=6a5e5176c77337dcffc0e1a8f5cedcdcbd7410c68f94ca60e492614ed2747436&=&format=webp&quality=lossless"
    },
    footer: {
      text: "Secured and Powered by Isiah",
      icon_url: "https://media.discordapp.net/attachments/1449766127214268467/1454245596532834404/Hexon_Logo.png?ex=69525d80&is=69510c00&hm=6a5e5176c77337dcffc0e1a8f5cedcdcbd7410c68f94ca60e492614ed2747436&=&format=webp&quality=lossless"
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: null,
        embeds: [embed],
        attachments: []
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
