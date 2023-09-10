async function checkLoad() {
  const response = await fetch("/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 'clientTime': new Date() }),
  });
  const result = await response.json();
  document.body.innerHTML = result.content;
  document.title = result.title;
  addStylesheet(result.cssFile)
}

function addStylesheet(name) {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", name + ".css");
  link.setAttribute("type", "text/css");
  link.setAttribute("charset", "utf-8");
  document.head.appendChild(link);
}
