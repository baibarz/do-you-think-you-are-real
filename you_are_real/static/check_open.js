var userId = -1;
var questionId = 0; // Always starts with "who are you?"

function checkLoad() {
    const request = new XMLHttpRequest();
    request.open("POST", "/content");
    const date = new Date();
    const curernt_time = date.getHours() * 60 + date.getMinutes();
    const request_json = JSON.stringify({"minutes": curernt_time});
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            response_values = JSON.parse(request.responseText);
            const css_link = document.createElement("link");
            css_link.rel = "stylesheet"
            css_link.type = "text/css"
            css_link.href = response_values["css_file"]
            document.head.title = response_values["title"]
            document.head.appendChild(css_link);
            document.body.innerHTML = response_values["body"];
        }
    }
    request.send(request_json);
}
