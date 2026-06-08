import { posts } from "./posts.js";
import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const postList = document.getElementById("postList");
const filterButtons = document.querySelectorAll(".filter-btn");

const reactionTemplates = [
  { key: "suki", label: "☕ すき" },
  { key: "kawaii", label: "🎨 かわいい" },
  { key: "mood", label: "🌙 雰囲気いい" },
  { key: "genius", label: "⚡ 天才か？" },
  { key: "seen", label: "👀 見たよ" },
  { key: "support", label: "🫶 応援" }
];

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLikedKey(postId) {
  return `yuruori_liked_${postId}`;
}

function getReactedKey(postId, reactionKey) {
  return `yuruori_reacted_${postId}_${reactionKey}`;
}

async function getPostStats(postId) {
  const ref = doc(db, "postStats", postId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      likes: 0,
      reactions: {}
    };
  }

  const data = snap.data();

  return {
    likes: data.likes || 0,
    reactions: data.reactions || {}
  };
}

async function ensurePostStats(postId) {
  const ref = doc(db, "postStats", postId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      likes: 0,
      reactions: {}
    });
  }
}

async function renderPosts(filter = "all") {
  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter(post => post.type === filter);

  if (filteredPosts.length === 0) {
    postList.innerHTML = `<p class="empty-message">まだ投稿がありません。</p>`;
    return;
  }

  postList.innerHTML = filteredPosts.map(post => {
    const postId = escapeHtml(post.id);
    const title = escapeHtml(post.title);
    const text = escapeHtml(post.text);
    const date = escapeHtml(post.date);
    const type = escapeHtml(post.type);
    const image = post.image ? escapeHtml(post.image) : "";

    const tags = post.tags
      .map(tag => `<span>#${escapeHtml(tag)}</span>`)
      .join("");

    const reactions = reactionTemplates.map(reaction => {
      return `
        <button
          class="reaction-btn"
          data-post-id="${postId}"
          data-reaction="${reaction.key}"
        >
          ${reaction.label}
          <span class="reaction-count" data-count="${postId}-${reaction.key}">0</span>
        </button>
      `;
    }).join("");

    const likedClass = localStorage.getItem(getLikedKey(post.id)) ? "liked" : "";

    return `
      <article class="post-card" data-post-id="${postId}">
        <div class="post-head">
          <span class="post-type ${type}">${type}</span>
          <time>${date}</time>
        </div>

        <h3>${title}</h3>
        <p>${text}</p>

        ${
          image
            ? `<img src="${image}" alt="${title}" class="post-image" />`
            : ""
        }

        <div class="post-tags">
          ${tags}
        </div>

        <div class="post-actions">
          <button class="like-btn ${likedClass}" data-post-id="${postId}">
            ♡ いいね
            <span class="like-count" data-like-count="${postId}">0</span>
          </button>
        </div>

        <div class="reaction-area">
          <p class="reaction-title">テンプレコメント</p>
          <div class="reaction-buttons">
            ${reactions}
          </div>
        </div>
      </article>
    `;
  }).join("");

  await loadAllStats(filteredPosts);
  setupPostButtons();
}

async function loadAllStats(targetPosts) {
  for (const post of targetPosts) {
    const stats = await getPostStats(post.id);

    const likeCount = document.querySelector(`[data-like-count="${post.id}"]`);

    if (likeCount) {
      likeCount.textContent = stats.likes;
    }

    reactionTemplates.forEach(reaction => {
      const countElement = document.querySelector(
        `[data-count="${post.id}-${reaction.key}"]`
      );

      if (countElement) {
        countElement.textContent = stats.reactions[reaction.key] || 0;
      }
    });
  }
}

function setupPostButtons() {
  const likeButtons = document.querySelectorAll(".like-btn");
  const reactionButtons = document.querySelectorAll(".reaction-btn");

  likeButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const postId = button.dataset.postId;
      const likedKey = getLikedKey(postId);

      if (localStorage.getItem(likedKey)) {
        alert("この投稿にはもういいね済みです。");
        return;
      }

      await ensurePostStats(postId);

      const ref = doc(db, "postStats", postId);

      await updateDoc(ref, {
        likes: increment(1)
      });

      localStorage.setItem(likedKey, "true");
      button.classList.add("liked");

      const countElement = document.querySelector(`[data-like-count="${postId}"]`);
      countElement.textContent = Number(countElement.textContent) + 1;
    });
  });

  reactionButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const postId = button.dataset.postId;
      const reactionKey = button.dataset.reaction;
      const reactedKey = getReactedKey(postId, reactionKey);

      if (localStorage.getItem(reactedKey)) {
        alert("このリアクションはもう押しています。");
        return;
      }

      await ensurePostStats(postId);

      const ref = doc(db, "postStats", postId);

      await updateDoc(ref, {
        [`reactions.${reactionKey}`]: increment(1)
      });

      localStorage.setItem(reactedKey, "true");

      const countElement = document.querySelector(
        `[data-count="${postId}-${reactionKey}"]`
      );

      countElement.textContent = Number(countElement.textContent) + 1;
    });
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    renderPosts(filter);
  });
});

renderPosts();
