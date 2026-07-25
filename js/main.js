// ===== Promo popup (vanilla JS). Two triggers, fires once (whichever first): =====
//  - mouse leaves the browser toward the top (clientY < 50) — exit-intent.
//  - section.content scrolls into view (IntersectionObserver).
//  - the close button hides the popup.
document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("popup");
  if (!popup) return;
  var shown = false;
  var popupIO = null;

  function show() {
    if (shown) return;
    shown = true;
    popup.classList.add("is-active");
    document.removeEventListener("mouseout", onMouseOut);
    if (popupIO) popupIO.disconnect();
  }
  // trigger 1: mouse leaves the browser toward the top (exit-intent)
  function onMouseOut(e) {
    if (e.clientY < 50) show();
  }
  document.addEventListener("mouseout", onMouseOut);

  // trigger 2: section.content scrolls into view (first time)
  var content = document.querySelector("section.content");
  if (content && "IntersectionObserver" in window) {
    popupIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(); });
    }, { threshold: 0 });
    popupIO.observe(content);
  }

  // close button (.hide-overlay == the X)
  Array.prototype.forEach.call(
    popup.querySelectorAll(".hide-overlay"),
    function (el) {
      el.addEventListener("click", function () { popup.style.display = "none"; });
    }
  );

  // ===== Dynamic dates =====
  // hero "Updated: {month} {year}" + callout "As of {month} {ordinal-day} {year}"
  var MONTHS = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
  function ordinal(n) {
    if (n > 3 && n < 21) return "th";
    return (n % 10 === 1) ? "st" : (n % 10 === 2) ? "nd" : (n % 10 === 3) ? "rd" : "th";
  }
  var now = new Date();
  var updated = document.getElementById("bt-updated");
  if (updated) updated.textContent = MONTHS[now.getMonth()] + " " + now.getFullYear();
  var asof = document.getElementById("bt-asof");
  if (asof) asof.textContent = MONTHS[now.getMonth()] + " " + now.getDate() + ordinal(now.getDate()) + ", " + now.getFullYear();

  // ===== Mobile floating CTA: show when section.content is in view, hide at footer =====
  var cta = document.querySelector(".floating-cta");
  if (cta && "IntersectionObserver" in window) {
    var content = document.querySelector("section.content");
    var footer = document.querySelector("footer.footer");
    var inContent = false, atBottom = false;
    function apply() { cta.classList.toggle("is-visible", inContent && !atBottom); }
    var ctaIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === content) inContent = e.isIntersecting;
        if (e.target === footer) atBottom = e.isIntersecting;
        apply();
      });
    }, { threshold: 0 });
    if (content) ctaIO.observe(content);
    if (footer) ctaIO.observe(footer);
  }
});
