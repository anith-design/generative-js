const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300
};

const sketch = () => {
  const step = 80;
  const numStrokesPerLine = 3;

  return ({ context, width, height }) => {
    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        let r = random.value();

        for (let i = 0; i < numStrokesPerLine; i++) {
          context.lineWidth = random.range(4, 10);
          const noiseFrequency = random.range(0.05, 0.2);
          const noiseAmplitude = random.range(30, 50);

          let startWobbleX = random.range(-10, 10) * i;
          let startWobbleY = random.range(-10, 10) * i;
          let endWobbleX = random.range(-10, 10) * i;
          let endWobbleY = random.range(-10, 10) * i;

          const noise = random.noise2D(x + random.range(-10, 10), y + random.range(-10, 10), noiseFrequency, noiseAmplitude);

          context.strokeStyle = `rgba(${random.range(50, 255)}, ${random.range(50, 255)}, ${random.range(50, 255)}, ${random.range(0.3, 0.7)})`;
          context.beginPath();

          if (r < 0.5) {
            context.moveTo(x + startWobbleX + noise, y + startWobbleY + noise);
            context.lineTo(x + step + endWobbleX + noise, y + step + endWobbleY + noise);
          } else {
            context.moveTo(x + startWobbleX + noise, y + step + startWobbleY + noise);
            context.lineTo(x + step + endWobbleX + noise, y + endWobbleY + noise);
          }
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
