const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const waveform = document.querySelector("[data-waveform]");
const playerToggles = document.querySelectorAll("[data-player-toggle]");
const playerEmbeds = document.querySelectorAll("[data-player-embed]");
const trackPlatformLinks = document.querySelectorAll(".track-platform-link");
const releaseList = document.querySelector("[data-release-list]");
const soundcloudPlayer = document.querySelector("[data-soundcloud-player]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (waveform) {
  const levels = [
    12, 18, 26, 34, 20, 44, 52, 30, 22, 42, 58, 48, 24,
    20, 36, 50, 60, 46, 28, 16, 22, 34, 56, 64, 38, 20,
    14, 28, 40, 54, 68, 44, 24, 18, 30, 42, 58, 50, 36,
    20, 14, 24, 38, 54, 46, 32, 18, 26, 42, 58, 34, 16
  ];

  waveform.innerHTML = levels
    .map((level, index) => `<span style="--level:${level}; --i:${index}"></span>`)
    .join("");
}

if (playerToggles.length && playerEmbeds.length) {
  const platformLabels = {
    spotify: "Spotify",
    apple: "Apple Music",
    soundcloud: "SoundCloud"
  };

  const setMusicPlayer = (platform) => {
    const isSoundCloud = platform === "soundcloud";

    playerToggles.forEach((button) => {
      const isActive = button.dataset.playerToggle === platform;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (releaseList && soundcloudPlayer) {
      releaseList.hidden = isSoundCloud;
      soundcloudPlayer.hidden = !isSoundCloud;
    }

    if (isSoundCloud) {
      return;
    }

    playerEmbeds.forEach((embed) => {
      const iframe = embed.querySelector("iframe");
      const src = embed.dataset[`${platform}Src`];
      const title = embed.dataset[`${platform}Title`];

      if (!iframe || !src) {
        return;
      }

      if (iframe.getAttribute("src") !== src) {
        iframe.setAttribute("src", src);
      }

      if (title) {
        iframe.setAttribute("title", title);
      }
    });

    trackPlatformLinks.forEach((link) => {
      const href = link.dataset[`${platform}Link`];
      if (!href) {
        return;
      }

      link.setAttribute("href", href);
      link.textContent = `Open ${platformLabels[platform]}`;
    });
  };

  playerToggles.forEach((button) => {
    button.addEventListener("click", () => {
      setMusicPlayer(button.dataset.playerToggle);
    });
  });
}
