const TICK_INTERVAL = 50;
const JUMP_DISTANCE = 50;
const R_CIRCLE = 50;
const N_TARGETS = 5;

var nextTick;
var drawArea;
var targets;
var mouseCoords;

function init() {
    drawArea = document.getElementById("DrawArea");
    targets = new Array(N_TARGETS);
    for (var i = 0; i < N_TARGETS; i++) {
        const target = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        target.setAttribute("cx", R_CIRCLE + Math.random() * (drawArea.clientWidth - 2 * R_CIRCLE));
        target.setAttribute("cy", R_CIRCLE + Math.random() * (drawArea.clientHeight - 2 * R_CIRCLE));
        target.setAttribute("r", R_CIRCLE);
        drawArea.appendChild(target);
        targets[i] = target;
    }

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

function moveBounded(target, pos) {
    target.setAttribute("cx", Math.max(R_CIRCLE, Math.min(pos.x, drawArea.clientWidth - R_CIRCLE)));
    target.setAttribute("cy", Math.max(R_CIRCLE, Math.min(pos.y, drawArea.clientHeight - R_CIRCLE)));
}

function handleTick() {
    if (mouseCoords === undefined) {
        setNextTick();
        return;
    }
    for (var i = 0; i < N_TARGETS; i++) {
        const target = targets[i];
        const p0 = {
            x: parseFloat(target.getAttribute("cx")),
            y: parseFloat(target.getAttribute("cy"))
        }
        const delta = vec_add(p0, vec_mult(mouseCoords, -1));
        const dist = vec_dist(delta);
        if (dist < 150) {
            const dir = vec_mult(delta, 1 / dist);
            const pF = vec_add(p0, vec_mult(dir, JUMP_DISTANCE));
            moveBounded(target, pF);
        }
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