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
  { label: "LINK", url: "pages/links.html" },
  { label: "EXPLORE", url: "play/index.html" }
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

const clapButton = document.getElementById("clapButton");
const clapCount = document.getElementById("clapCount");
const clapResult = document.getElementById("clapResult");

const clapMessageForm = document.getElementById("clapMessageForm");
const clapName = document.getElementById("clapName");
const clapText = document.getElementById("clapText");
const clapFormStatus = document.getElementById("clapFormStatus");
const clapLogList = document.getElementById("clapLogList");

const CLAP_COUNT_KEY = "yuruoriClapCount";
const CLAP_LOG_KEY = "yuruoriClapLogs";

const clapMessages = [
  "拍手ありがとうございます！",
  "うれしいです。ゆるおりが少し元気になりました。",
  "ぱちぱち。今日もいい感じです。",
  "ありがとうございます。管理人がたぶん喜びます。",
  "拍手を受け取りました。よい一日を。",
  "応援感謝です。サイトをまた増築します。"
];

function getClapCount() {
  return Number(localStorage.getItem(CLAP_COUNT_KEY) || "0");
}

function saveClapCount(count) {
  localStorage.setItem(CLAP_COUNT_KEY, String(count));
}

function getClapLogs() {
  const rawLogs = localStorage.getItem(CLAP_LOG_KEY);

  if (!rawLogs) {
    return [];
  }

  try {
    const logs = JSON.parse(rawLogs);

    if (Array.isArray(logs)) {
      return logs;
    }

    return [];
  } catch (error) {
    return [];
  }
}

function saveClapLogs(logs) {
  localStorage.setItem(CLAP_LOG_KEY, JSON.stringify(logs));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRandomClapMessage() {
  const index = Math.floor(Math.random() * clapMessages.length);
  return clapMessages[index];
}

function renderClapCount() {
  if (!clapCount) return;

  clapCount.textContent = String(getClapCount());
}

function renderClapLogs() {
  if (!clapLogList) return;

  const logs = getClapLogs();

  if (logs.length === 0) {
    clapLogList.innerHTML = `<p class="empty-text">まだメッセージはありません。</p>`;
    return;
  }

  clapLogList.innerHTML = logs
    .map((log) => {
      return `
        <article class="clap-log-item">
          <div class="clap-log-head">
            <strong>${escapeHtml(log.name)}</strong>
            <span>${escapeHtml(log.date)}</span>
          </div>
          <p>${escapeHtml(log.text)}</p>
        </article>
      `;
    })
    .join("");
}

function setupClapButton() {
  if (!clapButton) return;

  renderClapCount();

  clapButton.addEventListener("click", () => {
    const nextCount = getClapCount() + 1;

    saveClapCount(nextCount);
    renderClapCount();

    if (clapResult) {
      clapResult.textContent = getRandomClapMessage();
    }

    clapButton.classList.remove("pop");
    void clapButton.offsetWidth;
    clapButton.classList.add("pop");
  });
}

function setupClapMessageForm() {
  if (!clapMessageForm) return;

  renderClapLogs();

  clapMessageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = clapName.value.trim() || "名無し";
    const text = clapText.value.trim();

    if (!text) {
      if (clapFormStatus) {
        clapFormStatus.textContent = "メッセージを入力してください。";
      }

      return;
    }

    const logs = getClapLogs();

    const newLog = {
      name,
      text,
      date: new Date().toLocaleString("ja-JP")
    };

    logs.unshift(newLog);

    saveClapLogs(logs.slice(0, 20));
    renderClapLogs();

    clapText.value = "";

    if (clapFormStatus) {
      clapFormStatus.textContent = "メッセージを送信しました。";
    }
  });
}

setupClapButton();
setupClapMessageForm();



const fortuneButton = document.getElementById("fortuneButton");
const fortuneTitle = document.getElementById("fortuneTitle");
const fortuneText = document.getElementById("fortuneText");
const luckyColor = document.getElementById("luckyColor");
const luckyItem = document.getElementById("luckyItem");
const luckyPage = document.getElementById("luckyPage");
const luckyWord = document.getElementById("luckyWord");

const fortunes = [
  {
    title: "大吉",
    text: "今日はかなりいい感じ。気になっていたページを増やすと進みそうです。",
    color: "ピンク",
    item: "紅茶",
    page: "探検入口",
    word: "勢いで作ると案外うまくいく"
  },
  {
    title: "中吉",
    text: "ほどよく良い日。無理せず、ひとつだけ進めると満足できます。",
    color: "水色",
    item: "メモ帳",
    page: "日記",
    word: "少し進めば十分"
  },
  {
    title: "小吉",
    text: "小さな発見がありそうな日。リンクを押した先にヒントがあるかもしれません。",
    color: "クリーム色",
    item: "小さいリンク",
    page: "リンク集",
    word: "寄り道も成果"
  },
  {
    title: "吉",
    text: "いつも通りがちょうどいい日。急がず、好きなところから触るのが良さそうです。",
    color: "黄緑",
    item: "猫の画像",
    page: "プロフィール",
    word: "普通に良い"
  },
  {
    title: "末吉",
    text: "まだ準備中のものが気になる日。完成していなくても、置き場を作るだけで前進です。",
    color: "薄紫",
    item: "工事中の札",
    page: "作品一覧",
    word: "未完成でも置いていい"
  },
  {
    title: "凶",
    text: "今日はナビやCSSが暴れやすい日。大きな修正をする前に、バックアップを取ると安心です。",
    color: "グレー",
    item: "バックアップ",
    page: "Web拍手",
    word: "一回保存しよう"
  },
  {
    title: "謎",
    text: "よく分からない日。こういう日は、よく分からないページを作ると逆に合っています。",
    color: "虹色",
    item: "謎のボタン",
    page: "隠しページ",
    word: "意味はあとから生える"
  }
];

function getRandomFortune() {
  const index = Math.floor(Math.random() * fortunes.length);
  return fortunes[index];
}

function setupFortune() {
  if (!fortuneButton) return;

  fortuneButton.addEventListener("click", () => {
    const fortune = getRandomFortune();

    if (fortuneTitle) {
      fortuneTitle.textContent = fortune.title;
    }

    if (fortuneText) {
      fortuneText.textContent = fortune.text;
    }

    if (luckyColor) {
      luckyColor.textContent = fortune.color;
    }

    if (luckyItem) {
      luckyItem.textContent = fortune.item;
    }

    if (luckyPage) {
      luckyPage.textContent = fortune.page;
    }

    if (luckyWord) {
      luckyWord.textContent = fortune.word;
    }

    fortuneButton.classList.remove("pop");
    void fortuneButton.offsetWidth;
    fortuneButton.classList.add("pop");
  });
}

setupFortune();
