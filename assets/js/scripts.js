document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("dropdown");
    const selectedStation = document.getElementById("selectedStation");
    const stationList = document.getElementById("stationList");
    const radioPlayer = document.getElementById("radioPlayer");
    const nowPlaying = document.createElement("p");
    nowPlaying.classList.add("now-playing");
    radioPlayer.parentElement.appendChild(nowPlaying);

    const stationIDs = {
        "http://play.global.audio/nova128": "nova128",
        "http://play.global.audio/city128": "city128",
        "http://play.global.audio/radio1128": "radio1128",
        "http://play.global.audio/bgradio128": "bgradio128",
        "http://play.global.audio/nrj128": "nrj128",
        "http://play.global.audio/veronika128": "veronika128"
    };

    function updateNowPlaying(streamUrl) {
        const stationID = stationIDs[streamUrl];

        if (stationID) {
            fetch(`http://localhost:3000/nowplaying/${stationID}`)
                .then(response => response.json())
                .then(data => {
                    nowPlaying.innerHTML = `<strong>Сега звучи:</strong> ${data.nowPlaying || "Няма информация"}`;
                })
                .catch(() => {
                    nowPlaying.innerHTML = "Грешка при извличането на песента.";
                });
        } else {
            nowPlaying.innerHTML = "Няма налична информация за песента.";
        }
    }

    dropdown.addEventListener("click", () => {
        stationList.style.display = stationList.style.display === "block" ? "none" : "block";
    });

    stationList.querySelectorAll("div").forEach(station => {
        station.addEventListener("click", function () {
            const newUrl = this.getAttribute("data-url");
            const stationName = this.innerText;
            const stationIcon = this.querySelector("img").src;

            selectedStation.innerHTML = `<img src="${stationIcon}" alt="${stationName}" width="24"> <span>${stationName}</span>`;
            radioPlayer.src = newUrl;
            radioPlayer.play();
            stationList.style.display = "none";

            updateNowPlaying(newUrl);
            setInterval(() => updateNowPlaying(newUrl), 30000);
        });
    });

    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            stationList.style.display = "none";
        }
    });

    // Auto-fetch metadata for the first station on load
    updateNowPlaying(radioPlayer.src);
});
