// // ─── DOM references ──────────────────────────────────────────────────────────
// const input          = document.getElementById("songInput");
// const btn            = document.getElementById("recommendBtn");
// const errorMsg       = document.getElementById("error-msg");
// const loader         = document.getElementById("loader");
// const resultSection  = document.getElementById("results-section");
// const resultTitle    = document.getElementById("results-title");
// const list           = document.getElementById("recommendations");
// const autocompleteList = document.getElementById("autocomplete-list");


// // ─── Autocomplete ─────────────────────────────────────────────────────────────

// let allSongs = [];   // fetched once from /songs

// // Fetch all song titles for autocomplete
// fetch("/songs")
//     .then(r => r.json())
//     .then(data => { allSongs = data; })
//     .catch(() => {});   // non-critical — autocomplete just won't appear

// input.addEventListener("input", function () {
//     const query = this.value.trim().toLowerCase();
//     autocompleteList.innerHTML = "";

//     if (!query || query.length < 2) {
//         autocompleteList.classList.add("hidden");
//         return;
//     }

//     const matches = allSongs
//         .filter(s => s.title.toLowerCase().includes(query))
//         .slice(0, 6);

//     if (matches.length === 0) {
//         autocompleteList.classList.add("hidden");
//         return;
//     }

//     matches.forEach(song => {
//         const li = document.createElement("li");
//         li.innerHTML = `<strong>${song.title}</strong><span>${song.artist}</span>`;
//         li.addEventListener("click", () => {
//             input.value = song.title;
//             autocompleteList.innerHTML = "";
//             autocompleteList.classList.add("hidden");
//             fetchRecommendations(song.title);
//         });
//         autocompleteList.appendChild(li);
//     });

//     autocompleteList.classList.remove("hidden");
// });

// // Close autocomplete on outside click
// document.addEventListener("click", (e) => {
//     if (!e.target.closest(".search-box") && !e.target.closest("#autocomplete-list")) {
//         autocompleteList.classList.add("hidden");
//     }
// });


// // ─── Search trigger ───────────────────────────────────────────────────────────

// btn.addEventListener("click", () => {
//     const song = input.value.trim();
//     if (!song) {
//         showError("Please enter a song name.");
//         return;
//     }
//     fetchRecommendations(song);
// });

// // Allow Enter key to trigger search
// input.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//         autocompleteList.classList.add("hidden");
//         btn.click();
//     }
//     if (e.key === "Escape") {
//         autocompleteList.classList.add("hidden");
//     }
// });


// // ─── Fetch recommendations ───────────────────────────────────────────────────

// function fetchRecommendations(songName) {
//     // Reset UI
//     hideError();
//     list.innerHTML = "";
//     resultSection.classList.add("hidden");
//     showLoader(true);
//     btn.disabled = true;

//     fetch(`/recommend?song=${encodeURIComponent(songName)}`)
//         .then(response => {
//             return response.json().then(data => ({ status: response.status, data }));
//         })
//         .then(({ status, data }) => {
//             if (status !== 200 || data.error) {
//                 showError(data.error || "Something went wrong.");
//                 return;
//             }

//             const recs = data.recommendations;

//             if (!recs || recs.length === 0) {
//                 showError("No recommendations found for this song.");
//                 return;
//             }

//             renderRecommendations(songName, recs);
//         })
//         .catch(() => {
//             showError("Could not connect to the server. Make sure Flask is running.");
//         })
//         .finally(() => {
//             showLoader(false);
//             btn.disabled = false;
//         });
// }


// // ─── Render results ───────────────────────────────────────────────────────────

// function renderRecommendations(seedSong, recs) {
//     resultTitle.textContent = `Songs similar to "${seedSong}"`;
//     list.innerHTML = "";

//     recs.forEach((rec, i) => {
//         const pct = (rec.score * 100).toFixed(1);

//         const li = document.createElement("li");
//         li.classList.add("song-card");
//         li.style.animationDelay = `${i * 60}ms`;

//         li.innerHTML = `
//             <span class="rank">#${i + 1}</span>
//             <div class="song-info">
//                 <span class="song-title">${escapeHtml(rec.title)}</span>
//                 <span class="song-artist">${escapeHtml(rec.artist)}</span>
//             </div>
//             <div class="match-badge">
//                 <div class="match-bar">
//                     <div class="match-fill" style="width: ${pct}%"></div>
//                 </div>
//                 <span class="match-label">${pct}% match</span>
//             </div>
//         `;

//         list.appendChild(li);
//     });

//     resultSection.classList.remove("hidden");
// }


// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function showError(msg) {
//     errorMsg.textContent = `⚠️  ${msg}`;
//     errorMsg.classList.remove("hidden");
// }

// function hideError() {
//     errorMsg.classList.add("hidden");
// }

