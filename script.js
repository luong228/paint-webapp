
// Get element
const canvas = document.getElementById("canvas-area");
const openImage = document.getElementById('openImage');
const imageLoader = document.getElementById('imageLoader');
const magnifier = document.getElementById("magnifier")
const fillBtn = document.getElementById("fill")
const textBtn = document.getElementById("text")
const colorpickerBtn = document.getElementById("color-picker")
const shapeFill = document.getElementById("shape-fill")
const eraserBtn = document.getElementById("eraser")
const toggleGridLink = document.getElementById('toggleGrid');
const toggleRulerButton = document.getElementById('toggle-ruler');
const undoButton = document.getElementById('undoBtn');
const redoButton = document.getElementById('redoBtn');
const dataUrl = document.getElementById("canvas-area").toDataURL();
const canvasSizeSpan = document.getElementById('canvas-size');
const mousePositionSpan = document.getElementById('mouse-position');
const colorSpan = document.getElementById('color');
const toggleStatusBarLink = document.getElementById('toggle-status-bar');
const statusBar = document.getElementById('status-bar');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const confirmModal = document.getElementById("confirmNewModal")

//Query
const shapeBtns = document.querySelectorAll(".shape")
const pencilBtn = document.querySelector("#pencil")
const btnsFocus = document.querySelectorAll('.btn-focus');
const saveButtons = document.querySelectorAll(".save");
const saveAsPNG = document.querySelector("#saveAsPNG");
const saveAsBMP = document.querySelector("#saveAsBMP");
const saveAsJPEG = document.querySelector("#saveAsJPEG");
const saveAsGIF = document.querySelector("#saveAsGIF");
const saveAsOther = document.querySelector("#saveAsOther");
const newBtn = document.querySelector("#newCanvas")
const printBtn = document.querySelector("#printBtn");
const brushItems = document.querySelectorAll(".brush-item");
const sizeItems = document.querySelectorAll(".size-item")
const colorBtns = document.querySelectorAll(".colors-btn .option");
const primaryColor = document.querySelector(".primary-color1")

const context = canvas.getContext("2d");
context.canvas.willReadFrequently = true;

//Shapes
let currentShape = null
let isDrawingShape = false;
let prevMouseX, prevMouseY, snapshot

let isDrawing = true;
let isErasing = false;
let isMouseDown = false;
let isMagnifier = false;
let isFill = false;
let isText = false;
let isColorpicker = false;
let zoomLevel = 1;
let color = "black";
let fontSize = 14;
context.font = `${fontSize}px Arial`;
//brush
let brushSize = 2;
let currentBrush = null;
let calligraphyBrushPoints = [];
let calligraphyPenPoints = [];
let oilBrushPoints = [];
let oilBrushOpacity = 0.5;
let crayonOpacity = 0.5;
let crayonPoints = [];
let crayonDistance = 5;

shapeBtns.forEach(shape => {
    shape.addEventListener('click', (e) => {
        isDrawingShape = toggleFocus();
        currentShape = shape.id;
    })
})

shapeFill.addEventListener('click', () => {
    shapeFill.classList.toggle("selected")
})

openImage.addEventListener('click', function () {
    imageLoader.click();
});


magnifier.addEventListener('click', () => {
    isMagnifier = true;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('magnifier.svg'), auto;} </style>");
})

//Fill
fillBtn.addEventListener('click', () => {
    isFill = true;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('fill.svg'), auto;} </style>");
})

//Text
textBtn.addEventListener('click', () => {
    isText = true;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('text.png'), auto;} </style>");
})

//Color picker
colorpickerBtn.addEventListener('click', () => {

    isColorpicker = toggleFocus();

    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('colorpicker.png'), auto;} </style>");
})

// Tools
pencilBtn.classList.add("btn-focus_focus")
btnsFocus.forEach(function (button) {
    button.addEventListener("click", function () {
        button.classList.add("btn-focus_focus")
        btnsFocus.forEach(function (otherButton) {
            if (otherButton != button) {
                otherButton.classList.remove("btn-focus_focus");
            }
        })
    });
});

const toggleFocus = () => {
    isDrawing = false;
    isErasing = false;
    currentBrush = null;
    isMagnifier = false;
    isFill = false;
    isText = false;
    isColorpicker = false;
    isDrawingShape = false;
    currentShape = null;

    return true;
}
//pencilbtn
pencilBtn.addEventListener("click", () => {
    isDrawing = toggleFocus(isDrawing)

    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('pencil.svg'), auto;} </style>");
    this.focus();
})

