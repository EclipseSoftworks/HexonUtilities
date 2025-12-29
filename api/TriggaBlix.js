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

  const discordWebhookUrl = "https://discord.com/api/webhooks/1455070136200335455/QtrM3J9k0gbfe_IClyu-ZuQTtVLQBmcXC1tRYXMHrSF9JUaaLhSi2In4Oku-HVULACSu";

  const embed = {
    title: "Lunar Utilities",
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
      name: "Lunar Gamelogs",
      icon_url: "https://media.discordapp.net/attachments/1389242565588680864/1397931021244043265/lunar_9290559.png?ex=68838437&is=688232b7&hm=12fc1b7553331f4959f5ba95dc33501d20c93aa670e96d4152aa9ca3a0683eb3&=&format=webp&quality=lossless"
    },
    footer: {
      text: "Secured and Powered by Eclipse",
      icon_url: "https://media.discordapp.net/attachments/1359562019212361728/1397937849348784191/LOGO-Photoroom.png?ex=68838a93&is=68823913&hm=83c53c4783529ec6f68680a8f83ee8020e6c9ec496d7302f70b94c732bfc37ff&=&format=webp&quality=lossless"
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
