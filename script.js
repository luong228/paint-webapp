var canvas = document.getElementById("canvas-area");
var context = canvas.getContext("2d");
var isDrawing = true;
var isErasing = false;
var isMouseDown = false;
var color = "black";

document.getElementById("pencil").addEventListener("click", () => {
    isDrawing = true;
    isErasing = false;
})

document.getElementById("eraser").addEventListener("click", () => {
    isDrawing = false;
    isErasing = true;
})

document.getElementById("color").addEventListener("click", () => {
    color = prompt("Enter a color:");
})

canvas.addEventListener("mousedown", (event) => {
    if (isDrawing) {
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
    if (isErasing) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 10, 10)
    }
    isMouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing && isMouseDown) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = color;
        context.stroke();
    }
    if (isErasing && isMouseDown ) {
        context.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 10, 10)
    }
});

canvas.addEventListener("mouseup", (event) => {
    // isDrawing = false;
    // isErasing = false;
    isMouseDown = false;
});

// Menu 
document.getElementById("save").addEventListener("click", () => {
    var link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

document.getElementById("undo").addEventListener("click", function() {
    // undo
});

document.getElementById("redo").addEventListener("click", function() {
    // redo
});