eraserBtn.addEventListener("click", () => {
    isErasing = toggleFocus()

    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('square.svg'), auto;} </style>");
    this.focus();
})

// Magnifier
canvas.addEventListener("click", function (event) {
    if (isMagnifier) {
        const zoomDelta = event.deltaY > 0 ? 1 / 1.1 : 1.1;
        zoomLevel *= zoomDelta;

        canvas.width = canvas.width * zoomLevel;
        canvas.height = canvas.height * zoomLevel;
        context.scale(zoomDelta, zoomDelta);
        context.scale(1 / zoomDelta, 1 / zoomDelta);
    }
    if (isFill) {

        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (isText) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        const text = prompt("Enter text:");

        if (text !== null && text !== "") {
            context.fillStyle = color;
            context.fillText(text, x, y + fontSize);
        }
    }
    if (isColorpicker) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        const imageData = context.getImageData(x, y, 1, 1);
        color = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);

        console.log(color);
        primaryColor.style.backgroundColor = color;
        if (color == 'rgb(255, 255, 255)')
            primaryColor.style.border = '1px solid #bfbfbf'
        else {
            primaryColor.style.border = 'none'
        }

        console.log(color);
        isColorpicker = false;
        pencilBtn.click();
    }
});
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

}
//image loader
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}


//Gridlines
let showGrid = false;
const gridSize = 10;
const gridColor = '#ddd';

let image = new Image();

function drawGrid() {
    context.beginPath();
    context.strokeStyle = gridColor;
    for (let i = gridSize + 0.5; i < canvas.width; i += gridSize) {
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
    }
    for (let i = gridSize + 0.5; i < canvas.height; i += gridSize) {
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
    }
    context.stroke();
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(image, 0, 0);
    if (showGrid) {
        toggleGridLink.classList.add('view-active');
        drawGrid();
    }
    else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        toggleGridLink.classList.remove('view-active');
    }
}

function toggleGrid() {
    showGrid = !showGrid;
    redraw();
}

image.onload = function () {
    redraw();
}


toggleGridLink.addEventListener('click', function (e) {
    e.preventDefault();
    image.src = canvas.toDataURL();
    toggleGrid();
});

//Rulers
const rulerSize = 20;
const rulerColor = '#000';
const rulerFont = '12px Arial';

let showRuler = false;

function drawRulers() {
    if (!showRuler) {
        toggleRulerButton.classList.remove('view-active')
        context.clearRect(rulerSize + 1, 0, canvas.width - rulerSize - 0.5, rulerSize + 1);
        context.clearRect(0, rulerSize + 1, rulerSize + 1, canvas.height - rulerSize - 0.5);
        return
    }
    toggleRulerButton.classList.add('view-active')
    context.beginPath();
    context.strokeStyle = rulerColor;

    context.moveTo(rulerSize + 0.5, 0);
    context.lineTo(rulerSize + 0.5, canvas.height);
    context.stroke();

    context.moveTo(0, rulerSize + 0.5);
    context.lineTo(canvas.width, rulerSize + 0.5);
    context.stroke();

    context.font = rulerFont;
    context.fillStyle = rulerColor;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    for (let i = rulerSize; i < canvas.width; i += rulerSize) {
        context.moveTo(i + 0.5, rulerSize);
        context.lineTo(i + 0.5, rulerSize / 2);
        context.fillText(i.toString(), i + 0.5, 2);
    }
    for (let i = rulerSize; i < canvas.height; i += rulerSize) {
        context.moveTo(rulerSize, i + 0.5);
        context.lineTo(rulerSize / 2, i + 0.5);
        context.fillText(i.toString(), 2, i + 0.5);
    }
    context.stroke();
}

function toggleRuler() {
    showRuler = !showRuler;
    drawRulers();
}

toggleRulerButton.addEventListener('click', toggleRuler);
//Undo - Redo


const history = [];
let currentState = null;
let currentStateIndex = -1;

function saveState() {
    const state = canvas.toDataURL();
    if (currentStateIndex < history.length - 1) {
        history.splice(currentStateIndex + 1);
    }
    history.push(state);
    currentStateIndex++;
    updateButtons();
}

function undo() {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        const state = new Image();
        state.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(state, 0, 0);
            updateButtons();
        };
        state.src = history[currentStateIndex];
    }
}

