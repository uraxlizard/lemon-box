const express = require("express");
const icy = require("icy");
const cors = require("cors");

const app = express();
app.use(cors());

// Match the stations with your HTML radio stations
const stations = {
    "nova128": "http://play.global.audio/nova128",
    "city128": "http://play.global.audio/city128",
    "radio1128": "http://play.global.audio/radio1128",
    "bgradio128": "http://play.global.audio/bgradio128",
    "nrj128": "http://play.global.audio/nrj128",
    "veronika128": "http://play.global.audio/veronika128"
};

// Metadata cache to prevent too frequent requests
const metadataCache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Single nowplaying endpoint
app.get("/nowplaying/:station", async (req, res) => {
    const stationId = req.params.station;
    const streamUrl = stations[stationId];

    if (!streamUrl) {
        return res.status(404).json({ 
            error: "Непозната радио станция",
            status: "error" 
        });
    }

    // Check cache first
    const cachedData = metadataCache.get(stationId);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
        return res.json(cachedData.data);
    }

    try {
        const metadata = await fetchStationMetadata(streamUrl);
        const responseData = {
            nowPlaying: metadata || "Няма информация",
            station: stationId,
            status: "success"
        };

        // Update cache
        metadataCache.set(stationId, {
            data: responseData,
            timestamp: Date.now()
        });

        res.json(responseData);
    } catch (error) {
        console.error(`Error fetching metadata for ${stationId}:`, error);
        res.status(500).json({ 
            error: "Грешка при извличане на информацията",
            status: "error"
        });
    }
});

function fetchStationMetadata(streamUrl) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Timeout fetching metadata"));
        }, 5000);

        icy.get(streamUrl, (stream) => {
            let metadataReceived = false;

            stream.on("metadata", (metadata) => {
                clearTimeout(timeout);
                metadataReceived = true;
                const parsed = icy.parse(metadata);
                resolve(parsed.StreamTitle || null);
                stream.destroy();
            });

            stream.on("error", (error) => {
                clearTimeout(timeout);
                reject(error);
            });

            setTimeout(() => {
                if (!metadataReceived) {
                    stream.destroy();
                    resolve(null);
                }
            }, 2000);
        });
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Сървърът работи нормално',
        timestamp: new Date().toISOString()
    });
});

// Start the server with port checking
const PORT = process.env.PORT || 3000;

function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Радио сървърът работи на http://localhost:${port}`);
            resolve(server);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Порт ${port} е зает, опитвам с ${port + 1}`);
                resolve(startServer(port + 1)); // Try next port
            } else {
                reject(err);
            }
        });
    });
}

let server;
startServer(PORT).then(s => {
    server = s;
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Получен сигнал за спиране...');
    if (server) {
        server.close(() => {
            console.log('Сървърът е спрян успешно');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Неочаквана грешка:', error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
