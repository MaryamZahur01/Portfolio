/* Maryam Zahoor portfolio: interactions & animation */
(() => {
  "use strict";
  const S = window.SITE || {};
  const PROJECTS = window.PROJECTS || [];
  const TOOLS = window.TOOLS || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Preloader ---------- */
  document.body.classList.add("is-loading");
  const finishLoad = () => {
    const l = $("#loader");
    if (!l || l.classList.contains("is-done")) return;
    l.classList.add("is-done");
    document.body.classList.remove("is-loading");
  };
  window.addEventListener("load", () => setTimeout(finishLoad, reduce ? 0 : 900));
  setTimeout(finishLoad, 3500); // safety net

  /* ---------- Contact links, WhatsApp, socials, year ---------- */
  const mail = S.email || "";
  const mailBtn = $("#mailBtn"), quoteBtn = $("#quoteBtn");
  if (mailBtn) mailBtn.href = `mailto:${mail}?subject=${encodeURIComponent("Project enquiry")}`;
  if (quoteBtn) quoteBtn.href = `mailto:${mail}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent("Hi Maryam,\n\nI'd like a quote for:\n\nProject type:\nTimeline:\nBudget range:\nLinks / references:\n\nThanks!")}`;
  const wa = $("#wa");
  if (wa && S.whatsapp) { wa.href = `https://wa.me/${S.whatsapp.replace(/\D/g, "")}`; wa.hidden = false; }
  const socials = $("#socials");
  if (socials) {
    const list = [["Behance", S.behance], ["LinkedIn", S.linkedin], ["Dribbble", S.dribbble], ["Instagram", S.instagram], ["Email", mail && `mailto:${mail}`]];
    socials.innerHTML = list.filter(([, u]) => u).map(([n, u]) => `<a href="${esc(u)}" ${u.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${n} ↗</a>`).join("");
  }
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Tools: marquee + grid ---------- */
  const mq = $("#marquee");
  if (mq) {
    const row = TOOLS.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join("");
    mq.innerHTML = row + row; // doubled for seamless loop
  }
  const tg = $("#toolsGrid");
  if (tg) tg.innerHTML = TOOLS.map((t) => `<span class="tool">${esc(t)}</span>`).join("");

  /* ---------- Screenshot component ----------
     Only REAL homepage screenshots are used: assets/projects/<slug>.jpg
     (captured by scripts/capture.mjs / the GitHub Action). No live screenshot
     service and no fake mockups, so an error page can never appear as a thumbnail. */
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
  const shotHTML = (p) => `
    <div class="shot" style="--hue:${p.hue}">
      <img alt="${esc(p.title)} homepage" loading="lazy" decoding="async" data-slug="${esc(p.slug)}" ${p.img ? `data-own="${esc(p.img)}"` : ""} />
      <div class="shot__pending" aria-hidden="true">
        ${p.cat === "app" ? "" : `<img class="shot__icon" alt="" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(p.url))}&sz=128" onerror="this.remove()">`}
        <span>${esc(p.title)}</span>
      </div>
    </div>`;
  function loadShot(img) {
    const exts = ["jpg", "webp", "png"];
    let i = 0;
    img.addEventListener("load", () => img.closest(".shot").classList.add("is-ready"));
    img.addEventListener("error", () => { if (i < exts.length) img.src = `assets/projects/${img.dataset.slug}.${exts[i++]}`; });
    img.src = img.dataset.own || `assets/projects/${img.dataset.slug}.${exts[i++]}`;
  }
  const watchShots = (root) => $$("img[data-slug]", root).forEach(loadShot);

  const cardLinks = (p) => `
    <div class="links">
      <a class="links__main" href="${esc(p.url)}" target="_blank" rel="noopener">${p.cat === "app" ? "View app" : "Visit live site"} ↗</a>
      ${p.extra ? `<a href="${esc(p.extra.url)}" target="_blank" rel="noopener">${esc(p.extra.label)} ↗</a>` : ""}
    </div>`;

  /* ---------- Selected work (horizontal) ---------- */
  const track = $("#workTrack");
  const featured = PROJECTS.filter((p) => p.feature);
  if (track) {
    track.innerHTML = featured.map((p) => `
      <article class="wcard">
        <a href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)} (opens in new tab)">
          ${shotHTML(p)}
          <div class="wcard__meta"><h3>${esc(p.title)}</h3><span>${esc(p.tag)}</span></div>
          <p class="wcard__desc">${esc(p.desc)}</p>
        </a>
        ${cardLinks(p)}
      </article>`).join("");
    watchShots(track);
  }

  /* ---------- More work: grid by category (featured projects are not repeated) ---------- */
  const grid = $("#projectGrid");
  const filters = $("#filters");
  const CATS = window.CATEGORIES || [];
  const G = window.GRAPHIC || {};
  const labelFor = (title) => {
    const t = (title || "").toLowerCase();
    const hit = (G.labels || []).find((l) => l.match.some((m) => t.includes(m)));
    return hit ? hit.label : "Graphic design";
  };
  if (grid) {
    const rest = PROJECTS.filter((p) => !p.feature);
    const cardHTML = (p) => `
      <article class="pcard ${p.cat === "app" ? "pcard--app" : ""}" data-cat="${p.cat}">
        <a href="${esc(p.url)}" target="_blank" rel="noopener">
          ${shotHTML(p)}
          <div class="pcard__meta"><h3>${esc(p.title)}<span class="pcard__go">↗</span></h3><span>${esc(p.tag)}</span></div>
          <p>${esc(p.desc)}</p>
        </a>
      </article>`;
    grid.innerHTML = rest.map(cardHTML).join("");
    watchShots(grid);

    // Graphic design: real covers pulled from Behance (assets/behance/covers.json)
    const behanceCard = `
      <article class="pcard pcard--behance" data-cat="graphic">
        <a href="${esc(G.behance || S.behance)}" target="_blank" rel="noopener">
          <div class="shot shot--behance is-ready">
            <img src="assets/img/maryam-avatar.jpg" alt="" class="behance__me">
            <strong>Amazon product design, posters, packaging &amp; branding</strong>
            <span>Full case studies on Behance ↗</span>
          </div>
          <div class="pcard__meta"><h3>Behance portfolio<span class="pcard__go">↗</span></h3><span>behance.net/maryamzahoor</span></div>
        </a>
      </article>`;
    fetch("assets/behance/covers.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((covers) => {
        const html = (covers || []).map((c) => `
          <article class="pcard" data-cat="graphic">
            <a href="${esc(c.url)}" target="_blank" rel="noopener">
              <div class="shot shot--cover is-ready"><img src="${esc(c.img)}" alt="${esc(c.title)}" loading="lazy"></div>
              <div class="pcard__meta"><h3>${esc(c.title)}<span class="pcard__go">↗</span></h3><span>${esc(labelFor(c.title))}</span></div>
            </a>
          </article>`).join("");
        grid.insertAdjacentHTML("beforeend", html + behanceCard);
        applyFilter(currentFilter);
      });

    let currentFilter = "all";
    const applyFilter = (f) => {
      currentFilter = f;
      let n = 0;
      $$(".pcard", grid).forEach((c) => {
        const show = f === "all" || c.dataset.cat === f;
        c.classList.toggle("is-hidden", !show);
        if (show && !reduce) {
          const k = n++;
          c.classList.add("is-entering");
          setTimeout(() => c.classList.remove("is-entering"), 30 + Math.min(k, 12) * 40);
        }
      });
    };
    if (filters) {
      const count = (id) => rest.filter((p) => p.cat === id).length;
      filters.innerHTML = `<button class="filter is-active" data-filter="all" role="tab" aria-selected="true">All</button>` +
        CATS.map((c) => `<button class="filter" data-filter="${c.id}" role="tab" aria-selected="false">${esc(c.label)}${c.id !== "graphic" ? ` <sup>${count(c.id)}</sup>` : ""}</button>`).join("");
      $$(".filter", filters).forEach((btn) => btn.addEventListener("click", () => {
        $$(".filter", filters).forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
        applyFilter(btn.dataset.filter);
      }));
    }
  }

  /* ---------- Hero: typewriter cycle ---------- */
  const heroType = $("#heroType");
  const phrases = ["Designing products people love", "Building Shopify stores that sell", "Crafting brands with character", "Making dashboards feel simple", "Packaging that wins the shelf"];
  if (heroType) {
    if (reduce) heroType.textContent = phrases[0];
    else {
      let pi = 0, ci = 0, del = false;
      const tick = () => {
        const w = phrases[pi];
        heroType.textContent = w.slice(0, ci);
        if (!del && ci < w.length) { ci++; setTimeout(tick, 55); }
        else if (!del) { del = true; setTimeout(tick, 1800); }
        else if (ci > 0) { ci--; setTimeout(tick, 28); }
        else { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); }
      };
      setTimeout(tick, 2200);
    }
  }

  /* ---------- Hero: badge flip + tilt ---------- */
  const badge = $("#badge"), lanyard = $("#lanyard");
  let autoFlip = null;
  if (badge) {
    badge.addEventListener("click", () => { badge.classList.toggle("is-flipped"); clearInterval(autoFlip); });
    if (!reduce) autoFlip = setInterval(() => badge.classList.toggle("is-flipped"), 4200);
    const hero = $(".hero");
    const inner = $(".badge__inner", badge);
    if (window.matchMedia("(hover: hover)").matches && !reduce) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        inner.style.setProperty("--ry", `${nx * 28}deg`);
        inner.style.setProperty("--rx", `${-ny * 16}deg`);
      });
      hero.addEventListener("pointerleave", () => { inner.style.setProperty("--ry", "0deg"); inner.style.setProperty("--rx", "0deg"); });
    }
  }

  /* ---------- Intro typewriter (once, when visible) ---------- */
  const introType = $("#introType");
  let introTyped = false;
  const typeIntro = () => {
    if (introTyped || !introType) return;
    introTyped = true;
    const text = introType.dataset.text;
    if (reduce) { introType.textContent = text; return; }
    let i = 0;
    const step = () => { introType.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 60 + Math.random() * 40); };
    setTimeout(step, 350);
  };

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  // stagger siblings
  $$("[data-reveal]").forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
    el.style.setProperty("--d", `${sibs.indexOf(el) * 0.08}s`);
    revealIO.observe(el);
  });
  const sectionIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      if (e.target.id === "intro") typeIntro();
      sectionIO.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  ["#intro", "#contact"].forEach((s) => { const el = $(s); if (el) sectionIO.observe(el); });

  /* ---------- Roles accordion ---------- */
  $$(".role__head").forEach((h) => h.addEventListener("click", () => {
    const li = h.closest(".role");
    const open = !li.classList.contains("is-open");
    $$(".role").forEach((r) => { r.classList.remove("is-open"); $(".role__head", r).setAttribute("aria-expanded", "false"); });
    if (open) { li.classList.add("is-open"); h.setAttribute("aria-expanded", "true"); }
  }));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
      countIO.unobserve(el);
      if (reduce) { el.textContent = end + suf; return; }
      const t0 = performance.now(), dur = 1600;
      const f = (t) => {
        const k = clamp((t - t0) / dur, 0, 1), eased = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(end * eased) + suf;
        if (k < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Scroll-driven: hero, nav, pinned work ---------- */
  const heroEl = $(".hero"), nav = $("#nav");
  const work = $("#work"), viewport = $(".work__viewport"), prog = $("#workProgress");
  const desktop = window.matchMedia("(min-width: 961px)");
  const themed = $$("[data-theme]");

  function sizeWork() {
    if (!work || !track) return;
    if (!desktop.matches || reduce) { work.style.height = ""; return; }
    const extra = track.scrollWidth - window.innerWidth + window.innerWidth * 0.5;
    work.style.height = `${window.innerHeight + Math.max(0, extra)}px`;
  }

  function onScroll() {
    const sy = window.scrollY, vh = window.innerHeight;

    // hero exit
    if (heroEl) {
      const p = clamp(sy / (vh * 0.9), 0, 1);
      heroEl.style.setProperty("--p", p.toFixed(3));
      heroEl.classList.toggle("is-scrolling", p > 0.001 && !reduce);
    }

    // nav show + theme
    if (nav) {
      nav.classList.toggle("is-visible", sy > vh * 0.55);
      const probe = 40;
      const under = themed.find((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
      nav.classList.toggle("on-dark", !!under && under.dataset.theme === "dark");
    }

    // horizontal work
    if (work && track && desktop.matches && !reduce) {
      const r = work.getBoundingClientRect();
      const total = work.offsetHeight - vh;
      const p = clamp(-r.top / total, 0, 1);
      const cards = track.children;
      if (cards.length) {
        const cw = cards[0].offsetWidth;
        const x0 = window.innerWidth / 2 - cw / 2;
        const x1 = window.innerWidth / 2 - (track.scrollWidth - cw / 2);
        track.style.transform = `translate3d(${x0 + (x1 - x0) * p}px,0,0)`;
        const mid = window.innerWidth / 2;
        let best = null, bestD = Infinity;
        for (const c of cards) {
          const b = c.getBoundingClientRect();
          const d = (b.left + b.width / 2 - mid) / window.innerWidth;
          const ad = Math.abs(d);
          c.style.transform = `perspective(1400px) rotateY(${clamp(-d * 38, -30, 30)}deg) scale(${1 - Math.min(ad, 0.8) * 0.22}) translateZ(${-ad * 80}px)`;
          c.style.opacity = String(clamp(1.25 - ad * 1.1, 0.35, 1));
          if (ad < bestD) { bestD = ad; best = c; }
        }
        for (const c of cards) c.classList.toggle("is-center", c === best);
      }
      if (prog) prog.style.transform = `scaleX(${p})`;
    }
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", () => { sizeWork(); onScroll(); });
  desktop.addEventListener?.("change", () => { sizeWork(); onScroll(); });
  window.addEventListener("load", () => { sizeWork(); onScroll(); });
  sizeWork(); onScroll();
})();