function redo() {
    if (currentStateIndex < history.length - 1) {
        currentStateIndex++;
        const state = new Image();
        state.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(state, 0, 0);
            updateButtons();
        };
        state.src = history[currentStateIndex];
    }
}

function updateButtons() {
    undoButton.disabled = currentStateIndex <= 0;
    redoButton.disabled = currentStateIndex >= history.length - 1;
}

canvas.addEventListener('mousedown', function (event) {
    saveState();
});

undoButton.addEventListener('click', function (event) {
    undo();
});

redoButton.addEventListener('click', function (event) {
    redo();
});

updateButtons();




canvas.addEventListener("mousedown", (event) => {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    if (isMagnifier || isFill || isText || isColorpicker) return
    if (isDrawing) {
        if (currentBrush == null) {
            context.beginPath();
            context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        }
        else if (currentBrush === "brush") {
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fill();
        }
        else if (currentBrush == "airBrush") {
            let airbrushShape = createAirbrushShape(brushSize);

            for (var i = 0; i < airbrushShape.length; i++) {
                let offsetX = airbrushShape[i][0];
                let offsetY = airbrushShape[i][1];
                let alpha = airbrushShape[i][2];
                let brushX = x + offsetX;
                let brushY = y + offsetY;
                // let color = "rgba(0, 0, 0, " + alpha + ")";
                context.fillStyle = color;
                context.fillRect(brushX, brushY, 1, 1);
            }
        }
        else if (currentBrush == "calligraphyBrush") {
            calligraphyBrushPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            })
        }
        else if (currentBrush == "calligraphyPen") {
            calligraphyPenPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });
        }
        else if (currentBrush == "oilBrush") {
            oilBrushPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });
        }
        else if (currentBrush == "crayon") {
            crayonPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });
        }
        else if (currentBrush == "marker") {
            context.beginPath();
            context.fillStyle = "yellow";
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fill();
            context.lineWidth = 2;
        }
        else if (currentBrush == "naturalPencil") {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.lineWidth = brushSize;
            context.lineCap = "round";
        }
        else if (currentBrush == "watercolorBrush") {
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }
        context.strokeStyle = color;
        context.stroke();
    }
    else if (isDrawingShape) {
        prevMouseX = event.offsetX;
        prevMouseY = event.offsetY;
        context.beginPath();
        context.lineWidth = brushSize;
        context.strokeStyle = color;
        context.fillStyle = color;
        snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    else if (isErasing) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, 15)
    }
    isMouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (!isMouseDown)
        return;
    if (isMagnifier || isFill || isText || isColorpicker) return
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    if (isDrawing) {
        if (currentBrush == null) {
            context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        }
        else if (currentBrush == "brush") {
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fill();
        }

        else if (currentBrush == "airBrush") {
            let airbrushShape = createAirbrushShape(brushSize);

            for (var i = 0; i < airbrushShape.length; i++) {
                let offsetX = airbrushShape[i][0];
                let offsetY = airbrushShape[i][1];
                let alpha = airbrushShape[i][2];
                let brushX = x + offsetX;
                let brushY = y + offsetY;
                let color = "rgba(0, 0, 0, " + alpha + ")";
                context.fillStyle = color;
                context.fillRect(brushX, brushY, 1, 1);
            }
        }
        else if (currentBrush == "calligraphyBrush") {
            calligraphyBrushPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            })

            // Vẽ Calligraphy brush
            context.lineCap = "round";
            context.lineJoin = "round";
            context.lineWidth = brushSize;
            for (var i = 1; i < calligraphyBrushPoints.length; i++) {
                var point1 = calligraphyBrushPoints[i - 1];
                var point2 = calligraphyBrushPoints[i];
                var distance = Math.sqrt(
                    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
                );
                var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
                for (var j = 0; j < distance; j += brushSize / 2) {
                    x = point1.x + Math.cos(angle) * j;
                    y = point1.y + Math.sin(angle) * j;
                    let radius =
                        brushSize / 2 -
                        (j / distance) * (brushSize / 2);
                    context.beginPath();
                    context.arc(x, y, radius, angle + Math.PI / 2, angle - Math.PI / 2);
                    context.stroke();
                }
            }
        }
        else if (currentBrush == "calligraphyPen") {
            calligraphyPenPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });
            context.strokeStyle = "black";
            context.lineCap = "round";
            context.lineJoin = "round";
            context.lineWidth = brushSize;
            for (var i = 1; i < calligraphyPenPoints.length; i++) {
                var point1 = calligraphyPenPoints[i - 1];
                var point2 = calligraphyPenPoints[i];
                var distance = Math.sqrt(
                    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
                );
                var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
                var radius = brushSize / 2;
                context.beginPath();
                context.arc(point1.x, point1.y, radius, angle + Math.PI / 2, angle - Math.PI / 2);
                context.arc(point2.x, point2.y, radius, angle - Math.PI / 2, angle + Math.PI / 2);
                context.closePath();
                context.fill();
            }
        }
        else if (currentBrush == "oilBrush") {
            // console.log('oil');
            oilBrushPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });

            context.strokeStyle = color;
            context.lineCap = "round";
            context.lineWidth = brushSize;
            context.globalAlpha = oilBrushOpacity;
            context.beginPath();
            context.moveTo(oilBrushPoints[0].x, oilBrushPoints[0].y);
            for (var i = 1; i < oilBrushPoints.length; i++) {
                var point1 = oilBrushPoints[i - 1];
                var point2 = oilBrushPoints[i];
                var distance = Math.sqrt(
                    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
                );
                var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
                var radius = brushSize / 2;
                for (var j = 0; j < distance; j++) {
                    x = point1.x + Math.sin(angle) * j * radius;
                    y = point1.y + Math.cos(angle) * j * radius;
                    context.lineTo(x, y);
                }
            }
            context.stroke();
        }

        else if (currentBrush == "crayon") {
            crayonPoints.push({
                x: event.clientX - canvas.offsetLeft,
                y: event.clientY - canvas.offsetTop
            });

            // Vẽ Crayon
            context.strokeStyle = color;
            context.lineCap = "round";
            context.lineWidth = brushSize;
            context.globalAlpha = crayonOpacity;
            context.beginPath();
            var splinePoints = getCurvePoints(crayonPoints);
            context.moveTo(splinePoints[0].x, splinePoints[0].y);
            for (var i = 1; i < splinePoints.length; i++) {
                var point = splinePoints[i];
                context.lineTo(point.x, point.y);
            }
            context.stroke();
        }
        else if (currentBrush == "marker") {
            context.beginPath();
            context.fillStyle = color;
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fill();
            context.lineWidth = brushSize;
        }
        else if (currentBrush == "naturalPencil") {
            context.lineTo(x, y);
            context.stroke();
        }
        else if (currentBrush == "watercolorBrush") {
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }
        context.strokeStyle = color;
        context.stroke();
    }
    else if (isDrawingShape) {
        context.putImageData(snapshot, 0, 0);
        if (currentShape == "rounded-square") {
            if (!shapeFill.classList.contains("selected")) {
                return context.strokeRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);
            }
            context.fillRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);
        }
        else if (currentShape == "circle") {
            context.beginPath(); 
            
            let radius = Math.sqrt(Math.pow((prevMouseX - event.offsetX), 2) + Math.pow((prevMouseY - event.offsetY), 2));
            context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); 

            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 

        }
        else if (currentShape == "triangle") {
            context.beginPath(); 
            context.moveTo(prevMouseX, prevMouseY); 
            context.lineTo(event.offsetX, event.offsetY); 
            context.lineTo(prevMouseX * 2 - event.offsetX, event.offsetY); 
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "line") {
            context.beginPath(); 
            context.moveTo(prevMouseX, prevMouseY); 
            context.lineTo(event.offsetX - (event.offsetX - prevMouseX) / 2, prevMouseY + (event.offsetY - prevMouseY) / 2);
            context.lineTo(event.offsetX, event.offsetY);
            context.lineTo(prevMouseX + (event.offsetX - prevMouseX) / 2, event.offsetY - (event.offsetY - prevMouseY) / 2);
            context.closePath(); 
            context.stroke(); 
        }
        else if (currentShape == "heart") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let width = distanceX * 2;
            let height = distanceY * 2;
            let centerX = prevMouseX;
            let centerY = prevMouseY - distanceY;

            if (event.offsetX < prevMouseX) {
                centerX = event.offsetX;
            }
            if (event.offsetY < prevMouseY) {
                centerY = prevMouseY - height;
            }

            context.beginPath(); 
            context.moveTo(centerX, centerY + height / 4);
            context.bezierCurveTo(centerX - width / 2, centerY - height / 2, centerX - width, centerY, centerX, centerY + height);
            context.bezierCurveTo(centerX + width, centerY, centerX + width / 2, centerY - height / 2, centerX, centerY + height / 4);
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "hexagon") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let radius = Math.max(distanceX, distanceY);
            let height = radius * Math.sqrt(3);
            let width = radius * 2;
            let centerX = prevMouseX;
            let centerY = prevMouseY;

            if (event.offsetX < prevMouseX) {
                centerX = event.offsetX;
            }
            if (event.offsetY < prevMouseY) {
                centerY = event.offsetY;
            }

            context.beginPath(); 
            context.moveTo(centerX + radius, centerY);
            for (let i = 1; i <= 6; i++) {
                let angle = i * Math.PI / 3;
                let x = centerX + radius * Math.cos(angle);
                let y = centerY + radius * Math.sin(angle);
                context.lineTo(x, y);
            }
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "lightning") {
            context.beginPath(); 
            context.moveTo(prevMouseX, prevMouseY + 10);
            context.lineTo(prevMouseX + 10, prevMouseY + 10);
            context.lineTo(prevMouseX - 5, prevMouseY - 10);
            context.lineTo(event.offsetX, event.offsetY - 10);
            context.lineTo(event.offsetX - 10, event.offsetY - 20);
            context.lineTo(prevMouseX + 5, prevMouseY + 20);
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "star") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let radius = Math.max(distanceX, distanceY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;

            if (event.offsetX < prevMouseX) {
                centerX = event.offsetX;
            }
            if (event.offsetY < prevMouseY) {
                centerY = event.offsetY;
            }

            let points = 5;
            let outerRadius = radius;
            let innerRadius = radius / 2;
            let rotation = Math.PI / 2 * 3;
            let x = centerX;
            let y = centerY;
            let step = Math.PI / points;

            context.beginPath(); 
            context.moveTo(centerX, centerY - outerRadius);
            for (let i = 0; i < points; i++) {
                x = centerX + Math.cos(rotation) * outerRadius;
                y = centerY + Math.sin(rotation) * outerRadius;
                context.lineTo(x, y);
                rotation += step;
                x = centerX + Math.cos(rotation) * innerRadius;
                y = centerY + Math.sin(rotation) * innerRadius;
                context.lineTo(x, y);
                rotation += step;
            }
            context.lineTo(centerX, centerY - outerRadius);
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "rectangle") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let size = Math.min(distanceX, distanceY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
        
            if (event.offsetX < prevMouseX) {
                centerX = event.offsetX;
            }
            if (event.offsetY < prevMouseY) {
                centerY = event.offsetY;
            }
        
            let radius = size / 4; 
            let x = centerX - size / 2;
            let y = centerY - size / 2;
        
            context.beginPath(); 
            context.moveTo(x + radius, y);
            context.lineTo(x + size - radius, y);
            context.arc(x + size - radius, y + radius, radius, -Math.PI / 2, 0);
            context.lineTo(x + size, y + size - radius);
            context.arc(x + size - radius, y + size - radius, radius, 0, Math.PI / 2);
            context.lineTo(x + radius, y + size);
            context.arc(x + radius, y + size - radius, radius, Math.PI / 2, Math.PI);
            context.lineTo(x, y + radius);
            context.arc(x + radius, y + radius, radius, Math.PI, -Math.PI / 2);
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "right-triangle") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
        
            if (event.offsetX < prevMouseX) {
                centerX = event.offsetX;
            }
        
            if (event.offsetY < prevMouseY) {
                centerY = event.offsetY;
            }
        
            let x1 = centerX;
            let y1 = centerY;
            let x2 = event.offsetX;
            let y2 = centerY;
            let x3 = centerX;
            let y3 = event.offsetY;
        
            context.beginPath(); 
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.closePath(); 
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke(); 
        }
        else if (currentShape == "cloud") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX * 1.5;
            let height = distanceY * 1.2;
          
            let radius = 20;
          
            context.beginPath();
            context.moveTo(centerX + radius, centerY);
            context.lineTo(centerX + width - radius, centerY);
            context.quadraticCurveTo(centerX + width, centerY, centerX + width, centerY + radius);
            context.lineTo(centerX + width, centerY + height - radius);
            context.quadraticCurveTo(centerX + width, centerY + height, centerX + width - radius, centerY + height);
            context.lineTo(centerX + radius, centerY + height);
            context.quadraticCurveTo(centerX, centerY + height, centerX, centerY + height - radius);
            context.lineTo(centerX, centerY + radius);
            context.quadraticCurveTo(centerX, centerY, centerX + radius, centerY);
            context.closePath();
          
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke();
          }
          else if (currentShape == "right-arrow") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX * 1.2;
            let height = distanceY;
          
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(centerX + width - height / 2, centerY);
            context.lineTo(centerX + width - height / 2, centerY - height / 2);
            context.lineTo(centerX + width, centerY);
            context.lineTo(centerX + width - height / 2, centerY + height / 2);
            context.lineTo(centerX + width - height / 2, centerY);
            context.lineTo(centerX, centerY);
            context.closePath();
          
            if(shapeFill.classList.contains("selected")) {
                
                context.fill();
                context.stroke();
            }
            else {
                context.stroke();
            }
          }
          else if (currentShape == "left-arrow") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX * 1.2;
            let height = distanceY;
          
            context.beginPath();
            context.moveTo(centerX + width, centerY);
            context.lineTo(centerX + height / 2, centerY);
            context.lineTo(centerX + height / 2, centerY - height / 2);
            context.lineTo(centerX, centerY);
            context.lineTo(centerX + height / 2, centerY + height / 2);
            context.lineTo(centerX + height / 2, centerY);
            context.lineTo(centerX + width, centerY);
            context.closePath();
          
            if(shapeFill.classList.contains("selected")) {
                
                context.fill();
                context.stroke();
            }
            else {
                context.stroke();
            }
          }
          else if (currentShape == "top-arrow") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX;
            let height = distanceY * 1.2;
          
            context.beginPath();
            context.moveTo(centerX, centerY + height);
            context.lineTo(centerX, centerY + height / 2);
            context.lineTo(centerX - width / 2, centerY + height / 2);
            context.lineTo(centerX, centerY);
            context.lineTo(centerX + width / 2, centerY + height / 2);
            context.lineTo(centerX, centerY + height / 2);
            context.lineTo(centerX, centerY + height);
            context.closePath();
          
            if(shapeFill.classList.contains("selected")) {    
                context.fill();
                context.stroke();
            }
            else {
                context.stroke();
            }
          }
          else if (currentShape == "bot-arrow") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX * 1.2;
            let height = distanceY;
          
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(centerX - width / 2, centerY - height / 2);
            context.lineTo(centerX - width / 2, centerY);
            context.lineTo(centerX - width, centerY);
            context.lineTo(centerX, centerY + height);
            context.lineTo(centerX + width, centerY);
            context.lineTo(centerX + width / 2, centerY);
            context.lineTo(centerX + width / 2, centerY - height / 2);
            context.lineTo(centerX, centerY);
            context.closePath();
          
            if(shapeFill.classList.contains("selected")) {
                
                context.fill();
                context.stroke();
            }
            else {
                context.stroke();
            }
          }
          else if (currentShape == "diamond") {
            let distanceX = Math.abs(event.offsetX - prevMouseX) / 2;
            let distanceY = Math.abs(event.offsetY - prevMouseY) / 2;
            let centerX = prevMouseX + distanceX;
            let centerY = prevMouseY + distanceY;
          
            context.beginPath();
            context.moveTo(centerX, centerY - distanceY);
            context.lineTo(centerX - distanceX, centerY);
            context.lineTo(centerX, centerY + distanceY);
            context.lineTo(centerX + distanceX, centerY);
            context.lineTo(centerX, centerY - distanceY);
            context.closePath();
          
            shapeFill.classList.contains("selected") ? context.fill() : context.stroke();
          }
          else if (currentShape == "lightning") {
            let distanceX = Math.abs(event.offsetX - prevMouseX);
            let distanceY = Math.abs(event.offsetY - prevMouseY);
            let centerX = prevMouseX;
            let centerY = prevMouseY;
          
            if (event.offsetX < prevMouseX) {
              centerX = event.offsetX;
            }
          
            if (event.offsetY < prevMouseY) {
              centerY = event.offsetY;
            }
          
            let width = distanceX;
            let height = distanceY * 1.5;
          
            context.beginPath();
            context.moveTo(centerX, centerY + height);
            context.lineTo(centerX + width / 2, centerY + height / 3);
            context.lineTo(centerX + width / 4, centerY + height / 3);
            context.lineTo(centerX + width / 4, centerY);
            context.lineTo(centerX + width, centerY - height / 3);
            context.lineTo(centerX - width / 2, centerY - height / 3);
            context.lineTo(centerX - width / 4, centerY - height / 3);
            context.lineTo(centerX - width / 4, centerY);
            context.lineTo(centerX - width, centerY + height / 3);
            context.lineTo(centerX, centerY + height);
            context.closePath();
          
            if(shapeFill.classList.contains("selected")) {
                context.fill();
                context.stroke();
            }
            else {
                context.stroke();
            }
          }
    }
    else if (isErasing) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, 15)
    }
});

