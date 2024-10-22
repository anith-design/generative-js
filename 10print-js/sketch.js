const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
  animate: false
};

const sketch = () => {
  const step = 80;

  return ({ context, width, height, time }) => {
    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        let r = random.value();
        context.lineWidth = Math.random(1, 10);
        context.strokeStyle = 'blue';
        context.beginPath();

        if (r < 0.5) {
          context.moveTo(x, y);
          context.lineTo(x + step, y + step);
        } else {
          context.moveTo(x, y + step);
          context.lineTo(x + step, y);
        }
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
