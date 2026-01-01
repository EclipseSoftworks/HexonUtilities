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
      "https://discord.com/api/webhooks/1434292638965698610/ESX12TFug6B1zp-XvXe8rDiqQgVzZGxbt8_WhNpJgYa7HhcW22H1bNSokzOxq3l9kWHd";
  } else if (playerCount > 10 && playerCount <= 50) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1434292700949123102/AR-W2KDR1vrpdukgf8cu-cNjNHLh38cvoQ9ea3McwOXfPVoUOmNEDauKbKlttkWREpbe";
  } else if (playerCount > 50 && playerCount <= 100) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1434292743559053494/C5Vzhu1zfc93L1k6_e_iadMpPxdOsj0SQun5ndPR3UeK_Bk3hj3AX42wANubLaLuF4Zi";
  } else if (playerCount > 100 && playerCount <= 500) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1456362917426495581/lFnc7iuN05BaH0RAiJBJ95S0ef8UWlmf52nxK90B2LNsDxlYq-PyIaSfigQfRq5u_XAB";
  } else if (playerCount > 500) {
    discordWebhookUrl =
      "https://discord.com/api/webhooks/1456363004181348586/inNJpJKm6qf7sBO3lHnmJtEhLey7vha9eIGKcY2LWh3C3qrjbUfra_OPdKb1U6s33pID";
  }

  const embed = {
    title: "Lunar Utilities",
    color: 8126685,
    fields: [
      { name: "Game", value: ` [${name}](https://www.roblox.com/games/${placeId})` },
      { name: "Players", value: ` ${totalPlayers || "0"}` },
      { name: "Server players", value: `${playersInServer || "0"}` },
      { name: "Visits", value: `${visits || "0"}` },
      { name: "Game Version", value: `${gameVersion || "N/A"}` },
      { name: "Creator", value: `${creatorName || "Unknown"}` },
      { name: "JobId", value: `\`\`\`js\nRoblox.GameLauncher.joinGameInstance(${placeId}, "${jobId || "unknown"}");\n\`\`\`` }
    ],
    thumbnail: { url: thumbnail || "" },
    author: {
      name: "Lunar Gamelogs",
      icon_url: "https://media.discordapp.net/attachments/1389242565588680864/1397931021244043265/lunar_9290559.png"
    },
    footer: {
      text: "Secured and Powered by Hexon",
      icon_url: "https://media.discordapp.net/attachments/1449766127214268467/1454245596532834404/Hexon_Logo.png"
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
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