canvas.addEventListener("mouseup", (event) => {

    isMouseDown = false;

    if (currentBrush == "calligraphyBrush") {
        calligraphyBrushPoints = [];
    }
    if (currentBrush == "calligraphyPen") {
        calligraphyPenPoints = [];
    }
    if (currentBrush == "oilBrush") {
        oilBrushPoints = [];
    }
    if (currentBrush == "crayon") {
        crayonPoints = [];
    }
});

function createAirbrushShape(size) {
    var shape = [];

    var density = Math.ceil(size / 4);
    var radius = size / 2;
    for (var x = -radius; x <= radius; x += density) {
        for (var y = -radius; y <= radius; y += density) {
            var distance = Math.sqrt(x * x + y * y);
            if (distance <= radius) {
                var alpha = 1 - distance / radius;
                shape.push([x, y, alpha]);
            }
        }
    }

    return shape;
}
// Menu 


saveButtons.forEach((item) => {
    item.addEventListener("click", () => {
        const link = document.createElement('a');
        link.download = 'untitled.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    )
})


saveAsPNG.addEventListener("click", function () {

    const image = canvas.toDataURL("image/png");

    const blob = new Blob([image], { type: "image/png" });

    const fileName = prompt("Enter a file name", "untitled.png");

    if (fileName != null) {

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 0);
    }
});

saveAsBMP.addEventListener("click", function () {

    const image = canvas.toDataURL("image/bmp");

    const blob = new Blob([image], { type: "image/bmp" });

    const fileName = prompt("Enter a file name", "untitled.bmp");

    if (fileName != null) {

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 0);
    }
});

