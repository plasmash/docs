/* Reliable, on-brand Mermaid rendering for docs.plasma.sh.
 *
 * Material's built-in loader leaves diagrams blank (it empties the <pre> and
 * never renders), and renders in the default lavender theme that clashes with
 * the site. This script:
 *   1. runs at parse time, snapshots each diagram's source, and swaps the
 *      <pre class="mermaid"> for a code-less <div class="mermaid"> (which
 *      Material's `.mermaid > code` selector no longer matches);
 *   2. renders with a Plasma theme (emerald accent, JetBrains Mono, dark/light
 *      aware) — matching the surrounding page;
 *   3. re-renders when the reader flips the light/dark toggle.
 */
(function () {
  function isDark() {
    return document.body.getAttribute("data-md-color-scheme") !== "default";
  }

  function themeVariables() {
    return isDark()
      ? {
          background: "#000000",
          mainBkg: "#0a0a0a", primaryColor: "#0a0a0a",
          secondaryColor: "#0d0d0d", tertiaryColor: "#0d0d0d",
          primaryBorderColor: "#10b981", nodeBorder: "#10b981",
          primaryTextColor: "#e4e4e7", textColor: "#e4e4e7", nodeTextColor: "#e4e4e7",
          lineColor: "#8b8b8b", edgeLabelBackground: "#000000",
          clusterBkg: "#0a0a0a", clusterBorder: "#1a1a1a",
          fontFamily: '"JetBrains Mono", monospace', fontSize: "13px",
        }
      : {
          background: "#ffffff",
          mainBkg: "#fafafa", primaryColor: "#fafafa",
          secondaryColor: "#f2f2f3", tertiaryColor: "#f2f2f3",
          primaryBorderColor: "#047857", nodeBorder: "#047857",
          primaryTextColor: "#1a1a1f", textColor: "#1a1a1f", nodeTextColor: "#1a1a1f",
          lineColor: "#71717a", edgeLabelBackground: "#ffffff",
          clusterBkg: "#fafafa", clusterBorder: "#e6e6e9",
          fontFamily: '"JetBrains Mono", monospace', fontSize: "13px",
        };
  }

  function ensureMermaid(cb) {
    if (window.mermaid) { cb(); return; }
    if (window.__plasmaMermaidLoading) { window.__plasmaMermaidQueue.push(cb); return; }
    window.__plasmaMermaidLoading = true;
    window.__plasmaMermaidQueue = [cb];
    var s = document.createElement("script");
    s.src = "https://unpkg.com/mermaid@11/dist/mermaid.min.js";
    s.onload = function () {
      window.__plasmaMermaidLoading = false;
      (window.__plasmaMermaidQueue || []).forEach(function (f) { f(); });
      window.__plasmaMermaidQueue = [];
    };
    document.head.appendChild(s);
  }

  function renderNodes(nodes) {
    if (!nodes.length) return;
    ensureMermaid(function () {
      try {
        window.mermaid.initialize({
          startOnLoad: false, securityLevel: "loose",
          theme: "base", themeVariables: themeVariables(),
        });
      } catch (e) {}
      nodes.forEach(function (d) {
        var src = d.getAttribute("data-mermaid-src");
        if (src) { d.removeAttribute("data-processed"); d.innerHTML = ""; d.textContent = src; }
      });
      try { window.mermaid.run({ nodes: nodes }); } catch (e) {}
    });
  }

  // Snapshot <pre class="mermaid"> → <div class="mermaid"> and render.
  function process() {
    var fresh = [];
    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      var code = pre.querySelector("code");
      var src = (code ? code.textContent : pre.textContent) || "";
      if (!src.trim()) return;
      var div = document.createElement("div");
      div.className = "mermaid";
      div.setAttribute("data-plasma-mermaid", "1");
      div.setAttribute("data-mermaid-src", src);
      div.textContent = src;
      pre.replaceWith(div);
      fresh.push(div);
    });
    renderNodes(fresh);
  }

  process();
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(process);
  } else {
    document.addEventListener("DOMContentLoaded", process);
  }

  // Re-theme every rendered diagram when the light/dark scheme changes.
  new MutationObserver(function () {
    var all = [].slice.call(document.querySelectorAll(".mermaid[data-mermaid-src]"));
    renderNodes(all);
  }).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
})();
