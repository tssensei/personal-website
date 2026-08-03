const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const projectCards = document.querySelectorAll(".project-card");

const syncProjectCopyOffsets = () => {
  projectCards.forEach((card) => {
    const thumbnail = card.querySelector(".project-thumb");

    if (thumbnail) {
      const cardTop = card.getBoundingClientRect().top;
      const thumbnailBottom = thumbnail.getBoundingClientRect().bottom;
      card.style.setProperty(
        "--project-copy-shift",
        `${thumbnailBottom - cardTop}px`,
      );
    }
  });
};

projectCards.forEach((card) => {
  const image = card.querySelector("img");

  if (image && !image.complete) {
    image.addEventListener("load", syncProjectCopyOffsets, { once: true });
  }
});

if ("ResizeObserver" in window) {
  const projectResizeObserver = new ResizeObserver(syncProjectCopyOffsets);

  projectCards.forEach((card) => {
    const thumbnail = card.querySelector(".project-thumb");

    if (thumbnail) {
      projectResizeObserver.observe(thumbnail);
    }
  });
}

window.addEventListener("resize", syncProjectCopyOffsets);
window.addEventListener("load", syncProjectCopyOffsets, { once: true });
syncProjectCopyOffsets();
