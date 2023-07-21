function checkLoad() {
    var now = new Date();
    window.location = (now.getHours() < 8 || now.getHours() > 16 ? "closed.html" : "open.html");
}
