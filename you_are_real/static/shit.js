function init() {

}

function handleMouseMove(evt) {
    const target = document.getElementById("Target");
    const x0 = parseFloat(target.getAttribute("cx"));
    const dX = x0 - evt.clientX;
    const y0 = parseFloat(target.getAttribute("cy"));
    const dY = y0 - evt.clientY;
    const dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    if (dist < 150) {
        const dirX = dX / dist;
        const dirY = dY / dist;
        target.setAttribute("cx", x0 + 50 * dirX);
        target.setAttribute("cy", y0 + 50 * dirY);
    }
}

function handleClick(evt) {

}