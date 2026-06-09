import { db } from "./firebase.js";

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const visitorCounterRef = doc(db, "siteStats", "visitors");

const VISITOR_SESSION_KEY = "yuruoriVisitorCountedSession";

function getTodayString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function getYesterdayString() {
  const now = new Date();
  now.setDate(now.getDate() - 1);

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

async function createVisitorCounterIfNeeded() {
  const snapshot = await getDoc(visitorCounterRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const today = getTodayString();

  const initialData = {
    total: 0,
    today: 0,
    yesterday: 0,
    currentDate: today,
    updatedAt: serverTimestamp()
  };

  await setDoc(visitorCounterRef, initialData);

  return initialData;
}

async function getVisitorCounterData() {
  const data = await createVisitorCounterIfNeeded();

  const today = getTodayString();

  if (data.currentDate === today) {
    return data;
  }

  const yesterdayValue = Number(data.today || 0);

  await updateDoc(visitorCounterRef, {
    today: 0,
    yesterday: yesterdayValue,
    currentDate: today,
    updatedAt: serverTimestamp()
  });

  const newSnapshot = await getDoc(visitorCounterRef);

  if (!newSnapshot.exists()) {
    return {
      total: 0,
      today: 0,
      yesterday: 0,
      currentDate: today
    };
  }

  return newSnapshot.data();
}

async function countVisitorOncePerSession() {
  const today = getTodayString();
  const sessionValue = sessionStorage.getItem(VISITOR_SESSION_KEY);

  if (sessionValue === today) {
    return getVisitorCounterData();
  }

  let data = await getVisitorCounterData();

  await updateDoc(visitorCounterRef, {
    total: increment(1),
    today: increment(1),
    updatedAt: serverTimestamp()
  });

  sessionStorage.setItem(VISITOR_SESSION_KEY, today);

  const updatedSnapshot = await getDoc(visitorCounterRef);

  if (!updatedSnapshot.exists()) {
    return data;
  }

  return updatedSnapshot.data();
}

function renderVisitorCounterData(data) {
  const total = Number(data.total || 0);
  const todayTotal = Number(data.today || 0);
  const yesterdayTotal = Number(data.yesterday || 0);

  if (visitorCount) {
    visitorCount.textContent = formatCounterNumber(total);
  }

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

async function setupVisitorCounter() {
  if (!visitorCount) return;

  visitorCount.textContent = "------";

  if (todayCount) {
    todayCount.textContent = "---";
  }

  if (yesterdayCount) {
    yesterdayCount.textContent = "---";
  }

  if (counterMessage) {
    counterMessage.textContent = "カウンターを読み込み中...";
  }

  try {
    const data = await countVisitorOncePerSession();
    renderVisitorCounterData(data);
  } catch (error) {
    console.error(error);

    if (counterMessage) {
      counterMessage.textContent = "カウンターの読み込みに失敗しました。";
    }
  }
}

setupSiteHeader();
setupSiteFooter();
setupMobileNav();
setupCurrentNav();

setupVisitorCounter();



function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}




const BLOCKED_WORDS = [
  "死ね",
  "しね",
  "消えろ",
  "ころす",
  "殺す",
  "kill yourself",
  "suicide",
  "http://spam",
  "https://spam"
];

const RECENT_POST_KEY = "yuruoriRecentPost";

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replaceAll("　", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsBlockedWord(text) {
  const normalizedText = normalizeText(text);

  return BLOCKED_WORDS.some((word) => {
    return normalizedText.includes(normalizeText(word));
  });
}

function countUrls(text) {
  const matches = String(text).match(/https?:\/\/[^\s]+/g);

  if (!matches) {
    return 0;
  }

  return matches.length;
}

function getRecentPostData() {
  const rawData = localStorage.getItem(RECENT_POST_KEY);

  if (!rawData) {
    return null;
  }

  try {
    return JSON.parse(rawData);
  } catch (error) {
    return null;
  }
}

function saveRecentPostData({ type, text }) {
  const data = {
    type,
    text: normalizeText(text),
    time: Date.now()
  };

  localStorage.setItem(RECENT_POST_KEY, JSON.stringify(data));
}

function isDuplicateRecentPost({ type, text }) {
  const recentPost = getRecentPostData();

  if (!recentPost) {
    return false;
  }

  const now = Date.now();
  const elapsed = now - Number(recentPost.time || 0);

  const isSameType = recentPost.type === type;
  const isSameText = recentPost.text === normalizeText(text);
  const isWithinShortTime = elapsed < 60 * 1000;

  return isSameType && isSameText && isWithinShortTime;
}

function validatePublicPost({ type, name, message, site = "" }) {
  const cleanName = String(name || "").trim();
  const cleanMessage = String(message || "").trim();
  const cleanSite = String(site || "").trim();

  if (!cleanMessage) {
    return {
      ok: false,
      message: "本文を入力してください。"
    };
  }

  if (cleanName.length > 40) {
    return {
      ok: false,
      message: "名前は40文字以内で入力してください。"
    };
  }

  if (cleanMessage.length > 300) {
    return {
      ok: false,
      message: "本文は300文字以内で入力してください。"
    };
  }

  if (containsBlockedWord(cleanName) || containsBlockedWord(cleanMessage)) {
    return {
      ok: false,
      message: "投稿できない言葉が含まれています。"
    };
  }

  if (countUrls(cleanMessage) >= 2) {
    return {
      ok: false,
      message: "本文にURLをたくさん入れることはできません。"
    };
  }

  if (cleanSite && countUrls(cleanSite) > 1) {
    return {
      ok: false,
      message: "URL欄には1つだけ入力してください。"
    };
  }

  if (isDuplicateRecentPost({ type, text: cleanMessage })) {
    return {
      ok: false,
      message: "同じ内容を連続で投稿することはできません。"
    };
  }

  return {
    ok: true,
    message: ""
  };
}





const clapButton = document.getElementById("clapButton");
const clapCount = document.getElementById("clapCount");
const clapResult = document.getElementById("clapResult");

const clapMessageForm = document.getElementById("clapMessageForm");
const clapName = document.getElementById("clapName");
const clapText = document.getElementById("clapText");
const clapFormStatus = document.getElementById("clapFormStatus");
const clapLogList = document.getElementById("clapLogList");

const clapCounterRef = doc(db, "siteStats", "clap");
const clapMessagesCollection = collection(db, "clapMessages");

const clapThanksMessages = [
  "拍手ありがとうございます！",
  "うれしいです。ゆるおりが少し元気になりました。",
  "ぱちぱち。今日もいい感じです。",
  "ありがとうございます。管理人がたぶん喜びます。",
  "拍手を受け取りました。よい一日を。",
  "応援感謝です。サイトをまた増築します。"
];

function getRandomClapThanksMessage() {
  const index = Math.floor(Math.random() * clapThanksMessages.length);
  return clapThanksMessages[index];
}

async function getClapTotal() {
  const snapshot = await getDoc(clapCounterRef);

  if (!snapshot.exists()) {
    await setDoc(clapCounterRef, {
      total: 0,
      updatedAt: serverTimestamp()
    });

    return 0;
  }

  const data = snapshot.data();
  return Number(data.total || 0);
}

async function renderClapCount() {
  if (!clapCount) return;

  try {
    const total = await getClapTotal();
    clapCount.textContent = String(total);
  } catch (error) {
    console.error(error);
    clapCount.textContent = "---";
  }
}

async function addClap() {
  const snapshot = await getDoc(clapCounterRef);

  if (!snapshot.exists()) {
    await setDoc(clapCounterRef, {
      total: 1,
      updatedAt: serverTimestamp()
    });

    return 1;
  }

  await updateDoc(clapCounterRef, {
    total: increment(1),
    updatedAt: serverTimestamp()
  });

  const newSnapshot = await getDoc(clapCounterRef);
  const data = newSnapshot.data();

  return Number(data.total || 0);
}

async function fetchClapLogs() {
  const clapQuery = query(
    clapMessagesCollection,
    orderBy("createdAt", "desc"),
    limit(20)
  );

  const snapshot = await getDocs(clapQuery);

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });
}

function formatClapDate(value) {
  if (!value) {
    return "日時不明";
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toLocaleString("ja-JP");
  }

  return String(value);
}

function renderClapItems(logs) {
  if (!clapLogList) return;

  if (logs.length === 0) {
    clapLogList.innerHTML = `<p class="empty-text">まだメッセージはありません。</p>`;
    return;
  }

  clapLogList.innerHTML = logs
    .map((log) => {
      return `
        <article class="clap-log-item">
          <div class="clap-log-head">
            <strong>${escapeHtml(log.name || "名無し")}</strong>
            <span>${escapeHtml(formatClapDate(log.createdAt))}</span>
          </div>
          <p>${escapeHtml(log.text || "")}</p>
        </article>
      `;
    })
    .join("");
}

async function renderClapLogs() {
  if (!clapLogList) return;

  clapLogList.innerHTML = `<p class="empty-text">読み込み中...</p>`;

  try {
    const logs = await fetchClapLogs();
    renderClapItems(logs);
  } catch (error) {
    console.error(error);
    clapLogList.innerHTML = `<p class="empty-text">拍手ログの読み込みに失敗しました。</p>`;
  }
}

async function addClapMessage({ name, text }) {
  await addDoc(clapMessagesCollection, {
    name,
    text,
    createdAt: serverTimestamp(),
    visible: true
  });
}

function setupClapButton() {
  if (!clapButton) return;

  renderClapCount();

  clapButton.addEventListener("click", async () => {
    clapButton.disabled = true;

    if (clapResult) {
      clapResult.textContent = "送信中...";
    }

    try {
      const total = await addClap();

      if (clapCount) {
        clapCount.textContent = String(total);
      }

      if (clapResult) {
        clapResult.textContent = getRandomClapThanksMessage();
      }

      clapButton.classList.remove("pop");
      void clapButton.offsetWidth;
      clapButton.classList.add("pop");
    } catch (error) {
      console.error(error);

      if (clapResult) {
        clapResult.textContent = "拍手の送信に失敗しました。時間を置いて試してください。";
      }
    } finally {
      clapButton.disabled = false;
    }
  });
}

function setupClapMessageForm() {
  if (!clapMessageForm) return;

  renderClapLogs();

  clapMessageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = clapName.value.trim() || "名無し";
    const text = clapText.value.trim();

    const validation = validatePublicPost({
      type: "clap",
      name,
      message: text
    });

    if (!validation.ok) {
      if (clapFormStatus) {
        clapFormStatus.textContent = validation.message;
      }

      return;
    }

    if (clapFormStatus) {
      clapFormStatus.textContent = "送信中...";
    }

    try {
      await addClapMessage({
        name,
        text
      });

      saveRecentPostData({
        type: "clap",
        text
      });

      clapText.value = "";

      if (clapFormStatus) {
        clapFormStatus.textContent = "メッセージを送信しました。";
      }

      await renderClapLogs();
    } catch (error) {
      console.error(error);

      if (clapFormStatus) {
        clapFormStatus.textContent = "送信に失敗しました。時間を置いて試してください。";
      }
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

const guestbookForm = document.getElementById("guestbookForm");
const guestName = document.getElementById("guestName");
const guestSite = document.getElementById("guestSite");
const guestMessage = document.getElementById("guestMessage");
const guestbookStatus = document.getElementById("guestbookStatus");
const guestbookList = document.getElementById("guestbookList");

const guestbookCollection = collection(db, "guestbook");

function isValidUrl(url) {
  if (!url) return true;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function formatGuestbookDate(value) {
  if (!value) {
    return "日時不明";
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toLocaleString("ja-JP");
  }

  return String(value);
}

async function fetchGuestbookLogs() {
  const guestbookQuery = query(
    guestbookCollection,
    orderBy("createdAt", "desc"),
    limit(30)
  );

  const snapshot = await getDocs(guestbookQuery);

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });
}

function renderGuestbookItems(logs) {
  if (!guestbookList) return;

  if (logs.length === 0) {
    guestbookList.innerHTML = `<p class="empty-text">まだ足あとはありません。</p>`;
    return;
  }

  guestbookList.innerHTML = logs
    .map((log) => {
      const siteHtml = log.site
        ? `<a href="${escapeHtml(log.site)}" target="_blank" rel="noopener noreferrer">サイト</a>`
        : `<span>サイトなし</span>`;

      return `
        <article class="guestbook-item">
          <div class="guestbook-head">
            <strong>${escapeHtml(log.name || "名無し")}</strong>
            <time>${escapeHtml(formatGuestbookDate(log.createdAt))}</time>
          </div>

          <p>${escapeHtml(log.message || "")}</p>

          <div class="guestbook-site">
            ${siteHtml}
          </div>
        </article>
      `;
    })
    .join("");
}

async function renderGuestbookLogs() {
  if (!guestbookList) return;

  guestbookList.innerHTML = `<p class="empty-text">読み込み中...</p>`;

  try {
    const logs = await fetchGuestbookLogs();
    renderGuestbookItems(logs);
  } catch (error) {
    console.error(error);
    guestbookList.innerHTML = `<p class="empty-text">足あと帳の読み込みに失敗しました。</p>`;
  }
}

async function addGuestbookLog({ name, site, message }) {
  await addDoc(guestbookCollection, {
    name,
    site,
    message,
    createdAt: serverTimestamp(),
    page: "guestbook",
    visible: true
  });
}

function setupGuestbook() {
  if (!guestbookForm) return;

  renderGuestbookLogs();

  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = guestName.value.trim() || "名無し";
    const site = guestSite.value.trim();
    const message = guestMessage.value.trim();

    const validation = validatePublicPost({
      type: "guestbook",
      name,
      message,
      site
    });

    if (!validation.ok) {
      if (guestbookStatus) {
        guestbookStatus.textContent = validation.message;
      }

      return;
    }

    if (!isValidUrl(site)) {
      if (guestbookStatus) {
        guestbookStatus.textContent = "URLは http:// または https:// から入力してください。";
      }

      return;
    }

    if (guestbookStatus) {
      guestbookStatus.textContent = "送信中...";
    }

    try {
      await addGuestbookLog({
        name,
        site,
        message
      });

      saveRecentPostData({
        type: "guestbook",
        text: message
      });

      guestMessage.value = "";

      if (guestbookStatus) {
        guestbookStatus.textContent = "足あとを残しました。";
      }

      await renderGuestbookLogs();
    } catch (error) {
      console.error(error);

      if (guestbookStatus) {
        guestbookStatus.textContent = "送信に失敗しました。時間を置いて試してください。";
      }
    }
  });
}
setupGuestbook();
