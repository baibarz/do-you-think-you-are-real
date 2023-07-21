var userId = -1;
var questionId = 0; // Always starts with "who are you?"

function checkLoad() {
    var now = new Date();
    window.location = (now.getHours() < 8 || now.getHours() > 16 ? "closed.html" : "open.html");
}
