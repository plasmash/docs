/* Reliable Mermaid rendering for docs.plasma.sh.
 *
 * Material for MkDocs' built-in Mermaid loader (9.7.x + mermaid@11) transforms
 * <pre class="mermaid"><code>…</code></pre> into an EMPTY <div class="mermaid">
 * and never renders it — so every diagram showed up blank. This script runs at
 * parse time (before Material's async loader fires), snapshots each diagram's
 * source, replaces the <pre> with a code-less <div class="mermaid"> (which
 * Material's `.mermaid > code` selector no longer matches, so it leaves it
 * alone), then renders it ourselves. One mermaid load, no race, no blank boxes.
 */
(function () {
  function ensureMermaid(cb) {
    if (window.__plasmaMermaidLoading) {
      window.__plasmaMermaidQueue.push(cb);
      return;
    }
    if (window.mermaid) { cb(); return; }
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

  function render() {
    var pres = document.querySelectorAll("pre.mermaid");
    var divs = [];
    pres.forEach(function (pre) {
      var code = pre.querySelector("code");
      var src = (code ? code.textContent : pre.textContent) || "";
      if (!src.trim()) return;
      var div = document.createElement("div");
      div.className = "mermaid";
      div.setAttribute("data-plasma-mermaid", "1");
      div.textContent = src;
      pre.replaceWith(div);
      divs.push(div);
    });
    if (!divs.length) return;
    ensureMermaid(function () {
      try { window.mermaid.initialize({ startOnLoad: false, securityLevel: "loose" }); } catch (e) {}
      try { window.mermaid.run({ nodes: divs }); } catch (e) {}
    });
  }

  // Full page loads: run now, at parse time, before Material's loader reacts.
  render();
  // Belt-and-suspenders for any client-side page swap.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(render);
  } else {
    document.addEventListener("DOMContentLoaded", render);
  }
})();
