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

function submitForm() {
    const request = new XMLHttpRequest();
    const answer = document.getElementById("AnswerInput").innerText;
    if (answer === '') {
        return;
    }
    const data = {
        user_id: userId,
        answer: answer,
        question_id: questionId
    };
    request.open("POST", "/update");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            const response_values = JSON.parse(request.responseText);
            const questionDiv = document.getElementById("MainText");
            questionDiv.innerText = response_values["question"]
            questionId = response_values["question_id"];
            if ("user_id" in response_values) {
                userId = response_values["user_id"];
            }
        }
        if (questionId === null) {
            window.location.href="about:blank";
        }
    };
    request.send(JSON.stringify(data));
    const answerBox = document.getElementById("AnswerInput");
    answerBox.innerHTML = "";
}
