const CURSOR_JUMP_DIST = 3000;
const EPSILON = 1;
const N_TARGETS = 5;
const REPULSE_JUMP_DIST = 100000;
const TARGET_SIZE = 120;
const TICK_INTERVAL = 50;

var clientSize;
var drawArea;
var nextTick;
var margins;
var mouseCoords;
var targets;

/* 
    Some basic vector functions 
*/

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

// Randomly oriented unit vector
function vecRand() {
    const theta = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(theta),
        y: Math.sin(theta)
    }
}

function vecToString(v) {
    return "x: " + v.x + "\ny:" + v.y;
}

function vecBound(v) {
    return {
        x: Math.max(margins.x, Math.min(v.x, clientSize.x - margins.x)),
        y: Math.max(margins.y, Math.min(v.y, clientSize.y - margins.y))
    }
}

/*
    Game logic
*/

function init() {
    drawArea = document.getElementById("DrawArea");
    clientSize = {
        x: drawArea.clientWidth,
        y: drawArea.clientHeight
    };
    margins = {
        x: TARGET_SIZE / 2,
        y: TARGET_SIZE / 2
    };
    targets = new Array(N_TARGETS);
    for (var i = 0; i < N_TARGETS; i++) {
        const pos = {
            x: TARGET_SIZE / 2 + Math.random() * (drawArea.clientWidth - TARGET_SIZE),
            y: TARGET_SIZE / 2 + Math.random() * (drawArea.clientHeight - TARGET_SIZE)
        };
        const target = document.createElementNS("http://www.w3.org/2000/svg", "image");
        target.setAttribute("href", "images/poop.svg");
        target.setAttribute("width", TARGET_SIZE);
        target.setAttribute("height", TARGET_SIZE);
        setItemPosition(target, pos);
        drawArea.appendChild(target);
        targets[i] = {
            "ref": target,
            "pos": pos
        }
    }
    nextTick = Number(new Date());
    handleTick();
}

// Main game loop
function handleTick() {
    if (checkVictory()) {
        return;
    }

    // Differences between vector pairs
    const distances = getDistanceMatrix();

    // Compute moves for each element
    for (var targetIndex = 0; targetIndex < N_TARGETS; targetIndex++) {
        const target = targets[targetIndex];
        var pF = applyMouseRepel(target.pos);
        pF = applyMutualRepel(pF, distances[targetIndex]);
        pF = vecBound(pF);
        target.pos = pF;
        setItemPosition(target.ref, pF);
    }
    setNextTick();
}

function setItemPosition(target, pos) {
    target.setAttribute("x", pos.x - TARGET_SIZE / 2);
    target.setAttribute("y", pos.y - TARGET_SIZE / 2);
}

// Movement due to running away from cursor
function applyMouseRepel(pCenter) {
    if (mouseCoords === undefined) {
        return pCenter;
    }
    const delta = vecsAdd(pCenter, vecMult(mouseCoords, -1));
    const dist = vecLen(delta);
    // delta * JUMP_DISTANCE / dist gives a unit vector, so linear dropoff is .. / dist^2
    const step = vecMult(delta, CURSOR_JUMP_DIST / Math.pow(dist, 2));
    return vecsAdd(pCenter, step);
}

// Movement due to mutual repulsion
function applyMutualRepel(pt0, distances) {
    var pt = pt0;
    for (var targetIndex = 0; targetIndex < distances.length; targetIndex++) {
        const diff = distances[targetIndex];
        const dst = vecLen(diff);
        if (dst === 0) {
            // Add some random jitter
            pt = vecsAdd(pt, vecRand());
        }
        else {
            const vu = vecMult(diff, 1 / dst);
            pt = vecsAdd(pt, vecMult(vu, REPULSE_JUMP_DIST / Math.pow(dst, 2)));
        }
    }
    return pt;
}

// Get an array of distances to all other targets from a given target
function getDistanceMatrix() {
    return targets.map(t1 =>
        targets.map(t2 => vecBetweenTargets(t1, t2)).filter(v => v !== undefined)
    );
}

// Distance between target points, or undefined if the two targets are the same item
function vecBetweenTargets(t1, t2) {
    if (Object.is(t1, t2)) {
        return undefined;
    }
    return vecsAdd(t1.pos, vecMult(t2.pos, -1));
}

function setNextTick() {
    nextTick += TICK_INTERVAL;
    setTimeout(handleTick, Math.max(0, nextTick - Number(new Date())));
}

function checkVictory() {
    for (var i = 1; i < N_TARGETS; i++) {
        if (!vecsEqual(targets[0].pos, targets[i].pos)) { return false; }
    }
    alert("win!");
    for (var i = 0; i < N_TARGETS; i++) {
        drawArea.removeChild(targets[i].ref);
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
    alert("x: " + mouseCoords.x + "\ny: " + mouseCoords.y);
}
