document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    const sizeInput = document.getElementById("size");
    const colorPicker = document.getElementById("color");
    const sizePreview = document.getElementById("sizePreview");
    const prePickedColors = document.querySelectorAll(".pre-picked-color");
    const clearCanvasButton = document.getElementById("clearCanvas");
    const saveDrawingButton = document.getElementById("saveDrawing");
    const undoButton = document.getElementById("undo");
    const backgroundColorInput = document.getElementById("backgroundColor");
    let painting = false;
    let drawingHistory = [];

    // Set default background color
    setBackgroundColor(backgroundColorInput.value);

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        if (painting) {
            // Save the current state before releasing the mouse
            saveDrawingState();
        }
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;

        const penSize = sizeInput.value;
        const selectedColor = colorPicker.value;

        ctx.lineWidth = penSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = selectedColor;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        sizePreview.style.width = `${penSize}px`;
        sizePreview.style.height = `${penSize}px`;
        sizePreview.style.backgroundColor = selectedColor;
    }

    sizeInput.addEventListener("input", function () {
        const penSize = sizeInput.value;
        sizePreview.style.width = `${penSize}px`;
        sizePreview.style.height = `${penSize}px`;
    });

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);

    canvas.addEventListener("mousemove", draw);

    prePickedColors.forEach((prePickedColor) => {
        prePickedColor.addEventListener("click", function () {
            const color = this.style.backgroundColor;
            colorPicker.value = rgbToHex(color);
            sizePreview.style.backgroundColor = colorPicker.value;
        });
    });

    clearCanvasButton.addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Save the current state after clearing the canvas
        saveDrawingState();
        setBackgroundColor(backgroundColorInput.value);
    });

    saveDrawingButton.addEventListener("click", function () {
        const dataUrl = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "drawing.png";
        link.click();
    });

    undoButton.addEventListener("click", function () {
        // Restore the previous drawing state
        restoreDrawingState();
    });

    backgroundColorInput.addEventListener("input", function () {
        setBackgroundColor(backgroundColorInput.value);
    });

    function setBackgroundColor(color) {
        canvas.style.backgroundColor = color;
    }

    function rgbToHex(rgb) {
        const values = rgb.match(/\d+/g);
        const hex = values.map(value => Number(value).toString(16).padStart(2, '0')).join('');
        return `#${hex}`;
    }

    function saveDrawingState() {
        // Save the current canvas state
        drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function restoreDrawingState() {
        if (drawingHistory.length > 0) {
            // Restore the previous canvas state
            ctx.putImageData(drawingHistory.pop(), 0, 0);
        }
    }
});
