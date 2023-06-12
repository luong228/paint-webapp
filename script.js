var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var isDrawing = false;

canvas.addEventListener("mousedown", function(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", function(event) {
    if (isDrawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
    }
});

canvas.addEventListener("mouseup", function(event) {
    isDrawing = false;
});

function save() {
    var link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}