// function showLoader(show) {
//     loader.classList.toggle("hidden", !show);
// }

// function escapeHtml(str) {
//     return str
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;");
// }

// ── Data cache ────────────────────────────────────────
// let allSongs = [];

// // Genre config
// const GENRE_CONFIG = {
//   "Romantic":       { emoji: "💕", cls: "genre-romantic" },
//   "Sad":            { emoji: "💧", cls: "genre-sad"      },
//   "Party / Dance":  { emoji: "🎉", cls: "genre-party"    },
//   "Devotional":     { emoji: "🙏", cls: "genre-devotional"},
//   "Peppy / Upbeat": { emoji: "⚡", cls: "genre-peppy"    },
//   "Sufi / Folk":    { emoji: "🎻", cls: "genre-sufi"     },
// };

// const MOOD_CONFIG = {
//   "Calm":        "😌",
//   "Happy":       "😄",
//   "Intense":     "🔥",
//   "Melancholic": "🌧️",
//   "Romantic":    "🌹",
//   "Energetic":   "💃",
// };

// // Cover colours per genre
// const COVER_COLORS = {
//   "Romantic":       ["#4a1060","#7a1090"],
//   "Sad":            ["#1a3060","#0d1f40"],
//   "Party / Dance":  ["#503000","#7a4a00"],
//   "Devotional":     ["#2d4a10","#1a2d00"],
//   "Peppy / Upbeat": ["#4a2060","#2d1a30"],
//   "Sufi / Folk":    ["#2d3a50","#1a2030"],
// };

// function coverStyle(genre) {
//   const c = COVER_COLORS[genre] || ["#252545","#1e1e3a"];
//   return `background: linear-gradient(135deg, ${c[0]}, ${c[1]});`;
// }

// function genreEmoji(genre) {
//   return (GENRE_CONFIG[genre] || {}).emoji || "🎵";
// }

// function escHtml(s) {
//   return String(s)
//     .replace(/&/g,"&amp;").replace(/</g,"&lt;")
//     .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
// }

// // ── Boot ─────────────────────────────────────────────
// window.addEventListener("DOMContentLoaded", () => {
//   loadStats();
//   loadAllSongs();
//   setupSearch();
//   setupGlobalSearch();

//   // Pre-fill genre/mood filter dropdowns
//   fetch("/genres").then(r=>r.json()).then(genres => {
//     const sel = document.getElementById("browseGenreFilter");
//     genres.forEach(g => {
//       const o = document.createElement("option");
//       o.value = g.genre; o.textContent = g.genre;
//       sel.appendChild(o);
//     });
//   });
//   fetch("/moods").then(r=>r.json()).then(moods => {
//     const sel = document.getElementById("browseMoodFilter");
//     moods.forEach(m => {
//       const o = document.createElement("option");
//       o.value = m.mood; o.textContent = m.mood;
//       sel.appendChild(o);
//     });
//   });
// });

// // ── Stats ─────────────────────────────────────────────
// function loadStats() {
//   fetch("/stats").then(r=>r.json()).then(d => {
//     document.getElementById("stat-songs").textContent   = d.total_songs;
//     document.getElementById("stat-artists").textContent = d.total_artists;
//     document.getElementById("stat-genres").textContent  = d.total_genres;
//   });
// }

// // ── All songs cache ───────────────────────────────────
// function loadAllSongs() {
//   fetch("/songs").then(r=>r.json()).then(d => { allSongs = d; });
// }

// // ── Section switching ─────────────────────────────────
// function showSection(name, btn) {
//   document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
//   document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
//   document.getElementById("section-" + name).classList.add("active");
//   btn.classList.add("active");

//   if (name === "browse")  loadBrowse();
//   if (name === "genres")  loadGenres();
//   if (name === "moods")   loadMoods();
// }

// // ── Sidebar toggle (mobile) ───────────────────────────
// function toggleSidebar() {
//   document.getElementById("sidebar").classList.toggle("open");
// }
// document.addEventListener("click", e => {
//   const sb = document.getElementById("sidebar");
//   if (window.innerWidth <= 760 && !sb.contains(e.target) &&
//       e.target.id !== "menuBtn") sb.classList.remove("open");
// });

// // ── Discover: search & recommend ─────────────────────
// function setupSearch() {
//   const input = document.getElementById("songInput");
//   const btn   = document.getElementById("recommendBtn");
//   const acList= document.getElementById("autocomplete-list");

//   input.addEventListener("input", () => {
//     const q = input.value.trim().toLowerCase();
//     acList.innerHTML = "";
//     if (q.length < 2) { acList.classList.add("hidden"); return; }
//     const hits = allSongs.filter(s => s.title.toLowerCase().includes(q)).slice(0,7);
//     if (!hits.length) { acList.classList.add("hidden"); return; }
//     hits.forEach(s => {
//       const li = document.createElement("li");
//       li.innerHTML = `<strong>${escHtml(s.title)}</strong><span>${escHtml(s.artist)}</span>`;
//       li.onclick = () => { input.value = s.title; acList.innerHTML=""; acList.classList.add("hidden"); doRecommend(s.title); };
//       acList.appendChild(li);
//     });
//     acList.classList.remove("hidden");
//   });

