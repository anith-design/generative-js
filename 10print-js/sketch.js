const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const colors = require('riso-colors');
const colorPkg = require('color');

const settings = {
  dimensions: [2048, 2048],
  //dimensions: 'a4',
  pixelsPerInch: 300,
  animate: true,
  playing: true,
  fps: 24,
  duration: 10
};

const sketch = () => {
  const goldenRatio = 1.618;
  const baseStep = 20;
  const step = baseStep * goldenRatio;
  const numStrokesPerLine = 10;

  filteredColors = colors.filter(color => {
    const hsl = colorPkg(color.hex).hsl().object();
    return hsl.l > 20;
  });

  return ({ context, width, height, time }) => {
    let waveTime = time / Math.PI * 180.0;
    console.log("time: ", waveTime);

    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {

        let r = random.value();
        const color = filteredColors[Math.floor(Math.random() * filteredColors.length)];
        console.log(color);
        
        for (let i = 0; i < numStrokesPerLine; i++) {

          const noiseFrequency = random.range(0.02, 0.5);
          const noiseAmplitude = random.range(0, 50);

          const pressureVariation = random.noise2D(x, y, noiseFrequency, 1);

          context.lineWidth = random.range(1.0, 10.0) * (1 + pressureVariation);
          context.globalAlpha = random.range(0.3, 0.7) * (1 + pressureVariation * 0.5);

          let lengthMultiplier = random.range(0.1, 1.0);

          let startWobbleX = random.range(-15, 15) * (1 - i * 0.2);
          let startWobbleY = random.range(-15, 15) * (1 - i * 0.2);
          let endWobbleX = random.range(-15, 15) * (1 - i  * 0.2) * lengthMultiplier;
          let endWobbleY = random.range(-15, 15) * (1 - i * 0.2) * lengthMultiplier;

          const noise = random.noise2D(x + random.range(-1, 1), y + random.range(-1, 1), noiseFrequency, noiseAmplitude);
          let rotationAngle = Math.sin(x * 0.2 + y * 0.2 + time) * Math.PI * goldenRatio * 0.1;
          console.log(time);

          context.save();
          context.translate(x + step / 2, y + step / 2);
          context.rotate(rotationAngle);

          context.strokeStyle = color.hex;
          //context.strokeStyle = `rgba(${random.range(50, 255)}, ${random.range(50, 255)}, ${random.range(50, 255)}, ${random.range(0.3, 0.7)})`;
          context.beginPath();

          if (r < 1.0) {
            context.moveTo(startWobbleX + noise - step / 2, startWobbleY + noise - step / 2);
            context.lineTo(endWobbleX + noise + step / 2, endWobbleY + noise + step / 2);
          } else {
            context.moveTo(startWobbleX + noise - step / 2, startWobbleY + noise + step / 2);
            context.lineTo(endWobbleX + noise + step / 2, endWobbleY + noise - step / 2);
          }

          context.stroke();
          context.restore();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
