const canvas = document.getElementById('viewport'),
      context = canvas.getContext('2d');

base_image = new Image();
base_image.src = 'https://picsum.photos/900/500';
base_image.crossOrigin = "Anonymous";
base_image.onload = function () {

    context.drawImage(base_image, 0, 0);
    
    const delta = parseInt(localStorage.getItem('delta')) || 5;

    let pixelX = 0,
        pixelY = 0,
        blocks = []; // Blocks of average color
    for (let i = 0; i < (canvas.width / delta) * (canvas.height / delta); i++) {
        let rSum = 0,
            gSum = 0,
            bSum = 0;
        for (let j = 0; j < delta; j++) {
            // Bump x
            pixelX++;
            for (let k = 0; k < delta; k++) {
                // Bump y
                pixelY++;
                let p = context.getImageData(pixelX, pixelY, 1, 1).data;
                rSum += p[0];
                gSum += p[1];
                bSum += p[2];
            }
            pixelY -= delta;
        }

        // Average the sums to get an average color
        rAvg = rSum / Math.pow(delta, 2);
        gAvg = gSum / Math.pow(delta, 2);
        bAvg = bSum / Math.pow(delta, 2);
        rSum = 0;
        gSum = 0;
        bSum = 0;
        blocks.push({
            r: rAvg,
            g: gAvg,
            b: bAvg
        });

        // Render the block to the canvas
        context.fillStyle = `rgb(${rAvg}, ${gAvg}, ${bAvg})`;
        context.fillRect(pixelX - delta, pixelY, delta, delta);

        // Break line if the width of image is reached
        if (pixelX > canvas.width) {
            pixelX = 0;
            pixelY += delta;
        }
    }
}

const deltaInput = document.getElementById('delta');
deltaInput.focus();
deltaInput.value = localStorage.getItem('delta') || 5;
deltaInput.addEventListener('keyup', function (e) {
    if(this.value > 0) {
        localStorage.setItem('delta', this.value);
    }
    // Reload to compress a new random image
    if(e.key === 'Enter') {
        window.location.reload();
    }
});