//   input.addEventListener("keydown", e => {
//     if (e.key === "Enter") { acList.classList.add("hidden"); doRecommend(input.value.trim()); }
//     if (e.key === "Escape") acList.classList.add("hidden");
//   });

//   btn.onclick = () => doRecommend(input.value.trim());

//   document.addEventListener("click", e => {
//     if (!e.target.closest(".search-card")) acList.classList.add("hidden");
//   });
// }

// function doRecommend(songName) {
//   if (!songName) return;
//   const errEl    = document.getElementById("error-msg");
//   const loaderEl = document.getElementById("loader");
//   const areaEl   = document.getElementById("results-area");
//   const btn      = document.getElementById("recommendBtn");

//   errEl.classList.add("hidden");
//   areaEl.classList.add("hidden");
//   loaderEl.classList.remove("hidden");
//   btn.disabled = true;

//   // spin the vinyl
//   document.getElementById("vinyl").classList.remove("paused");

//   fetch(`/recommend?song=${encodeURIComponent(songName)}`)
//     .then(r => r.json().then(d => ({status: r.status, d})))
//     .then(({status, d}) => {
//       loaderEl.classList.add("hidden");
//       btn.disabled = false;
//       if (d.error) { errEl.textContent = "⚠️ " + d.error; errEl.classList.remove("hidden"); return; }
//       renderResults(d.seed, d.recommendations);
//     })
//     .catch(() => {
//       loaderEl.classList.add("hidden");
//       btn.disabled = false;
//       errEl.textContent = "⚠️ Could not connect. Is Flask running?";
//       errEl.classList.remove("hidden");
//     });
// }

// function renderResults(seed, recs) {
//   // Seed card
//   const seedEl = document.getElementById("seed-card");
//   seedEl.innerHTML = `
//     <div class="seed-cover" style="${coverStyle(seed.genre)}">${genreEmoji(seed.genre)}</div>
//     <div class="seed-info">
//       <h3>${escHtml(seed.title)}</h3>
//       <p>by ${escHtml(seed.artist)}</p>
//       <div class="seed-badges">
//         <span class="badge badge-genre">${escHtml(seed.genre)}</span>
//         <span class="badge badge-mood">${escHtml(seed.mood)}</span>
//         <span class="badge badge-tempo">♩ ${seed.tempo} BPM</span>
//       </div>
//     </div>`;

//   // Rec cards
//   const grid = document.getElementById("rec-grid");
//   grid.innerHTML = "";
//   recs.forEach((r, i) => {
//     const pct = (r.score * 100).toFixed(1);
//     const card = document.createElement("div");
//     card.className = "rec-card";
//     card.style.animationDelay = `${i * 80}ms`;
//     card.innerHTML = `
//       <div class="rec-cover" style="${coverStyle(r.genre)}">${genreEmoji(r.genre)}</div>
//       <div class="rec-body">
//         <div class="rec-title">${escHtml(r.title)}</div>
//         <div class="rec-artist">${escHtml(r.artist)}</div>
//         <div class="seed-badges">
//           <span class="badge badge-genre">${escHtml(r.genre)}</span>
//           <span class="badge badge-mood">${escHtml(r.mood)}</span>
//         </div>
//         <div class="rec-footer">
//           <span class="match-pct">${pct}% match</span>
//           <span class="badge badge-tempo">♩ ${r.tempo}</span>
//         </div>
//         <div class="match-bar-wrap">
//           <div class="match-bar-fill" style="width:${pct}%"></div>
//         </div>
//       </div>`;
//     // Click a rec card → search for it
//     card.onclick = () => {
//       document.getElementById("songInput").value = r.title;
//       doRecommend(r.title);
//       window.scrollTo({top: 0, behavior: "smooth"});
//     };
//     grid.appendChild(card);
//   });

//   document.getElementById("results-area").classList.remove("hidden");
//   document.getElementById("vinyl").classList.add("paused");
// }

// // ── Browse section ────────────────────────────────────
// function loadBrowse() {
//   const genre = document.getElementById("browseGenreFilter").value;
//   const mood  = document.getElementById("browseMoodFilter").value;
//   let url = "/songs";
//   const params = [];
//   if (genre) params.push(`genre=${encodeURIComponent(genre)}`);
//   if (mood)  params.push(`mood=${encodeURIComponent(mood)}`);
//   if (params.length) url += "?" + params.join("&");

