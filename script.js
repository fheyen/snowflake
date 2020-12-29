/**
 * Main draw function
 */
function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // Get and set sizes
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = Math.min(w, h) * 0.8;
    canvas.style.width = '100%';
    canvas.style.height = `${window.innerHeight}px`;
    // Rescale canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    // Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
    // Get parameters
    const ratio = +document.getElementById("hexSizeRatioInput").value;
    const pBranch = +document.getElementById("pBranchInput").value;
    const snowflakeRadius = size / 2;
    const hexRadius = snowflakeRadius * ratio;
    // Snowflake
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    if (hexRadius > 0.00001) {
        drawSnowflake(ctx, w / 2, h / 2, snowflakeRadius, hexRadius, pBranch);
    }
}

function toggleParams() {
    const elements = document.getElementsByClassName('paramInput');
    for (let el of elements) {
        if (el.style.display === 'inline') {
            el.style.display = 'none';
        } else {
            el.style.display = 'inline';
        }
    }
}

function hideInfo() {
    const info = document.getElementById('info');
    info.remove();
}

/**
 * Draws a hexagon
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
        // Mirror if startangle !== 0
        if (startAngle !== 0) {
            const y2 = cy - Math.sin(angle) * r;
            points.push({ x, y: y2 });
        }
    }
    return points;
}

/**
 * Draws a hexagon with all 6 symmetrical positions
 */
function drawWithSymmetry(ctx, px, py, cx, cy, hexRadius) {
    const positions = getRotatedPositions(px, py, cx, cy);
    for (let { x, y } of positions) {
        drawHexagon(ctx, x, y, hexRadius);
        ctx.stroke();
        ctx.fill();
    }
}

/**
 * Draws a snowflake
 */
function drawSnowflake(ctx, cx, cy, radius, hexRadius, pBranch) {
    const hexWidth = 2 * Math.cos(30 / 180 * Math.PI) * hexRadius;
    // Center
    if (Math.random() < 0.5) {
        drawHexagon(ctx, cx, cy, hexRadius);
        ctx.fill();
    }
    // Draw only one arm and use symmetry
    const armLength = radius / hexWidth;
    for (let i = 1; i < armLength; i++) {
        const px = cx + hexWidth * i;
        const py = cy;
        drawWithSymmetry(ctx, px, py, cx, cy, hexRadius);
        // Draw a branch from this position with some probability
        if (Math.random() < pBranch) {
            branch(ctx, px, py, cx, cy, hexRadius, hexWidth);
        }
    }
}

/**
 * Draws a branch
 */
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
        // Branch branch
        if (Math.random() < 0.25) {
            branchBranch(ctx, nextX, nextY, cx, cy, hexRadius, hexWidth);
        }
    }
}

/**
 * Draws a branch on a branch
 */
function branchBranch(ctx, px, py, cx, cy, hexRadius, hexWidth) {
    let nextX = px;
    let nextX2 = px;
    let nextY = py;
    while (Math.random() < 0.5) {
        nextX -= hexWidth / 2;
        const yOffset = Math.sin(60 / 180 * Math.PI) * hexWidth;
        nextY += yOffset;
        drawWithSymmetry(ctx, nextX, nextY, cx, cy, hexRadius);
        nextX2 += hexWidth;
        drawWithSymmetry(ctx, nextX2, py, cx, cy, hexRadius);
    }
}
