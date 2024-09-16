document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const predictButton = document.getElementById('predictButton');
    const clearButton = document.getElementById('clearButton');
    const predictionResult = document.getElementById('predictionResult');
    let drawing = false;

    // Установка начального цвета фона и рамки
    ctx.fillStyle = 'black';  // Цвет фона черный
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishPosition);
    canvas.addEventListener('mousemove', draw);

    clearButton.addEventListener('click', clearCanvas);
    predictButton.addEventListener('click', predict);

    function startPosition(event) {
        drawing = true;
        draw(event);
    }

    function finishPosition() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(event) {
        if (!drawing) return;

        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'white';  // Цвет карандаша белый

        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

        // Закрашиваем пиксель в белый цвет
        ctx.fillStyle = 'white';
        ctx.fillRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 1, 1);
    }

    function clearCanvas() {
        // Очистка канваса и установка цвета фона
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        predictionResult.textContent = '';
    }

    async function predict() {
        // Получаем изображение в формате PNG
        const imageDataURL = canvas.toDataURL('image/png');

        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageDataURL })
        });

        const result = await response.json();
        predictionResult.textContent = `Prediction: ${result.prediction}`;
    }
});