//   fetch(url).then(r=>r.json()).then(songs => {
//     const list = document.getElementById("browse-list");
//     list.innerHTML = "";
//     if (!songs.length) { list.innerHTML = `<p style="color:var(--text2);padding:20px">No songs found.</p>`; return; }
//     songs.forEach((s, i) => {
//       const row = songRow(s, i);
//       list.appendChild(row);
//     });
//   });
// }

// function songRow(s, i) {
//   const row = document.createElement("div");
//   row.className = "song-row";
//   row.style.animationDelay = `${Math.min(i,20)*30}ms`;
//   row.innerHTML = `
//     <div class="song-cover-sm" style="${coverStyle(s.genre_name)}">${genreEmoji(s.genre_name)}</div>
//     <div class="song-info-row">
//       <div class="song-title-row">${escHtml(s.title)}</div>
//       <div class="song-artist-row">${escHtml(s.artist)}</div>
//     </div>
//     <div class="song-row-badges">
//       <span class="badge badge-genre">${escHtml(s.genre_name)}</span>
//       <span class="badge badge-mood">${escHtml(s.mood_name)}</span>
//     </div>
//     <button class="song-play-btn" title="Get recommendations">▶</button>`;
//   row.onclick = () => {
//     showSection("discover", document.querySelector('[data-section="discover"]'));
//     document.getElementById("songInput").value = s.title;
//     doRecommend(s.title);
//   };
//   return row;
// }

// // ── Genres section ────────────────────────────────────
// function loadGenres() {
//   fetch("/genres").then(r=>r.json()).then(genres => {
//     const grid = document.getElementById("genre-grid");
//     grid.innerHTML = "";
//     genres.forEach(g => {
//       const cfg = GENRE_CONFIG[g.genre] || {emoji:"🎵", cls:"genre-sufi"};
//       const card = document.createElement("div");
//       card.className = `genre-card ${cfg.cls}`;
//       card.innerHTML = `
//         <span class="genre-emoji">${cfg.emoji}</span>
//         <div class="genre-name">${escHtml(g.genre)}</div>
//         <div class="genre-count">${g.count} songs</div>`;
//       card.onclick = () => {
//         // Switch to browse with this genre pre-selected
//         showSection("browse", document.querySelector('[data-section="browse"]'));
//         document.getElementById("browseGenreFilter").value = g.genre;
//         loadBrowse();
//       };
//       grid.appendChild(card);
//     });
//   });
// }

// // ── Moods section ─────────────────────────────────────
// function loadMoods() {
//   fetch("/moods").then(r=>r.json()).then(moods => {
//     const grid = document.getElementById("mood-grid");
//     grid.innerHTML = "";
//     moods.forEach(m => {
//       const emoji = MOOD_CONFIG[m.mood] || "🎵";
//       const chip = document.createElement("div");
//       chip.className = "mood-chip";
//       chip.innerHTML = `<span class="mood-emoji">${emoji}</span>${escHtml(m.mood)}<br><small style="color:var(--text3);font-size:11px">${m.count} songs</small>`;
//       chip.onclick = () => {
//         document.querySelectorAll(".mood-chip").forEach(c => c.classList.remove("active"));
//         chip.classList.add("active");
//         loadMoodSongs(m.mood);
//       };
//       grid.appendChild(chip);
//     });
//   });
// }

// function loadMoodSongs(mood) {
//   const area  = document.getElementById("mood-songs-area");
//   const title = document.getElementById("mood-songs-title");
//   const list  = document.getElementById("mood-song-list");
//   title.textContent = `${MOOD_CONFIG[mood] || "🎵"} ${mood} songs`;
//   list.innerHTML = "";
//   area.classList.remove("hidden");
//   fetch(`/songs?mood=${encodeURIComponent(mood)}`).then(r=>r.json()).then(songs => {
//     songs.forEach((s,i) => list.appendChild(songRow(s,i)));
//   });
// }

// // ── Global topbar search ──────────────────────────────
// function setupGlobalSearch() {
//   const input = document.getElementById("globalSearch");
//   const drop  = document.getElementById("global-autocomplete");

//   input.addEventListener("input", () => {
//     const q = input.value.trim().toLowerCase();
//     drop.innerHTML = "";
//     if (q.length < 2) { drop.classList.add("hidden"); return; }
//     const hits = allSongs.filter(s =>
//       s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
//     ).slice(0,8);
//     if (!hits.length) { drop.classList.add("hidden"); return; }
//     hits.forEach(s => {
//       const li = document.createElement("li");
//       li.innerHTML = `<strong>${escHtml(s.title)}</strong><span>${escHtml(s.artist)}</span>`;
//       li.onclick = () => {
//         drop.classList.add("hidden");
//         input.value = "";
//         showSection("discover", document.querySelector('[data-section="discover"]'));
//         document.getElementById("songInput").value = s.title;
//         doRecommend(s.title);
//       };
//       drop.appendChild(li);
//     });
//     drop.classList.remove("hidden");
//   });

