const express = require("express");
const icy = require("icy");
const cors = require("cors");

const app = express();
app.use(cors());

const stations = {
    "nova128": "http://play.global.audio/nova128",
    "city128": "http://play.global.audio/city128",
    "radio1128": "http://play.global.audio/radio1128",
    "bgradio128": "http://play.global.audio/bgradio128",
    "nrj128": "http://play.global.audio/nrj128",
    "veronika": "http://play.global.audio:80/veronika.opus"
};

// Fetch metadata from a station
app.get("/nowplaying/:station", (req, res) => {
    const streamUrl = stations[req.params.station];

    if (!streamUrl) {
        return res.json({ error: "Unknown station" });
    }

    icy.get(streamUrl, (stream) => {
        stream.on("metadata", (metadata) => {
            const parsed = icy.parse(metadata);
            res.json({ nowPlaying: parsed.StreamTitle || "Unknown" });
        });

        stream.on("error", (error) => {
            console.error("Stream error:", error);
            res.json({ error: "Failed to fetch metadata" });
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`ICY Metadata Server running on http://localhost:${PORT}`);
});
