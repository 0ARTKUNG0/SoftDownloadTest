// Dummy API - No real backend
// Simulates API calls with static data

// Software database
const softwareData = [
  {
    id: 1,
    name: "Google Chrome",
    description: "Fast, secure web browser built by Google",
    size: "85.2 MB",
    category: "Browser",
    website_url: "https://www.google.com/chrome/",
    download_url: "https://www.google.com/chrome/",
    file_name: "ChromeSetup.exe",
    icon_url: "https://www.google.com/chrome/static/images/chrome-logo-m100.svg"
  },
  {
    id: 2,
    name: "Mozilla Firefox",
    description: "Free and open-source web browser",
    size: "56.8 MB",
    category: "Browser",
    website_url: "https://www.mozilla.org/firefox/",
    download_url: "https://www.mozilla.org/firefox/download/",
    file_name: "Firefox-Setup.exe"
  },
  {
    id: 3,
    name: "Visual Studio Code",
    description: "Code editor redefined and optimized for building web apps",
    size: "92.4 MB",
    category: "Development",
    website_url: "https://code.visualstudio.com/",
    download_url: "https://code.visualstudio.com/Download",
    file_name: "VSCodeUserSetup.exe"
  },
  {
    id: 4,
    name: "Git",
    description: "Distributed version control system",
    size: "48.3 MB",
    category: "Development",
    website_url: "https://git-scm.com/",
    download_url: "https://git-scm.com/downloads",
    file_name: "Git-Setup.exe"
  },
  {
    id: 5,
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    size: "28.5 MB",
    category: "Development",
    website_url: "https://nodejs.org/",
    download_url: "https://nodejs.org/en/download/",
    file_name: "node-setup.msi"
  },
  {
    id: 6,
    name: "7-Zip",
    description: "Free and open-source file archiver",
    size: "1.5 MB",
    category: "Utilities",
    website_url: "https://www.7-zip.org/",
    download_url: "https://www.7-zip.org/download.html",
    file_name: "7z-setup.exe"
  },
  {
    id: 7,
    name: "VLC Media Player",
    description: "Free and open-source cross-platform multimedia player",
    size: "41.2 MB",
    category: "Media",
    website_url: "https://www.videolan.org/vlc/",
    download_url: "https://www.videolan.org/vlc/download-windows.html",
    file_name: "vlc-setup.exe"
  },
  {
    id: 8,
    name: "Discord",
    description: "Voice, video, and text communication platform",
    size: "95.7 MB",
    category: "Communication",
    website_url: "https://discord.com/",
    download_url: "https://discord.com/download",
    file_name: "DiscordSetup.exe"
  },
  {
    id: 9,
    name: "Spotify",
    description: "Digital music streaming service",
    size: "102.3 MB",
    category: "Media",
    website_url: "https://www.spotify.com/",
    download_url: "https://www.spotify.com/download/",
    file_name: "SpotifySetup.exe"
  },
  {
    id: 10,
    name: "Zoom",
    description: "Video conferencing and online meeting platform",
    size: "67.8 MB",
    category: "Communication",
    website_url: "https://zoom.us/",
    download_url: "https://zoom.us/download",
    file_name: "ZoomInstaller.exe"
  },
  {
    id: 11,
    name: "Steam",
    description: "Digital distribution platform for PC gaming",
    size: "1.8 MB",
    category: "Gaming",
    website_url: "https://store.steampowered.com/",
    download_url: "https://store.steampowered.com/about/",
    file_name: "SteamSetup.exe"
  },
  {
    id: 12,
    name: "Epic Games Launcher",
    description: "Digital video game storefront and launcher",
    size: "72.4 MB",
    category: "Gaming",
    website_url: "https://www.epicgames.com/store/",
    download_url: "https://www.epicgames.com/store/download",
    file_name: "EpicInstaller.msi"
  }
];

// Auth API
export const authAPI = {
  register: ({ name, email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (!name || !email || !password) {
          reject({ message: "All fields are required" });
          return;
        }
        if (password.length < 6) {
          reject({ message: "Password must be at least 6 characters" });
          return;
        }
        resolve({ success: true, message: "Registration successful!" });
      }, 500);
    });
  },

  login: ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (!email || !password) {
          reject({ message: "Email and password are required" });
          return;
        }
        // Dummy login - always succeeds with any credentials
        if (email && password) {
          resolve({ token: "dummy-token", user: { email } });
        } else {
          reject({ message: "Invalid credentials" });
        }
      }, 500);
    });
  }
};

// Software API
export const softwareAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(softwareData);
      }, 300);
    });
  },

  download: (ids) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const selectedSoftware = softwareData.filter(sw => ids.includes(sw.id));
        const download_links = selectedSoftware.map(sw => ({
          id: sw.id,
          name: sw.name,
          download_url: sw.download_url,
          file_name: sw.file_name
        }));
        resolve({ download_links });
      }, 300);
    });
  }
};