//   document.addEventListener("click", e => {
//     if (!e.target.closest(".topbar-search")) drop.classList.add("hidden");
//   });
// }  

// ══ Config ════════════════════════════════════════════════
const GENRE_CONFIG = {
  "Romantic":       { emoji:"💕", cls:"genre-romantic" },
  "Sad":            { emoji:"💧", cls:"genre-sad"       },
  "Party / Dance":  { emoji:"🎉", cls:"genre-party"     },
  "Devotional":     { emoji:"🙏", cls:"genre-devotional"},
  "Peppy / Upbeat": { emoji:"⚡", cls:"genre-peppy"     },
  "Sufi / Folk":    { emoji:"🎻", cls:"genre-sufi"      },
};
const MOOD_CONFIG = {
  "Calm":"😌","Happy":"😄","Intense":"🔥",
  "Melancholic":"🌧️","Romantic":"🌹","Energetic":"💃"
};
const COVER_COLORS = {
  "Romantic":["#4a1060","#7a1090"],
  "Sad":["#1a3060","#0d1f40"],
  "Party / Dance":["#503000","#7a4a00"],
  "Devotional":["#2d4a10","#1a2d00"],
  "Peppy / Upbeat":["#4a2060","#2d1a30"],
  "Sufi / Folk":["#2d3a50","#1a2030"],
};

// ══ State ═════════════════════════════════════════════════
let allSongs      = [];
let currentAudio  = null;   // currently loaded Audio src
let seedPreview   = "";     // preview URL for seed song
let currentRecIdx = null;   // which rec card is playing

