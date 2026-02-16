// blog.js — forum-like demo using localStorage

const LS_KEY = "krystory_forum_v1";

const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postBody = document.getElementById("postBody");
const postTag = document.getElementById("postTag");

const postList = document.getElementById("postList");
const thread = document.getElementById("thread");

const toast = document.getElementById("toast");
const clearAllBtn = document.getElementById("clearAllBtn");

const searchInput = document.getElementById("searchInput");
const filterTag = document.getElementById("filterTag");
const postCount = document.getElementById("postCount");

let state = loadState();
let selectedPostId = state.posts[0]?.id ?? null;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function nowISO() {
  return new Date().toISOString();
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => (toast.textContent = ""), 1800);
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed?.posts) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function seedState() {
  // optional: a tiny starter thread so the page doesn't look empty
  return {
    posts: [
      {
        id: uid(),
        title: "Welcome to Krystory community ✨",
        tag: "Story",
        body: "Share your intentions, questions, and crystal stories here. This is a demo forum page.",
        createdAt: nowISO(),
        comments: [
          { id: uid(), text: "First comment! Loving the vibe.", createdAt: nowISO() }
        ]
      }
    ]
  };
}

function getFilters() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  const tag = filterTag?.value || "All";
  return { q, tag };
}

function filteredPosts() {
  const { q, tag } = getFilters();
  return state.posts
    .filter((p) => (tag === "All" ? true : p.tag === tag))
    .filter((p) => {
      if (!q) return true;
      return (p.title + " " + p.body).toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderList() {
  const posts = filteredPosts();
  postCount.textContent = `${posts.length} posts`;

  postList.innerHTML = "";
  if (posts.length === 0) {
    postList.innerHTML = `<div class="post-item"><div class="muted">No posts found.</div></div>`;
    return;
  }

  posts.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post-item" + (p.id === selectedPostId ? " active" : "");
    el.tabIndex = 0;

    const preview = p.body.length > 80 ? p.body.slice(0, 80) + "…" : p.body;

    el.innerHTML = `
      <div class="post-meta">
        <span class="tag">${escapeHtml(p.tag)}</span>
        <span class="time">${formatTime(p.createdAt)}</span>
        <span class="time">• ${p.comments?.length || 0} comments</span>
      </div>
      <div class="post-title">${escapeHtml(p.title)}</div>
      <div class="post-preview">${escapeHtml(preview)}</div>
    `;

    el.addEventListener("click", () => {
      selectedPostId = p.id;
      render();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        selectedPostId = p.id;
        render();
      }
    });

    postList.appendChild(el);
  });
}

function renderThread() {
  const p = state.posts.find((x) => x.id === selectedPostId);
  if (!p) {
    thread.innerHTML = `<div class="thread-empty muted">Select a post to view comments.</div>`;
    return;
  }

  const comments = (p.comments || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  thread.innerHTML = `
    <div class="thread-head">
      <div>
        <div class="post-meta">
          <span class="tag">${escapeHtml(p.tag)}</span>
          <span class="time">${formatTime(p.createdAt)}</span>
        </div>
        <h3 class="thread-title">${escapeHtml(p.title)}</h3>
        <p class="thread-body">${escapeHtml(p.body).replaceAll("\n", "<br/>")}</p>
      </div>

      <div class="thread-actions">
        <button class="tiny-btn danger" id="deletePostBtn" type="button">Delete</button>
      </div>
    </div>

    <div class="comments" id="comments">
      ${comments.map(c => `
        <div class="comment">
          <div class="comment-meta">
            <span class="comment-time">${formatTime(c.createdAt)}</span>
            <button class="tiny-btn danger" data-del-comment="${c.id}" type="button">Delete</button>
          </div>
          <p class="comment-text">${escapeHtml(c.text).replaceAll("\n", "<br/>")}</p>
        </div>
      `).join("")}
      ${comments.length === 0 ? `<div class="muted">No comments yet. Be the first!</div>` : ""}
    </div>

    <form class="comment-form" id="commentForm">
      <label class="field">
        <span class="label">Add a comment</span>
        <textarea id="commentText" rows="3" maxlength="600" placeholder="Write something gentle..." required></textarea>
      </label>
      <div class="row">
        <button class="btn primary" type="submit">Comment</button>
        <div class="muted small">Be kind ✨</div>
      </div>
    </form>
  `;

  // delete post
  thread.querySelector("#deletePostBtn")?.addEventListener("click", () => {
    state.posts = state.posts.filter((x) => x.id !== p.id);
    saveState();
    selectedPostId = state.posts[0]?.id ?? null;
    showToast("Post deleted (demo).");
    render();
  });

  // delete comment
  thread.querySelectorAll("[data-del-comment]")?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cid = btn.getAttribute("data-del-comment");
      const post = state.posts.find((x) => x.id === selectedPostId);
      if (!post) return;
      post.comments = (post.comments || []).filter((c) => c.id !== cid);
      saveState();
      showToast("Comment deleted (demo).");
      renderThread();
      renderList();
    });
  });

  // add comment
  thread.querySelector("#commentForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const ta = thread.querySelector("#commentText");
    const text = (ta?.value || "").trim();
    if (!text) return;

    const post = state.posts.find((x) => x.id === selectedPostId);
    if (!post) return;

    post.comments = post.comments || [];
    post.comments.push({ id: uid(), text, createdAt: nowISO() });

    saveState();
    ta.value = "";
    showToast("Comment posted.");
    renderThread();
    renderList();
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Create post
postForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = postTitle.value.trim();
  const body = postBody.value.trim();
  const tag = postTag.value;

  if (!title || !body) return;

  const newPost = {
    id: uid(),
    title,
    tag,
    body,
    createdAt: nowISO(),
    comments: []
  };

  state.posts.push(newPost);
  saveState();

  postTitle.value = "";
  postBody.value = "";
  postTag.value = "Story";

  selectedPostId = newPost.id;

  showToast("Posted!");
  render();
});

// Clear demo data
clearAllBtn?.addEventListener("click", () => {
  localStorage.removeItem(LS_KEY);
  state = seedState();
  saveState();
  selectedPostId = state.posts[0]?.id ?? null;
  showToast("Cleared (demo).");
  render();
});

// Search & filter
searchInput?.addEventListener("input", () => renderList());
filterTag?.addEventListener("change", () => {
  // if current selection is filtered out, pick first in filtered list
  const posts = filteredPosts();
  if (!posts.some(p => p.id === selectedPostId)) {
    selectedPostId = posts[0]?.id ?? null;
  }
  render();
});

function render() {
  renderList();
  renderThread();
}

render();
