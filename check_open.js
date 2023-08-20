async function checkLoad() {
    const response = await fetch("/content", {
        method: "POST",
        body: JSON.stringify({ 'clientTime': new Date() }),
    });

    const result = await response.json();
    document.body.innerHTML = result.bodyContent;
    document.title = result.title;
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", result.cssFile + ".css");
    link.setAttribute("type", "text/css");
    link.setAttribute("charset", "utf-8");
    document.head.appendChild(link);
  }