function coverStyle(genre) {
  const c = COVER_COLORS[genre] || ["#252545","#1e1e3a"];
  return `background:linear-gradient(135deg,${c[0]},${c[1]})`;
}
function genreEmoji(genre) { return (GENRE_CONFIG[genre]||{}).emoji||"🎵"; }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function fmtTime(s){ const m=Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,"0")}` }

// ══ Boot ══════════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadAllSongs();
  setupDiscoverSearch();
  setupGlobalSearch();
  setupMiniPlayer();

  fetch("/genres").then(r=>r.json()).then(genres=>{
    const sel = document.getElementById("browseGenreFilter");
    genres.forEach(g=>{ const o=document.createElement("option"); o.value=g.genre; o.textContent=g.genre; sel.appendChild(o); });
  });
  fetch("/moods").then(r=>r.json()).then(moods=>{
    const sel = document.getElementById("browseMoodFilter");
    moods.forEach(m=>{ const o=document.createElement("option"); o.value=m.mood; o.textContent=m.mood; sel.appendChild(o); });
  });
});

function loadStats(){
  fetch("/stats").then(r=>r.json()).then(d=>{
    document.getElementById("stat-songs").textContent   = d.total_songs;
    document.getElementById("stat-artists").textContent = d.total_artists;
    document.getElementById("stat-genres").textContent  = d.total_genres;
  });
}
function loadAllSongs(){
  fetch("/songs").then(r=>r.json()).then(d=>{ allSongs=d; });
}

// ══ Section nav ═══════════════════════════════════════════
function showSection(name, btn){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  document.getElementById("section-"+name).classList.add("active");
  btn.classList.add("active");
  if(name==="browse") loadBrowse();
  if(name==="genres") loadGenres();
  if(name==="moods")  loadMoods();
}
function toggleSidebar(){ document.getElementById("sidebar").classList.toggle("open"); }
document.addEventListener("click", e=>{
  const sb = document.getElementById("sidebar");
  if(window.innerWidth<=760 && !sb.contains(e.target) && e.target.getAttribute("onclick")!=="toggleSidebar()") sb.classList.remove("open");
});

// ══ Discover ══════════════════════════════════════════════
function setupDiscoverSearch(){
  const input  = document.getElementById("songInput");
  const btn    = document.getElementById("recommendBtn");
  const acList = document.getElementById("autocomplete-list");

  input.addEventListener("input",()=>{
    const q = input.value.trim().toLowerCase();
    acList.innerHTML="";
    if(q.length<2){ acList.classList.add("hidden"); return; }
    const hits = allSongs.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)).slice(0,7);
    if(!hits.length){ acList.classList.add("hidden"); return; }
    hits.forEach(s=>{
      const li=document.createElement("li");
      li.innerHTML=`<strong>${esc(s.title)}</strong><span>${esc(s.artist)}</span>`;
      li.onclick=()=>{ input.value=s.title; acList.innerHTML=""; acList.classList.add("hidden"); doRecommend(s.title); };
      acList.appendChild(li);
    });
    acList.classList.remove("hidden");
  });
  input.addEventListener("keydown",e=>{ if(e.key==="Enter"){ acList.classList.add("hidden"); doRecommend(input.value.trim()); } if(e.key==="Escape") acList.classList.add("hidden"); });
  btn.onclick=()=>doRecommend(input.value.trim());
  document.addEventListener("click",e=>{ if(!e.target.closest(".search-card")) acList.classList.add("hidden"); });
}

function doRecommend(songName){
  if(!songName) return;
  const errEl    = document.getElementById("error-msg");
  const loaderEl = document.getElementById("loader");
  const areaEl   = document.getElementById("results-area");
  const btn      = document.getElementById("recommendBtn");

  errEl.classList.add("hidden");
  areaEl.classList.add("hidden");
  loaderEl.classList.remove("hidden");
  btn.disabled=true;
  document.getElementById("vinyl").classList.remove("paused");

  fetch(`/recommend?song=${encodeURIComponent(songName)}`)
    .then(r=>r.json().then(d=>({status:r.status,d})))
    .then(({status,d})=>{
      loaderEl.classList.add("hidden"); btn.disabled=false;
      if(d.error){ errEl.textContent="⚠️ "+d.error; errEl.classList.remove("hidden"); return; }
      renderResults(d.seed, d.recommendations);
    })
    .catch(()=>{
      loaderEl.classList.add("hidden"); btn.disabled=false;
      errEl.textContent="⚠️ Could not connect. Is Flask running?";
      errEl.classList.remove("hidden");
    });
}

function renderResults(seed, recs){
  // ── Seed banner ──
  const seedBg  = document.getElementById("seed-bg");
  const seedArt = document.getElementById("seed-art");
  const seedPlayBtn   = document.getElementById("seed-play-btn");
  const seedItunesLink= document.getElementById("seed-itunes-link");

  if(seed.artwork){
    seedArt.src = seed.artwork;
    seedArt.style.display = "block";
    seedBg.style.backgroundImage = `url('${seed.artwork}')`;
  } else {
    seedArt.style.display = "none";
    seedBg.style.backgroundImage = "";
  }

  document.getElementById("seed-title").textContent       = seed.title;
  document.getElementById("seed-artist-name").textContent = "by " + seed.artist;
  document.getElementById("seed-badges").innerHTML =
    `<span class="badge badge-genre">${esc(seed.genre)}</span>
     <span class="badge badge-mood">${esc(seed.mood)}</span>
     <span class="badge badge-tempo">♩ ${seed.tempo} BPM</span>`;

  seedPreview = seed.preview || "";
  if(seedPreview){
    seedPlayBtn.style.display="inline-block";
    seedPlayBtn.textContent="▶ Play Preview";
    seedPlayBtn.classList.remove("playing");
  } else {
    seedPlayBtn.style.display="none";
  }
  if(seed.itunes){
    seedItunesLink.href=seed.itunes;
    seedItunesLink.style.display="inline-block";
  } else {
    seedItunesLink.style.display="none";
  }

  // ── Rec cards ──
  const grid = document.getElementById("rec-grid");
  grid.innerHTML="";
  currentRecIdx = null;

  recs.forEach((r,i)=>{
    const pct = (r.score*100).toFixed(1);
    const hasPreview = !!r.preview;
    const card = document.createElement("div");
    card.className="rec-card";
    card.style.animationDelay=`${i*80}ms`;
    card.innerHTML=`
      <div class="rec-cover-wrap">
        ${r.artwork
          ? `<img class="rec-cover-img" src="${esc(r.artwork)}" alt="${esc(r.title)}" onerror="this.style.display='none'" />`
          : ""}
        <div class="rec-cover-fallback" style="${coverStyle(r.genre)}">${genreEmoji(r.genre)}</div>
        <div class="rec-cover-overlay"></div>
        <button class="rec-play-btn${hasPreview?"":" no-preview"}"
                title="${hasPreview?"Play 30s preview":"No preview available"}"
                onclick="event.stopPropagation(); ${hasPreview?`playRec(${i}, '${esc(r.preview)}','${esc(r.artwork)}','${esc(r.title)}','${esc(r.artist)}')`:'alert(\"No preview available for this song\")'}" >
          ${hasPreview?"▶":"✕"}
        </button>
      </div>
      <div class="rec-body">
        <div class="rec-title">${esc(r.title)}</div>
        <div class="rec-artist">${esc(r.artist)}</div>
        <div class="seed-badges" style="margin-bottom:8px">
          <span class="badge badge-genre">${esc(r.genre)}</span>
          <span class="badge badge-mood">${esc(r.mood)}</span>
        </div>
        <div class="rec-footer">
          <span class="match-pct">${pct}% match</span>
          <span class="badge badge-tempo">♩ ${r.tempo}</span>
        </div>
        <div class="match-bar-wrap"><div class="match-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    card.addEventListener("click",()=>{
      document.getElementById("songInput").value=r.title;
      doRecommend(r.title);
      window.scrollTo({top:0,behavior:"smooth"});
    });
    grid.appendChild(card);
  });

  document.getElementById("results-area").classList.remove("hidden");
  document.getElementById("vinyl").classList.add("paused");
}

