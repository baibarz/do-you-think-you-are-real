const TICK_INTERVAL = 50;
const CURSOR_JUMP_DIST = 3000;
const REPULSE_JUMP_DIST = 1000;
const R = 50 / 2;
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
        const target = document.createElementNS("http://www.w3.org/2000/svg", "image");
        target.setAttribute("href", "images/poop.svg");
        target.setAttribute("x", Math.random() * (drawArea.clientWidth - 2 * R));
        target.setAttribute("y", Math.random() * (drawArea.clientHeight - 2 * R));
        target.setAttribute("Width", 2 * R);
        target.setAttribute("Height", 2 * R);
        drawArea.appendChild(target);
        targets[i] = target;
    }
    nextTick = Number(new Date());
    handleTick();
}

function getCoords(target) {
    return {
        x: parseFloat(target.getAttribute("x")),
        y: parseFloat(target.getAttribute("y"))
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
    target.setAttribute("x", Math.max(0, Math.min(pos.x, drawArea.clientWidth - 2 * R)));
    target.setAttribute("y", Math.max(0, Math.min(pos.y, drawArea.clientHeight - 2 * R)));
}

function handleTick() {
    if (checkVictory()) {
        return;
    }
    
    // Differences between vector pairs
    const distances = getDistanceMatrix();

    // Compute moves for each element
    for (var i = 0; i < N_TARGETS; i++) {
        const target = targets[i];
        const p0 = getCoords(target);
        const pCenter = {
            x: p0.x + R,
            y: p0.y + R
        }
        
        var pF = p0;
        
        // Movement due to cursor
        if (mouseCoords !== undefined) {
            const delta = vecsAdd(pCenter, vecMult(mouseCoords, -1));
            const dist = vecLen(delta);
            // delta * JUMP_DISTANCE / dist gives a unit vector, so linear dropoff is .. / dist^2
            const step = vecMult(delta, CURSOR_JUMP_DIST / Math.pow(dist, 2));
            pF = vecsAdd(pF, step);
        }
        
        // Movement due to mutual repulsion
        for (var j = 0; j < targets.length; j++) {
            if (j != i) {
                const v = distances[i][j];
                const dst = vecLen(v);
                if (dst === 0) {
                    const vRand = {
                        x: randomRepulse(),
                        y: randomRepulse()
                    }
                    pF = vecsAdd(pF, vRand);
                }
                else {
                    const vu = vecMult(v, 1 / dst);
                    pF = vecsAdd(pF, vecMult(vu, REPULSE_JUMP_DIST / dst));
                }
            }
        }
        
        
        moveBounded(target, pF);
    }
    setNextTick();
}

function randomRepulse() {
    return Math.random() * REPULSE_JUMP_DIST * (Math.round(Math.random() * 2 - 1));
}

function getDistanceMatrix() {
    return targets.map(t1 => targets.map(t2 => vecBetweenTargets(t1, t2)));;
}

function vecBetweenTargets(t1, t2) {
    if (t1 === t2) {
        return 0;
    }
    return vecsAdd(getCoords(t1), vecMult(getCoords(t2), -1));
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
