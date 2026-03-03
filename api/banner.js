import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  try {
    const userId = "1025598245331804292";

    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const json = await response.json();

    if (!json.success) {
      return res.status(400).send("User not tracked");
    }

    const data = json.data;
    const status = data.discord_status;
    const username = data.discord_user.username;
    const avatarURL = `https://cdn.discordapp.com/avatars/${userId}/${data.discord_user.avatar}.png`;

    const canvas = createCanvas(1200, 350);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./Discordbanner.jpg");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(10, 18, 40, 0.82)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const avatar = await loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 175, 110, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 90, 65, 220, 220);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(200, 175, 118, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "rgba(20, 25, 55, 0.45)";
    ctx.fillRect(360, 85, 700, 200);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.fillText(username, 400, 140);

    let statusColor = "#ff4d4d";
    if (status === "online") statusColor = "#00ff88";
    if (status === "idle") statusColor = "#ffaa00";
    if (status === "dnd") statusColor = "#ff0000";

    ctx.beginPath();
    ctx.arc(385, 200, 12, 0, Math.PI * 2);
    ctx.fillStyle = statusColor;
    ctx.fill();

    ctx.font = "30px Arial";
    ctx.fillStyle = "#cccccc";
    ctx.fillText("Status:", 410, 210);

    ctx.fillStyle = statusColor;
    ctx.fillText(status.toUpperCase(), 540, 210);

    if (status === "offline") {
      ctx.fillStyle = "#9aa3b2";
      ctx.font = "24px Arial";
      ctx.fillText("Last seen: Offline", 380, 260);
    }

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating banner");
  }
}