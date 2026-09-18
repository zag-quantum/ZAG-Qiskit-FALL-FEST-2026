// Qiskit Fall Fest 2026 @ SNU - shared site behavior
// Mobile nav, FAQ accordion is native <details>.

(function () {
  function bindMobileNav() {
    var menuBtn = document.querySelector(".menu-btn");
    var nav = document.querySelector("nav.primary-nav ul");
    if (!menuBtn || !nav) return;
    nav.id = "primary-menu";
    menuBtn.setAttribute("aria-controls", nav.id);
    menuBtn.setAttribute("aria-expanded", "false");
    function setOpen(open) {
      nav.setAttribute("data-open", String(open));
      menuBtn.setAttribute("aria-expanded", String(open));
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        setOpen(false); menuBtn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1250) setOpen(false);
    });
    nav.addEventListener("click", function(e) { if (e.target.closest("a")) setOpen(false); });
    menuBtn.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      setOpen(!open);
    });
  }

  function markActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav.primary-nav a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === path) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindMobileNav();
    markActiveNav();
  });
})();

// Scroll-scrubbed registration orbit, with a static position for reduced motion.
(function () {
  var section = document.querySelector('.join');
  var particle = document.querySelector('.orbit-particle');
  if (!section || !particle) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pending = false;
  function render() {
    pending = false;
    var rect = section.getBoundingClientRect();
    var progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    var theta = (reduced.matches ? .15 : progress) * Math.PI * 2;
    var rotation = -24 * Math.PI / 180;
    var x = 330 * Math.cos(theta), y = 145 * Math.sin(theta);
    particle.setAttribute('transform', 'translate(' + (400 + x * Math.cos(rotation) - y * Math.sin(rotation)) + ' ' + (250 + x * Math.sin(rotation) + y * Math.cos(rotation)) + ')');
  }
  function queue() { if (!pending) { pending = true; requestAnimationFrame(render); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  reduced.addEventListener('change', queue);
  render();
})();

// Decode pre-rendered motion only for visible Home artwork.
(function () {
  var elements = document.querySelectorAll('.reference-hero, .art-tile');
  if (!elements.length || !('IntersectionObserver' in window)) return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var visible = new Set();
  function update() {
    elements.forEach(function (el) {
      el.classList.toggle('motion-playing', visible.has(el) && !reduced.matches && !document.hidden);
    });
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
    update();
  });
  elements.forEach(function (el) { observer.observe(el); });
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
})();
