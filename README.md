# Lemon Box - Bulgarian Radio Player

## Overview

Lemon Box is an Electron-based **Bulgarian Radio Player** that allows users to stream various Bulgarian radio stations with a **modern Tesla-inspired UI**. The app includes:

- 🎵 **Live Radio Streaming** from multiple Bulgarian stations
- 🛰 **Now Playing Metadata** (Displays current and next song using ICY metadata)
- 🖥 **Windows 11 Glassmorphism UI** (Smooth, modern design)
- 🎚 **Custom Dropdown with Station Logos**
- 🏷 **MIT Licensed & Open Source**

## Features

- **Tesla-Inspired Design** (Glassmorphism, smooth UI)
- **Live Song Info** (Extracts metadata from Icecast/Shoutcast streams)
- **Draggable Window** (Electron window can be moved via title bar)
- **Bootstrap 5 Integration** (Clean, responsive UI)
- **Electron + Node.js Backend** (Fetches metadata with `icy` package)
- **System Tray Support** (Minimize to tray functionality)
- **Compact Window Size** (Optimized for minimal screen space)
- **Dark Purple Theme** (Eye-friendly color scheme)

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
│   │   ├── custom.css
│   ├── img/
│   │   ├── lemon.png
│   │   ├── lemon.ico
│   ├── js/
│   │   ├── bootstrap.bundle.min.js
│   │   ├── scripts.js
│── index.html
│── server.js   # ICY Metadata Fetcher (Node.js)
│── main.js     # Electron App
│── package.json
│── README.md
│── LICENSE
```

## Usage

- **Minimize to Tray**: Click the minimize button to hide the app to the system tray
- **Close Confirmation**: When clicking the close button, you'll be prompted to either close the app or minimize to tray
- **Window Management**: Drag the window using the title bar
- **Radio Selection**: Use the dropdown menu to select different radio stations
- **Now Playing**: Current and next song information is displayed automatically

## Development

The app uses:
- **Electron** for the desktop application framework
- **Express.js** for the metadata server
- **Bootstrap 5** for UI components
- **Custom CSS** for Tesla-inspired styling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

