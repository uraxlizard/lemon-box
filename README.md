# Lemon Box - Bulgarian Radio Player

## Overview

Lemon Box is an Electron-based **Bulgarian Radio Player** that allows users to stream various Bulgarian radio stations with a **modern Tesla-inspired UI**. The app includes:

- 🎵 **Live Radio Streaming** from multiple Bulgarian stations
- 🛰 **Now Playing Metadata** (Displays current and next song using ICY metadata)
- 🖥 **Windows 11 Glassmorphism UI** (Smooth, modern design)
- 🎚 **Custom Dropdown with Station Logos**
- 📌 **System Tray Support** (Minimizes to tray instead of closing)
- 🏷 **MIT Licensed & Open Source**

## Features

- **Tesla-Inspired Design** (Glassmorphism, smooth UI)
- **Live Song Info** (Extracts metadata from Icecast/Shoutcast streams)
- **Draggable Window** (Electron window can be moved via title bar)
- **Bootstrap 5 Integration** (Clean, responsive UI)
- **Electron + Node.js Backend** (Fetches metadata with `icy` package)

## Installation

### Prerequisites

- **Node.js** (v16 or later recommended)
- **NPM** (comes with Node.js)
- **Git** (optional for cloning)

### Steps to Run

```sh
# Clone the repository
git clone https://github.com/yourusername/lemon-box.git
cd lemon-box

# Install dependencies
npm install

# Start the App (Runs both Electron & Metadata Server)
npm start

# Compile(Build) binary (EXE)
npm run package-win
```

## Project Structure

```sh
/lemon-box
│── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── style.css
│   ├── img/
│   │   ├── lemon.png
│   │   ├── lemon.ico
│   ├── js/
│   │   ├── bootstrap.bundle.min.js
│   │   ├── scripts.js
│── index.html
│── server.js   # ICY Metadata Fetcher (Node.js)
│── index.js    # Electron App
│── package.json
│── README.md
│── LICENSE
```