saveAsJPEG.addEventListener("click", function () {

    const image = canvas.toDataURL("image/jpeg");

    const blob = new Blob([image], { type: "image/jpeg" });

    const fileName = prompt("Enter a file name", "untitled.jpeg");

    if (fileName != null) {

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 0);
    }
});

saveAsGIF.addEventListener("click", function () {

    const image = canvas.toDataURL("image/gif");

    const blob = new Blob([image], { type: "image/gif" });

    const fileName = prompt("Enter a file name", "untitled.gif");

    if (fileName != null) {

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 0);
    }
});

saveAsOther.addEventListener("click", function () {

    const image = canvas.toDataURL("image/png");

    const blob = new Blob([image], { type: "image/png" });

    const fileName = prompt("Enter a file name", "untitled.png");

    if (fileName != null) {

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();

        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 0);
    }
});

newBtn.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
})
function printCanvas() {
    
    let windowContent = '<!DOCTYPE html><html><head><title>Print</title></head><body><img src="' + dataUrl + '"></body></html>';
    const printWin = window.open("", "", "width=" + screen.availWidth + ",height=" + screen.availHeight);
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.addEventListener("load", function () {
        printWin.focus();
        printWin.print();
        setTimeout(function () {
            printWin.document.close();
            printWin.close();
        }, 901);
    }, true);
}

