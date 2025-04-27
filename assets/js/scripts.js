document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("dropdown");
    const selectedStation = document.getElementById("selectedStation");
    const stationList = document.getElementById("stationList");
    const radioPlayer = document.getElementById("radioPlayer");
    
    // Create and style the now playing element
    const nowPlaying = document.createElement("div");
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

    let currentUpdateInterval = null;

    function updateNowPlaying(streamUrl) {
        const stationID = stationIDs[streamUrl];

        if (stationID) {
            fetch(`http://localhost:3000/nowplaying/${stationID}`)
                .then(response => response.json())
                .then(data => {
                    nowPlaying.innerHTML = `
                        <i class="fas fa-music me-2"></i>
                        <strong>Сега звучи:</strong> ${data.nowPlaying || "Няма информация"}
                    `;
                })
                .catch(() => {
                    nowPlaying.innerHTML = `
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Грешка при извличането на песента
                    `;
                });
        } else {
            nowPlaying.innerHTML = `
                <i class="fas fa-info-circle me-2"></i>
                Няма налична информация за песента
            `;
        }
    }

    // Toggle dropdown
    selectedStation.addEventListener("click", (e) => {
        e.stopPropagation();
        stationList.style.display = stationList.style.display === "block" ? "none" : "block";
        
        // Add active class for visual feedback
        selectedStation.classList.toggle('active');
    });

    // Handle station selection
    stationList.querySelectorAll(".station-item").forEach(station => {
        station.addEventListener("click", function() {
            const newUrl = this.getAttribute("data-url");
            const stationName = this.querySelector("span").textContent;
            const stationIcon = this.querySelector("img").src;

            // Update selected station display
            selectedStation.innerHTML = `
                <img src="${stationIcon}" alt="${stationName}" class="station-logo">
                <span>${stationName}</span>
            `;

            // Update audio player
            radioPlayer.src = newUrl;
            radioPlayer.play();
            
            // Hide dropdown
            stationList.style.display = "none";
            selectedStation.classList.remove('active');

            // Clear existing interval and set new one
            if (currentUpdateInterval) {
                clearInterval(currentUpdateInterval);
            }
            
            updateNowPlaying(newUrl);
            currentUpdateInterval = setInterval(() => updateNowPlaying(newUrl), 30000);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            stationList.style.display = "none";
            selectedStation.classList.remove('active');
        }
    });

    // Initialize with first station metadata
    updateNowPlaying(radioPlayer.src);
});