// ══ Seed preview toggle ════════════════════════════════════
function toggleSeedPreview(){
  const btn = document.getElementById("seed-play-btn");
  if(!seedPreview) return;
  const audio = document.getElementById("mp-audio");

  if(!audio.paused && audio.src.includes(encodeURIComponent(seedPreview).slice(0,20))){
    audio.pause();
    btn.textContent="▶ Play Preview";
    btn.classList.remove("playing");
    document.getElementById("mp-play-btn").textContent="▶";
  } else {
    mpPlay(seedPreview, "", "Seed Preview", document.getElementById("seed-title").textContent, document.getElementById("seed-artist-name").textContent.replace("by ",""));
    btn.textContent="⏸ Pause Preview";
    btn.classList.add("playing");
  }
}

// ══ Rec card play ═════════════════════════════════════════
function playRec(idx, previewUrl, artwork, title, artist){
  mpPlay(previewUrl, artwork, artwork, title, artist);
  currentRecIdx=idx;
}

// ══ Mini player ═══════════════════════════════════════════
function setupMiniPlayer(){
  const audio    = document.getElementById("mp-audio");
  const fill     = document.getElementById("mp-progress-fill");
  const timeEl   = document.getElementById("mp-time");
  const playBtn  = document.getElementById("mp-play-btn");
  const bar      = document.getElementById("mp-progress-bar");

  audio.addEventListener("timeupdate",()=>{
    if(!audio.duration) return;
    const pct = (audio.currentTime/audio.duration)*100;
    fill.style.width = pct+"%";
    timeEl.textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration)}`;
  });
  audio.addEventListener("ended",()=>{
    playBtn.textContent="▶";
    fill.style.width="0%";
    resetSeedPlayBtn();
  });
  audio.addEventListener("play", ()=>{ playBtn.textContent="⏸"; });
  audio.addEventListener("pause",()=>{ playBtn.textContent="▶"; });

  // Click on bar to seek
  bar.addEventListener("click",e=>{
    if(!audio.duration) return;
    const rect=bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX-rect.left)/rect.width)*audio.duration;
  });
}

function mpPlay(previewUrl, artwork, bgUrl, title, artist){
  const audio   = document.getElementById("mp-audio");
  const player  = document.getElementById("mini-player");
  const artEl   = document.getElementById("mp-art");
  const artFb   = document.getElementById("mp-art-fallback");
  const titleEl = document.getElementById("mp-title");
  const artistEl= document.getElementById("mp-artist");
  const fill    = document.getElementById("mp-progress-fill");

  // If same track — toggle
  if(audio.src===previewUrl && !audio.paused){ audio.pause(); return; }

  audio.src=previewUrl;
  fill.style.width="0%";
  titleEl.textContent = title;
  artistEl.textContent= artist;

  if(artwork){
    artEl.src=artwork;
    artEl.style.display="block";
    artFb.style.display="none";
  } else {
    artEl.style.display="none";
    artFb.style.display="flex";
  }

  player.classList.remove("hidden");
  audio.play().catch(()=>{});
  resetSeedPlayBtn();
}

function mpToggle(){
  const audio = document.getElementById("mp-audio");
  audio.paused ? audio.play() : audio.pause();
}

function mpClose(){
  const audio = document.getElementById("mp-audio");
  audio.pause(); audio.src="";
  document.getElementById("mini-player").classList.add("hidden");
  document.getElementById("mp-progress-fill").style.width="0%";
  resetSeedPlayBtn();
}

function resetSeedPlayBtn(){
  const btn = document.getElementById("seed-play-btn");
  if(btn){ btn.textContent="▶ Play Preview"; btn.classList.remove("playing"); }
}

// ══ Browse ════════════════════════════════════════════════
function loadBrowse(){
  const genre = document.getElementById("browseGenreFilter").value;
  const mood  = document.getElementById("browseMoodFilter").value;
  let url="/songs";
  const p=[];
  if(genre) p.push(`genre=${encodeURIComponent(genre)}`);
  if(mood)  p.push(`mood=${encodeURIComponent(mood)}`);
  if(p.length) url+="?"+p.join("&");
  fetch(url).then(r=>r.json()).then(songs=>{
    const list=document.getElementById("browse-list");
    list.innerHTML="";
    if(!songs.length){ list.innerHTML=`<p style="color:var(--text2);padding:20px">No songs found.</p>`; return; }
    songs.forEach((s,i)=>list.appendChild(songRow(s,i)));
  });
}

function songRow(s, i){
  const row=document.createElement("div");
  row.className="song-row";
  row.style.animationDelay=`${Math.min(i,20)*25}ms`;

  // Lazy-load thumbnail via iTunes
  const thumbId = `thumb-${i}-${Date.now()}`;
  row.innerHTML=`
    <div class="song-cover-sm" id="${thumbId}" style="${coverStyle(s.genre_name)}">${genreEmoji(s.genre_name)}</div>
    <div class="song-info-row">
      <div class="song-title-row">${esc(s.title)}</div>
      <div class="song-artist-row">${esc(s.artist)}</div>
    </div>
    <div class="song-row-badges">
      <span class="badge badge-genre">${esc(s.genre_name)}</span>
      <span class="badge badge-mood">${esc(s.mood_name)}</span>
    </div>
    <button class="song-play-btn" title="Recommend similar">▶</button>`;

  // Fetch artwork lazily
  fetch(`/itunes?title=${encodeURIComponent(s.title)}&artist=${encodeURIComponent(s.artist)}`)
    .then(r=>r.json())
    .then(d=>{
      if(d.artwork){
        const el=document.getElementById(thumbId);
        if(el){ el.innerHTML=`<img src="${esc(d.artwork)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" />`; }
      }
    }).catch(()=>{});

  row.onclick=()=>{
    showSection("discover",document.querySelector('[data-section="discover"]'));
    document.getElementById("songInput").value=s.title;
    doRecommend(s.title);
  };
  return row;
}

// ══ Genres ════════════════════════════════════════════════
function loadGenres(){
  fetch("/genres").then(r=>r.json()).then(genres=>{
    const grid=document.getElementById("genre-grid");
    grid.innerHTML="";
    genres.forEach(g=>{
      const cfg=GENRE_CONFIG[g.genre]||{emoji:"🎵",cls:"genre-sufi"};
      const card=document.createElement("div");
      card.className=`genre-card ${cfg.cls}`;
      card.innerHTML=`<span class="genre-emoji">${cfg.emoji}</span><div class="genre-name">${esc(g.genre)}</div><div class="genre-count">${g.count} songs</div>`;
      card.onclick=()=>{ showSection("browse",document.querySelector('[data-section="browse"]')); document.getElementById("browseGenreFilter").value=g.genre; loadBrowse(); };
      grid.appendChild(card);
    });
  });
}

// ══ Moods ═════════════════════════════════════════════════
function loadMoods(){
  fetch("/moods").then(r=>r.json()).then(moods=>{
    const grid=document.getElementById("mood-grid");
    grid.innerHTML="";
    moods.forEach(m=>{
      const emoji=MOOD_CONFIG[m.mood]||"🎵";
      const chip=document.createElement("div");
      chip.className="mood-chip";
      chip.innerHTML=`<span class="mood-emoji">${emoji}</span>${esc(m.mood)}<br><small style="color:var(--text3);font-size:11px">${m.count} songs</small>`;
      chip.onclick=()=>{ document.querySelectorAll(".mood-chip").forEach(c=>c.classList.remove("active")); chip.classList.add("active"); loadMoodSongs(m.mood); };
      grid.appendChild(chip);
    });
  });
}
function loadMoodSongs(mood){
  const area=document.getElementById("mood-songs-area");
  const title=document.getElementById("mood-songs-title");
  const list=document.getElementById("mood-song-list");
  title.textContent=`${MOOD_CONFIG[mood]||"🎵"} ${mood} songs`;
  list.innerHTML=""; area.classList.remove("hidden");
  fetch(`/songs?mood=${encodeURIComponent(mood)}`).then(r=>r.json()).then(songs=>songs.forEach((s,i)=>list.appendChild(songRow(s,i))));
}

// ══ Global search ══════════════════════════════════════════
function setupGlobalSearch(){
  const input=document.getElementById("globalSearch");
  const drop=document.getElementById("global-autocomplete");
  input.addEventListener("input",()=>{
    const q=input.value.trim().toLowerCase();
    drop.innerHTML="";
    if(q.length<2){ drop.classList.add("hidden"); return; }
    const hits=allSongs.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)).slice(0,8);
    if(!hits.length){ drop.classList.add("hidden"); return; }
    hits.forEach(s=>{
      const li=document.createElement("li");
      li.innerHTML=`<strong>${esc(s.title)}</strong><span>${esc(s.artist)}</span>`;
      li.onclick=()=>{ drop.classList.add("hidden"); input.value=""; showSection("discover",document.querySelector('[data-section="discover"]')); document.getElementById("songInput").value=s.title; doRecommend(s.title); };
      drop.appendChild(li);
    });
    drop.classList.remove("hidden");
  });
  document.addEventListener("click",e=>{ if(!e.target.closest(".topbar-search")) drop.classList.add("hidden"); });
}