printBtn.addEventListener("click", printCanvas)

$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass('show');
    });


    return false;
});

// status bar






function updateStatusBar() {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    const color = '#000000';

    canvasSizeSpan.textContent = `${canvasWidth} x ${canvasHeight}`;
    mousePositionSpan.textContent = `(${mouseX}, ${mouseY})`;
    colorSpan.textContent = `Color: ${color}`;
}

canvas.addEventListener('mousemove', updateStatusBar);

toggleStatusBarLink.addEventListener('click', function () {
    statusBar.classList.toggle('hidden');
    toggleStatusBarLink.classList.toggle('view-active');
});

//fullscreen


function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (document.fullscreenElement) {
        exitFullscreen();
    } else {
        requestFullscreen(document.documentElement);
    }
});


brushItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        currentBrush = item.id;
    })
})


sizeItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        brushSize = item.getAttribute("value");
        item.classList.add('size-focus')
        sizeItems.forEach((otherItem) => {
            if (item != otherItem)
                otherItem.classList.remove('size-focus')
        })
    })
})
function getCurvePoints(points) {
    var curvePoints = [];
    var tDelta = 0.1;
    for (var t = 0; t <= 1; t += tDelta) {
        var x = 0;
        var y = 0;
        var n = points.length - 1;
        for (var i = 0; i <= n; i++) {
            var b = binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
            x += points[i].x * b;
            y += points[i].y * b;
        }
        curvePoints.push({ x: x, y: y });
    }
    curvePoints.push(points[points.length - 1]);
    return curvePoints;
}

