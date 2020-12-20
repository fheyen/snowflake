function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.min(w, h) * 0.8;

    canvas.style.width = w;
    canvas.style.height = h;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    // Snowflake
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    // drawHexagon(ctx, w / 2, h / 2, size / 2);
    // ctx.fill();
    // ctx.stroke();

    drawSnowflake(ctx, w / 2, h / 2, size / 2);
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {*} cx
 * @param {*} cy
 * @param {*} radius
 */
function drawHexagon(ctx, cx, cy, radius) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        // Start at 30° so snowflake can be drawn to the right
        const angle = (60 * i + 30) / 180 * Math.PI;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
}

/**
 * For a point px, py at angle 0, returns all other points at rotated positions.
 *
 *                                (px, py)
 *                                   |
 *    (cx, xy) -----------------------
 *
 * @param {*} px
 * @param {*} py
 * @param {*} cx
 * @param {*} cy
 * @param {*} radius
 */
function getRotatedPositions(px, py, cx, cy) {
    const points = [];
    // Start angle between hypotenuse and horizontal
    let startAngle = 0;
    if (py !== cy) {
        const dx = px - cx;
        const dy = py - cy;
        startAngle = Math.atan(dy / dx);
    }

    // Radius
    const r = Math.hypot((px - cx), (py - cy));
    // Get positions
    for (let i = 0; i < 6; i++) {
        const angle = (60 * i) / 180 * Math.PI + startAngle;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        points.push({ x, y });
    }
    return points;
}

function throwDice(sides) {
    return Math.random() < 1 / sides;
}

function drawWithSymmetry(ctx, px, py, cx, cy, hexRadius) {
    const positions = getRotatedPositions(px, py, cx, cy);
    for (let { x, y } of positions) {
        drawHexagon(ctx, x, y, hexRadius);
        ctx.stroke();
        ctx.fill();
        // break;
    }
}

function checkCollision(ctx, px, py, hexRadius) {
    // TODO:
}

function drawSnowflake(ctx, cx, cy, radius) {
    const hexRadius = radius / 100;
    const hexWidth = 2 * Math.cos(30 / 180 * Math.PI) * hexRadius;
    // Center
    drawHexagon(ctx, cx, cy, hexRadius);
    ctx.stroke();
    // Inner rings
    // const nRings = 3;


    // Draw only one arm and use symmetry
    const armLength = radius / hexWidth;
    for (let i = 1; i < armLength; i++) {
        const px = cx + hexWidth * i;
        const py = cy;
        // ctx.strokeStyle = 'gray';
        drawWithSymmetry(ctx, px, py, cx, cy, hexRadius);
        if (throwDice(4)) {
            // ctx.strokeStyle = 'white';
            branch(ctx, px, py, cx, cy, hexRadius, hexWidth);
        }
    }

}

function branch(ctx, px, py, cx, cy, hexRadius, hexWidth) {
    let nextX = px;
    let nextY = py;
    let nextY2 = py;
    while (Math.random() < 0.8) {
        nextX += hexWidth / 2;
        const yOffset = Math.sin(60 / 180 * Math.PI) * hexWidth;
        nextY += yOffset;
        drawWithSymmetry(ctx, nextX, nextY, cx, cy, hexRadius);
        nextY2 -= yOffset;
        drawWithSymmetry(ctx, nextX, nextY2, cx, cy, hexRadius);
    }
}
