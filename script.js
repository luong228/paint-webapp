const canvas = document.getElementById("canvas-area");
const context = canvas.getContext("2d");
let isDrawing = true;
let isErasing = false;
let isMouseDown = false;
let color = "black";


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

    // Thêm các con số đại diện cho các giá trị đo
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
    showRuler = !showRuler; // Đảo ngược giá trị của biến showRuler
    drawRulers(); // Vẽ lại dải đo trên canvas
}


const toggleRulerButton = document.getElementById('toggle-ruler');
toggleRulerButton.addEventListener('click', toggleRuler); // Thêm sự kiện click để toggle dải đo
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
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('pencil.svg'), auto;} </style>");
    this.focus();
})
document.getElementById("eraser").addEventListener("click", () => {
    isDrawing = false;
    isErasing = true;
    document.body.insertAdjacentHTML('beforeend',
        "<style>body{cursor: url('square.svg'), auto;} </style>");
    this.focus();
})

// document.getElementById("color").addEventListener("click", () => {
//     color = prompt("Enter a color:");
// })

canvas.addEventListener("mousedown", (event) => {
    if (isDrawing) {
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
    if (isErasing) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, 15)
    }
    isMouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing && isMouseDown) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = color;
        context.stroke();
    }
    if (isErasing && isMouseDown) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, 15)
    }
});

canvas.addEventListener("mouseup", (event) => {
    // isDrawing = false;
    // isErasing = false;
    isMouseDown = false;
});

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