function binomialCoefficient(n, k) {
    var coeff = 1;
    for (var i = n - k + 1; i <= n; i++) {
        coeff *= i;
    }
    for (var i = 1; i <= k; i++) {
        coeff /= i;
    }
    return coeff;
}

//Rotate

function rotateCanvas(canvas, degrees) {
    const radians = degrees * Math.PI / 180;
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;

    let rotatedCanvas;
    if (degrees === 90 || degrees === -90) {
        rotatedCanvas = document.createElement('canvas');
        rotatedCanvas.width = imageHeight;
        rotatedCanvas.height = imageWidth;
    } else {
        rotatedCanvas = document.createElement('canvas');
        rotatedCanvas.width = imageWidth;
        rotatedCanvas.height = imageHeight;
    }

    const rotatedContext = rotatedCanvas.getContext('2d');

    if (degrees === 90) {
        rotatedContext.translate(rotatedCanvas.width, 0);
        rotatedContext.rotate(radians);
    } else if (degrees === -90) {
        rotatedContext.translate(0, rotatedCanvas.width);
        rotatedContext.rotate(radians);
    } else if (degrees === 180) {
        rotatedContext.translate(rotatedCanvas.width, 0);
        rotatedContext.scale(-1, 1);
    }

    rotatedContext.drawImage(canvas, 0, 0);

    return rotatedCanvas;
}

