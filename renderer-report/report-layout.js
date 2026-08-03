window.addEventListener(
  "load",
  () => {
    const report = document.querySelector(".md");

    if (!report) {
      return;
    }

    report.classList.add("report-content");

    const generatedContents = report.querySelector(".longTOC");

    if (generatedContents) {
      generatedContents.remove();
    }

    report.querySelectorAll(":scope > p").forEach((paragraph) => {
      if (!paragraph.textContent.trim() && !paragraph.children.length) {
        paragraph.remove();
      }
    });

    const layout = document.createElement("main");
    layout.className = "report-layout";

    const sidebar = document.createElement("aside");
    sidebar.className = "report-sidebar";
    sidebar.setAttribute("aria-label", "Report contents");

    const sidebarTitle = document.createElement("h1");
    sidebarTitle.textContent = "Contents";

    const summary = document.createElement("p");
    summary.className = "report-summary";
    summary.innerHTML = "Final Project Report<br>Brian Song<br>Cornell CS5630";

    const contents = document.createElement("ol");
    contents.className = "report-toc";

    const usedIds = new Set();
    const headings = report.querySelectorAll("h1");

    headings.forEach((heading) => {
      const baseId =
        heading.textContent
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "section";
      let id = baseId;
      let suffix = 2;

      while (usedIds.has(id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }

      usedIds.add(id);
      heading.id = id;

      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      contents.appendChild(item);
    });

    sidebar.append(sidebarTitle, summary, contents);
    report.parentNode.insertBefore(layout, report);
    layout.append(sidebar, report);
  },
  { once: true },
);
