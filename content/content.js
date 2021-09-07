async function setup() {
  const { disable_extension } = await new Promise((resolve) => chrome.storage.sync.get('disable_extension', (value) => resolve(value)));

  if (disable_extension) return;

  const { click_disable } = await new Promise((resolve) => chrome.storage.sync.get('click_disable', (value) => resolve(value)));

  if (click_disable) {
    chrome.storage.sync.set({ click_disable: false }, () => {
      console.warn("setted", { click_disable: false })
    });
    return;
  }

  const { blacklist: websiteBlacklist } = await new Promise((resolve) => chrome.storage.sync.get('blacklist', (value) => resolve(value)));

  if (!websiteBlacklist) return;

  if (!websiteBlacklist.includes(window.location.hostname)) return;

  /* TRANSFORM THE PAGE IN THE 404 PAGE */
  document.body.innerHTML = htmlPage;
  document.head.innerHTML = cssPage;

  /* CLICK TO RETURN TO NORMAL */
  document.querySelector('body').addEventListener('click', async (e) => {
    chrome.storage.sync.set({ click_disable: true }, () => {
      console.warn("setted", { click_disable: true })
    });
    
    location.reload();
  });
}

function draw() { }

/* 404 PAGE */
const htmlPage = `
<!-- Author: Robin Selmer -->
<div class="noise"></div>
<div class="overlay"></div>
<div class="terminal">
  <h1>Error <span class="errorcode">404</span></h1>
  <p class="output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
  <p class="output">Please try to <a href="#1">go back</a> or <a href="#2">return to the homepage</a>.</p>
  <p class="output">Good luck.</p>
</div>`;

const cssPage = `<style>
@import 'https://fonts.googleapis.com/css?family=Inconsolata';

html {
  min-height: 100%;
}

* {
    overflow: hidden;
}

body {
  box-sizing: border-box;
  height: 100%;
  background-color: #000000;
  background-image: radial-gradient(#11581E, #041607), url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif");
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Inconsolata', Helvetica, sans-serif;
  font-size: 1.5rem;
  color: rgba(128, 255, 128, 0.8);
  text-shadow:
    0 0 1ex rgba(51, 255, 51, 1),
    0 0 2px rgba(255, 255, 255, 0.8);
}

.noise {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif");
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
  opacity: .02;
}

.overlay {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%);
  background-size: auto 4px;
  z-index: 1;
}

.overlay::before {
  content: "";
  pointer-events: none;
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(0deg,
      transparent 0%,
      rgba(32, 128, 32, 0.2) 2%,
      rgba(32, 128, 32, 0.8) 3%,
      rgba(32, 128, 32, 0.2) 3%,
      transparent 100%);
  background-repeat: no-repeat;
  animation: scan 7.5s linear 0s infinite;
}

@keyframes scan {
  0% {
    background-position: 0 -100vh;
  }

  35%,
  100% {
    background-position: 0 100vh;
  }
}

.terminal {
  box-sizing: inherit;
  position: absolute;
  height: 100%;
  width: 1000px;
  max-width: 100%;
  padding: 4rem;
  text-transform: uppercase;
}

.output {
  color: rgba(128, 255, 128, 0.8);
  text-shadow:
    0 0 1px rgba(51, 255, 51, 0.4),
    0 0 2px rgba(255, 255, 255, 0.8);
}

.output::before {
  content: "> ";
}

a {
  color: #fff;
  text-decoration: none;
}

a::before {
  content: "[";
}

a::after {
  content: "]";
}

.errorcode {
  color: white;
}
</style>`;
