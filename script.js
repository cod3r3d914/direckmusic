const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const hero = document.querySelector(".hero");
const waveform = document.querySelector("[data-waveform]");
const introPlayer = document.querySelector("[data-intro-player]");
const introAudio = document.querySelector("[data-intro-audio]");
const introToggle = document.querySelector("[data-intro-toggle]");
const introLabel = document.querySelector("[data-intro-label]");
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

if (introAudio && introToggle) {
  const setIntroState = (isPlaying) => {
    introToggle.classList.toggle("is-playing", isPlaying);
    introToggle.setAttribute("aria-pressed", String(isPlaying));
    introToggle.setAttribute("aria-label", isPlaying ? "Pause intro music" : "Play intro music");

    if (introLabel) {
      introLabel.textContent = isPlaying ? "Pause intro" : "Play intro";
    }
  };

  const pauseIntro = (reset = false) => {
    introAudio.pause();

    if (reset) {
      try {
        introAudio.currentTime = 0;
      } catch (error) {
        // Some browsers block seeking before metadata is ready.
      }
    }

    setIntroState(false);
  };

  introToggle.addEventListener("click", async () => {
    if (!introAudio.paused) {
      pauseIntro();
      return;
    }

    try {
      await introAudio.play();
      setIntroState(true);
    } catch (error) {
      pauseIntro();
    }
  });

  introAudio.addEventListener("play", () => setIntroState(true));
  introAudio.addEventListener("pause", () => setIntroState(false));
  introAudio.addEventListener("ended", () => pauseIntro(true));

  playerToggles.forEach((button) => {
    button.addEventListener("click", () => pauseIntro(true));
  });

  if ("IntersectionObserver" in window && hero) {
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          pauseIntro(true);
        }
      });
    }, { threshold: [0, 0.35, 1] });

    introObserver.observe(hero);
  } else if (introPlayer) {
    window.addEventListener("scroll", () => {
      const bounds = introPlayer.getBoundingClientRect();
      const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;

      if (!isVisible) {
        pauseIntro(true);
      }
    }, { passive: true });
  }
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
      releaseList.dataset.activePlayer = platform;
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
