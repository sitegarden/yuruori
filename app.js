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

const visitorCount = document.getElementById("visitorCount");
const todayCount = document.getElementById("todayCount");
const yesterdayCount = document.getElementById("yesterdayCount");
const counterMessage = document.getElementById("counterMessage");

const VISITOR_TOTAL_KEY = "yuruoriVisitorTotal";
const VISITOR_LAST_DATE_KEY = "yuruoriVisitorLastDate";
const VISITOR_TODAY_KEY = "yuruoriVisitorToday";
const VISITOR_YESTERDAY_KEY = "yuruoriVisitorYesterday";

function getTodayString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function formatCounterNumber(number) {
  return String(number).padStart(6, "0");
}

function getCounterMessage(total) {
  if (total === 1) {
    return "初めての訪問者です。ようこそ！";
  }

  if (total % 1000 === 0) {
    return "すごいキリ番です。記念にスクショしてもいいかも。";
  }

  if (total % 100 === 0) {
    return "キリ番です。ちょっと嬉しい。";
  }

  if (total % 111 === 0) {
    return "ゾロ目っぽい番号です。いい感じ。";
  }

  if (String(total).endsWith("777")) {
    return "ラッキーセブンです。今日は運がいいかも。";
  }

  return "ようこそ、ゆるおりへ。";
}

function setupVisitorCounter() {
  if (!visitorCount) return;

  const today = getTodayString();
  const lastDate = localStorage.getItem(VISITOR_LAST_DATE_KEY);

  let total = Number(localStorage.getItem(VISITOR_TOTAL_KEY) || "0");
  let todayTotal = Number(localStorage.getItem(VISITOR_TODAY_KEY) || "0");
  let yesterdayTotal = Number(localStorage.getItem(VISITOR_YESTERDAY_KEY) || "0");

  if (lastDate !== today) {
    yesterdayTotal = todayTotal;
    todayTotal = 0;

    localStorage.setItem(VISITOR_YESTERDAY_KEY, String(yesterdayTotal));
    localStorage.setItem(VISITOR_LAST_DATE_KEY, today);
  }

  total += 1;
  todayTotal += 1;

  localStorage.setItem(VISITOR_TOTAL_KEY, String(total));
  localStorage.setItem(VISITOR_TODAY_KEY, String(todayTotal));
  localStorage.setItem(VISITOR_LAST_DATE_KEY, today);

  visitorCount.textContent = formatCounterNumber(total);

  if (todayCount) {
    todayCount.textContent = String(todayTotal);
  }

  if (yesterdayCount) {
    yesterdayCount.textContent = String(yesterdayTotal);
  }

  if (counterMessage) {
    counterMessage.textContent = getCounterMessage(total);
  }
}

setupVisitorCounter();

setupSiteHeader();
setupSiteFooter();
setupMobileNav();
setupCurrentNav();
