import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/webhook", (req, res) => {
    // META webhook verification: respond with hub.challenge
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
    console.log("webhook event", JSON.stringify(req.body).slice(0, 200));
    // TODO: push to queue
    res.sendStatus(200);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Webhook server listening on ${PORT}`));
