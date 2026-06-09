const siteHeader = document.getElementById("siteHeader");
const siteFooter = document.getElementById("siteFooter");

function getRootPath() {
  const path = location.pathname;

  if (path.includes("/pages/") || path.includes("/play/")) {
    return "../";
  }

  return "";
}

const rootPath = getRootPath();

const navLinks = [
  { label: "HOME", url: "index.html" },
  { label: "ABOUT", url: "pages/about.html" },
  { label: "PROFILE", url: "pages/profile.html" },
  { label: "WORKS", url: "pages/works.html" },
  { label: "GAMES", url: "pages/games.html" },
  { label: "OCFA", url: "pages/ocfa.html" },
  { label: "DIARY", url: "pages/diary.html" },
  { label: "LINK", url: "pages/links.html" }
];

function makeUrl(url) {
  return `${rootPath}${url}`;
}

function normalizePath(path) {
  let normalized = path;

  if (normalized.endsWith("/")) {
    normalized += "index.html";
  }

  return normalized;
}

function setupSiteHeader() {
  if (!siteHeader) return;

  const navHtml = navLinks
    .map((link) => {
      const fullUrl = makeUrl(link.url);
      return `<a href="${fullUrl}">${link.label}</a>`;
    })
    .join("");

  siteHeader.innerHTML = `
    <header class="site-header">
      <a class="site-logo" href="${makeUrl("index.html")}" aria-label="ゆるおり HOME">
        <span class="logo-mark">✦</span>
        <span class="logo-text">ゆるおり</span>
      </a>

      <button class="nav-toggle" type="button" id="navToggle" aria-label="メニューを開く">
        MENU
      </button>

      <nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        ${navHtml}
      </nav>
    </header>
  `;
}

function setupSiteFooter() {
  if (!siteFooter) return;

  siteFooter.innerHTML = `
    <footer class="site-footer">
      <p class="footer-logo">ゆるおり</p>
      <p>創作と遊びを置いておく場所。</p>

      <p class="footer-links">
        <a href="${makeUrl("index.html")}">HOME</a>
        <span>/</span>
        <a href="${makeUrl("pages/about.html")}">ABOUT</a>
        <span>/</span>
        <a href="${makeUrl("pages/works.html")}">WORKS</a>
        <span>/</span>
        <a href="${makeUrl("play/index.html")}">EXPLORE</a>
      </p>

      <p class="footer-small">© ゆるおり</p>
    </footer>
  `;
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");

    if (siteNav.classList.contains("open")) {
      navToggle.textContent = "CLOSE";
      navToggle.setAttribute("aria-label", "メニューを閉じる");
    } else {
      navToggle.textContent = "MENU";
      navToggle.setAttribute("aria-label", "メニューを開く");
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.textContent = "MENU";
      navToggle.setAttribute("aria-label", "メニューを開く");
    });
  });
}

function setupCurrentNav() {
  const siteNav = document.getElementById("siteNav");

  if (!siteNav) return;

  const currentPath = normalizePath(location.pathname);
  const links = siteNav.querySelectorAll("a");

  links.forEach((link) => {
    const linkUrl = new URL(link.getAttribute("href"), location.href);
    const linkPath = normalizePath(linkUrl.pathname);

    if (currentPath === linkPath) {
      link.classList.add("current");
    }
  });
}

setupSiteHeader();
setupSiteFooter();
setupMobileNav();
setupCurrentNav();
