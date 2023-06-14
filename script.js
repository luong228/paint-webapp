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