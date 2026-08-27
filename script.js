const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const projectCards = document.querySelectorAll(".project-card");
const touchProjectMedia = window.matchMedia("(hover: none), (pointer: coarse)");

const setProjectExpanded = (card, expanded) => {
  card.classList.toggle("is-expanded", expanded);
  card.setAttribute("aria-expanded", String(expanded));
};

const collapseProjectCards = (exceptCard = null) => {
  projectCards.forEach((card) => {
    if (card !== exceptCard) {
      setProjectExpanded(card, false);
    }
  });
};

projectCards.forEach((card) => {
  setProjectExpanded(card, false);

  card.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;

    if (!touchProjectMedia.matches || target?.closest("a")) {
      return;
    }

    const shouldExpand = !card.classList.contains("is-expanded");
    collapseProjectCards(card);
    setProjectExpanded(card, shouldExpand);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;

  if (touchProjectMedia.matches && !target?.closest(".project-card")) {
    collapseProjectCards();
  }
});

const handleProjectMediaChange = () => {
  if (!touchProjectMedia.matches) {
    collapseProjectCards();
  }
};

if ("addEventListener" in touchProjectMedia) {
  touchProjectMedia.addEventListener("change", handleProjectMediaChange);
} else {
  touchProjectMedia.addListener(handleProjectMediaChange);
}

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
