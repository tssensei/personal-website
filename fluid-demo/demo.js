(() => {
  const MESSAGE_SOURCE = "ziteng-fluid-demo";
  const HOST_MESSAGE_SOURCE = "ziteng-fluid-demo-host";
  const stage = document.getElementById("fluid-demo-stage");
  const launchButton = document.getElementById("fluid-demo-launch");
  const status = document.getElementById("fluid-demo-status");

  let frame = null;
  let isIntersecting = true;
  let launchTimeout = 0;

  const sendVisibility = () => {
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        source: HOST_MESSAGE_SOURCE,
        type: "visibility",
        visible: isIntersecting && !document.hidden,
      },
      window.location.origin,
    );
  };

  const restoreFallback = (message) => {
    window.clearTimeout(launchTimeout);
    frame?.remove();
    frame = null;
    stage.classList.remove("is-loading", "is-ready");
    launchButton.disabled = false;
    launchButton.textContent = "Try Again";
    status.textContent = message;
    status.hidden = false;
  };

  const launchDemo = () => {
    if (frame) return;
    status.hidden = true;
    launchButton.disabled = true;
    launchButton.textContent = "Loading...";
    stage.classList.add("is-loading");

    frame = document.createElement("iframe");
    frame.className = "fluid-demo-frame";
    frame.src = "./app/index.html";
    frame.title = "Interactive GPU fluid simulation";
    frame.addEventListener("load", sendVisibility);
    stage.appendChild(frame);

    launchTimeout = window.setTimeout(() => {
      restoreFallback("The interactive demo took too long to initialize.");
    }, 50000);
  };

  launchButton.addEventListener("click", launchDemo);

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.source !== frame?.contentWindow) return;
    if (event.data?.source !== MESSAGE_SOURCE) return;

    if (event.data.type === "ready") {
      window.clearTimeout(launchTimeout);
      stage.classList.remove("is-loading");
      stage.classList.add("is-ready");
      status.hidden = true;
      sendVisibility();
    } else if (event.data.type === "error") {
      restoreFallback("The interactive demo is unavailable on this device.");
    }
  });

  document.addEventListener("visibilitychange", sendVisibility);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        sendVisibility();
      },
      {threshold: 0.05},
    );
    observer.observe(stage);
  }
})();