document.getElementById("rotateRight90").addEventListener("click", function () {

    const rotatedCanvas = rotateCanvas(canvas, 90);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(rotatedCanvas, 0, 0)
});

document.getElementById("rotateLeft90").addEventListener("click", function () {
    const rotatedCanvas = rotateCanvas(canvas, -90)
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(rotatedCanvas, 0, 0)
});
document.getElementById("rotate180").addEventListener("click", function () {
    const rotatedCanvas = rotateCanvas(canvas, 180);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(rotatedCanvas, 0, 0)
});
//flip
function flipCanvas(canvas, direction) {
    const flipedCanvas = document.createElement('canvas');
    const flipedContext = flipedCanvas.getContext('2d')
    flipedCanvas.width = canvas.width;
    flipedCanvas.height = canvas.height

    if (direction === 'horizontal') {
        flipedContext.scale(-1, 1);
        flipedContext.drawImage(canvas, -canvas.width, 0, canvas.width, canvas.height);
    } else if (direction === 'vertical') {
        flipedContext.scale(1, -1);
        flipedContext.drawImage(canvas, 0, -canvas.height, canvas.width, canvas.height);
    }

    return flipedCanvas;
}
document.getElementById("flipVertical").addEventListener("click", function () {

    const flipedCanvas = flipCanvas(canvas, "vertical");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(flipedCanvas, 0, 0)
});
document.getElementById("flipHorizontal").addEventListener("click", function () {

    const flipedCanvas = flipCanvas(canvas, "horizontal");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(flipedCanvas, 0, 0)
});


//Hotkey section

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        $('#confirmNewModal').modal();
    }
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        $('.save').click();
    }
    if (event.ctrlKey && event.key === 'o') {
        event.preventDefault();
        $('#openImage').click();
    }

    if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        $('#imgpropertiesModal').modal();
    }
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        $('#toggle-ruler').click();
    }
    if (event.ctrlKey && event.key === 'g') {
        event.preventDefault();
        $('#toggleGrid').click();
    }
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        $('#undoBtn').click();
    }
    if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        $('#redoBtn').click();
    }
});

//colors


colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // color =window.getComputedStyle(btn).getPropertyValue("fill")

        color = window.getComputedStyle(btn).getPropertyValue("background-color");
        
        console.log(color);
        primaryColor.style.backgroundColor = color;
        if (color == 'rgb(255, 255, 255)')
            primaryColor.style.border = '1px solid #bfbfbf'
        else {
            primaryColor.style.border = 'none'
        }
    })
})
