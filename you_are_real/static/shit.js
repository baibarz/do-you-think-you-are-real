const TICK_INTERVAL = 50;
const JUMP_DISTANCE = 50;

var nextTick;
var target;
var mouseCoords;

function init() {
    target = document.getElementById("Target");
    nextTick = Number(new Date());
    handleTick();
}

function vec_add(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

function vec_mult(v, a) {
    return {
        x: v.x * a,
        y: v.y * a
    }
}

function vec_dist(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

function handleTick() {
    if (mouseCoords === undefined) {
        setNextTick();
        return;
    }
    const p0 = {
        x: parseFloat(target.getAttribute("cx")),
        y: parseFloat(target.getAttribute("cy"))
    }
    const delta = vec_add(p0, vec_mult(mouseCoords, -1));
    const dist = vec_dist(delta);
    if (dist < 150) {
        const dir = vec_mult(delta, 1 / dist);
        const pF = vec_add(p0, vec_mult(dir, JUMP_DISTANCE));
        target.setAttribute("cx", pF.x);
        target.setAttribute("cy", pF.y);
    }
    setNextTick();
}

function setNextTick() {
    nextTick += TICK_INTERVAL;
    setTimeout(handleTick, Math.max(0, nextTick - Number(new Date())));
}


function handleMouseMove(evt) {
    mouseCoords = {
        x: evt.clientX,
        y: evt.clientY
    }
}

function handleClick(evt) {

}