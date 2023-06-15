const canvas = document.getElementById("canvas-area");
const context = canvas.getContext("2d");
let isDrawing = true;
let isErasing = false;
let isMouseDown = false;
let color = "black";

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

const openImage = document.getElementById('openImage');
const imageLoader = document.getElementById('imageLoader');
openImage.addEventListener('click', function () {
    imageLoader.click(); // Kích hoạt phần tử <input type="file"> ẩn
});

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
    console.log('redraw');
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

const toggleGridLink = document.getElementById('toggleGrid');
toggleGridLink.addEventListener('click', function (e) {
    e.preventDefault();
    image.src = canvas.toDataURL();
    toggleGrid();
});

//Rulers
const rulerSize = 20;
const rulerColor = '#000';
const rulerFont = '12px Arial';

let showRuler = false; // Biến Boolean lưu trạng thái của dải đo

function drawRulers() {
    if (!showRuler) {
        toggleRulerButton.classList.remove('view-active')
        context.clearRect(rulerSize + 1, 0, canvas.width - rulerSize - 0.5, rulerSize + 1);
        context.clearRect(0, rulerSize + 1, rulerSize + 1, canvas.height - rulerSize - 0.5); // Xóa dải đo dọc
        return
    }
    toggleRulerButton.classList.add('view-active')
    context.beginPath();
    context.strokeStyle = rulerColor;

    // Vẽ dải đo ngang
    context.moveTo(rulerSize + 0.5, 0);
    context.lineTo(rulerSize + 0.5, canvas.height);
    context.stroke();

    // Vẽ dải đo dọc
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


const toggleRulerButton = document.getElementById('toggle-ruler');
toggleRulerButton.addEventListener('click', toggleRuler); 
//Undo - Redo
const undoButton = document.getElementById('undoBtn');
const redoButton = document.getElementById('redoBtn');
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

// Tools
let pencilBtn = document.querySelector("#pencil")
pencilBtn.classList.add("btn-focus_focus")
let btnsFocus = document.querySelectorAll('.btn-focus');

btnsFocus.forEach(function (button) {
    button.addEventListener("mousedown", function () {
        button.classList.add("btn-focus_focus")
        btnsFocus.forEach(function (otherButton) {
            if (otherButton != button) {
                otherButton.classList.remove("btn-focus_focus");
            }
        })
    });

});
document.getElementById("pencil").addEventListener("click", () => {
    isDrawing = true;
    isErasing = false;
    currentBrush = null;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('pencil.svg'), auto;} </style>");
    this.focus();
})
document.getElementById("eraser").addEventListener("click", () => {
    isDrawing = false;
    isErasing = true;
    currentBrush = null;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('square.svg'), auto;} </style>");
    this.focus();
})

// document.getElementById("color").addEventListener("click", () => {
//     color = prompt("Enter a color:");
// })

canvas.addEventListener("mousedown", (event) => {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
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
        //  else if (currentBrush === "square") {
        //     context.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
        // } else if (currentBrush === "triangle") {
        //     context.beginPath();
        //     context.moveTo(x, y - brushSize / 2);
        //     context.lineTo(x - brushSize / 2, y + brushSize / 2);
        //     context.lineTo(x + brushSize / 2, y + brushSize / 2);
        //     context.closePath();
        //     context.fill();
        // }
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
    if (isErasing) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, 15)
    }
    isMouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (!isMouseDown)
        return;
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
        //  else if (currentBrush === "square") {
        //     context.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
        // } else if (currentBrush === "triangle") {
        //     context.beginPath();
        //     context.moveTo(x, y - brushSize / 2);
        //     context.lineTo(x - brushSize / 2, y + brushSize / 2);
        //     context.lineTo(x + brushSize / 2, y + brushSize / 2);
        //     context.closePath();
        //     context.fill();
        // }
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
            console.log('oil');
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
            context.lineWidth = 2;
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
    if (isErasing) {
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
const saveButtons = document.querySelectorAll(".save");

saveButtons.forEach((item) => {
    item.addEventListener("click", () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    )
})

const saveAsPNG = document.querySelector("#saveAsPNG");
saveAsPNG.addEventListener("click", function () {

    const image = canvas.toDataURL("image/png");

    const blob = new Blob([image], { type: "image/png" });

    const fileName = prompt("Enter a file name", "myImage.png");

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
const saveAsBMP = document.querySelector("#saveAsBMP");
saveAsBMP.addEventListener("click", function () {

    const image = canvas.toDataURL("image/bmp");

    const blob = new Blob([image], { type: "image/bmp" });

    const fileName = prompt("Enter a file name", "myImage.bmp");

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
const saveAsJPEG = document.querySelector("#saveAsJPEG");
saveAsJPEG.addEventListener("click", function () {

    const image = canvas.toDataURL("image/jpeg");

    const blob = new Blob([image], { type: "image/jpeg" });

    const fileName = prompt("Enter a file name", "myImage.jpeg");

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
const saveAsGIF = document.querySelector("#saveAsGIF");
saveAsGIF.addEventListener("click", function () {

    const image = canvas.toDataURL("image/gif");

    const blob = new Blob([image], { type: "image/gif" });

    const fileName = prompt("Enter a file name", "myImage.gif");

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
const saveAsOther = document.querySelector("#saveAsOther");
saveAsOther.addEventListener("click", function () {

    const image = canvas.toDataURL("image/png");

    const blob = new Blob([image], { type: "image/png" });

    const fileName = prompt("Enter a file name", "myImage.png");

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
const newBtn = document.querySelector("#newCanvas")
newBtn.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
})
function printCanvas() {
    const dataUrl = document.getElementById("canvas-area").toDataURL();
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
const printBtn = document.querySelector("#printBtn");
printBtn.addEventListener("click", printCanvas)
//   document.getElementsByClassName("undo").addEventListener("click", function() {
//     // undo
// });

// document.getElementsByClassName("redo").addEventListener("click", function() {
//     // redo
// });
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
const canvasSizeSpan = document.getElementById('canvas-size');
const mousePositionSpan = document.getElementById('mouse-position');
const colorSpan = document.getElementById('color');
const toggleStatusBarLink = document.getElementById('toggle-status-bar');
const statusBar = document.getElementById('status-bar');

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
const fullscreenBtn = document.getElementById('fullscreenBtn');

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

const brushItems = document.querySelectorAll(".brush-item");
brushItems.forEach( (item ) => {
    item.addEventListener('click', (e) => {
        currentBrush = item.id;
    })
})

const sizeItems = document.querySelectorAll(".size-item")
sizeItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        brushSize = item.getAttribute("value");
        item.classList.add('size-focus')
        sizeItems.forEach((otherItem) =>{
            if(item != otherItem)
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
      curvePoints.push({x: x, y: y});
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

