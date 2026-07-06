/* Make data tables readable on phones.
 *
 * On narrow screens a wide table forces horizontal scrolling that hides
 * columns. This tags every body cell with its column header (data-label) and
 * marks the table data-stackable, so the mobile CSS in extra.css can render
 * each row as a "label: value" card instead. Tables with no header row are
 * left alone (they keep the default horizontal scroll).
 */
(function () {
  function labelTables() {
    document.querySelectorAll(".md-typeset table").forEach(function (table) {
      var heads = [].slice
        .call(table.querySelectorAll("thead th"))
        .map(function (th) { return th.textContent.trim(); });
      if (!heads.length) return;
      table.querySelectorAll("tbody tr").forEach(function (tr) {
        var i = 0;
        [].slice.call(tr.children).forEach(function (cell) {
          if (cell.tagName === "TD") { cell.setAttribute("data-label", heads[i] || ""); i++; }
        });
      });
      table.setAttribute("data-stackable", "");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", labelTables);
  else labelTables();
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(labelTables);
  }
})();
