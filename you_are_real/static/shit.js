const TICK_INTERVAL = 50;
const JUMP_DISTANCE = 50;
const R_CIRCLE = 50;
const N_TARGETS = 5;
const EPSILON = 1;

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
    nextTick = Number(new Date());
    handleTick();
}

function getCoords(target) {
    return {
        x: parseFloat(target.getAttribute("cx")),
        y: parseFloat(target.getAttribute("cy"))
    };
}

function vecsAdd(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

function vecMult(v, a) {
    return {
        x: v.x * a,
        y: v.y * a
    }
}

function vecsEqual(v1, v2) {
    return vecDist(v1, v2) < EPSILON;
}

function vecDist(v1, v2) {
    var delta = vecsAdd(v1, vecMult(v2, -1));
    return vecLen(delta);
}

function vecLen(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

function moveBounded(target, pos) {
    target.setAttribute("cx", Math.max(R_CIRCLE, Math.min(pos.x, drawArea.clientWidth - R_CIRCLE)));
    target.setAttribute("cy", Math.max(R_CIRCLE, Math.min(pos.y, drawArea.clientHeight - R_CIRCLE)));
}

function handleTick() {
    if (checkVictory()) {
        return;
    }
    if (mouseCoords === undefined) {
        setNextTick();
        return;
    }
    for (var i = 0; i < N_TARGETS; i++) {
        const target = targets[i];
        const p0 = getCoords(target);
        const delta = vecsAdd(p0, vecMult(mouseCoords, -1));
        const dist = vecLen(delta);
        if (dist < 150) {
            const dir = vecMult(delta, 1 / dist);
            const pF = vecsAdd(p0, vecMult(dir, JUMP_DISTANCE));
            moveBounded(target, pF);
        }
    }
    setNextTick();
}

function setNextTick() {
    nextTick += TICK_INTERVAL;
    setTimeout(handleTick, Math.max(0, nextTick - Number(new Date())));
}

function checkVictory() {
    const coords = getCoords(targets[0]);
    for (var i = 1; i < N_TARGETS; i++) {
        if (!vecsEqual(coords, getCoords(targets[i]))) { return false; }
    }
    alert("win!");
    for (var i = 0; i < N_TARGETS; i++) {
        drawArea.removeChild(targets[i]);
    }
    return true;
}

function handleMouseMove(evt) {
    mouseCoords = {
        x: evt.clientX,
        y: evt.clientY
    }
}

function handleClick(evt) {

}