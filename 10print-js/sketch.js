const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('./risoColor.json');
const gui = require('lil-gui');

const settings = {
  dimensions: [2048, 2048],
  //dimensions: 'a4',
  pixelsPerInch: 300,
  animate: false,
  duration: 12
};

const params = {
  primaryColor: risoColors[4].hex,
  secondaryColor: risoColors[5].hex,
  accentColor: risoColors[59].hex,

  primaryColorName: risoColors[4].name,
  secondaryColorName: risoColors[5].name,
  accentColorName: risoColors[59].name,

  waveType: 'sine', 

  randomness: 0.5
};

getColorByName = (name) => {
  const color = risoColors.find(color => color.name === name);
  if (color) {
    return color.hex;
  } else {
    return '#000000';
  }
}

const guiControl = new gui.GUI();

guiControl.add(params, 'primaryColorName', risoColors.map(color => color.name))
  .name('Primary Color')
  .onChange((name) => {
    params.primaryColor = getColorByName(name);
    if (manager) {
      manager.render();
    }
  });

  guiControl.add(params, 'secondaryColorName', risoColors.map(color => color.name))
  .name('Secondary Color')
  .onChange((name) => {
    params.secondaryColor = getColorByName(name);
    if (manager) {
      manager.render();
    }
  });

  guiControl.add(params, 'accentColorName', risoColors.map(color => color.name))
  .name('Tertiary Color')
  .onChange((name) => {
    params.accentColor = getColorByName(name);
    if (manager) {
      manager.render();
    }
  });

  guiControl.add(params, 'waveType', ['sine', 'sqrt', 'exp', '3d noise']).name('Wave Type').onChange(() => {
    if (manager) {
      manager.render();
    }
  });


  guiControl.add(params, 'randomness', 0, 1).name('Distance').onChange(() => {
    if (manager) {
      manager.render();
    }
  });

const sketch = () => {
  const goldenRatio = 1.618;
  const baseStep = 20;
  const step = baseStep * goldenRatio;
  let numStrokesPerLine = 10;

  // filteredColors = colors.filter(color => {
  //   const hsl = colorPkg(color.hex).hsl().object();
  //   return hsl.l > 20;
  // });

  return ({ context, width, height, time }) => {
    const primaryColor = params.primaryColor;
    const secondaryColor = params.secondaryColor;
    const accentColor = params.accentColor;

    const filteredColors = [primaryColor, secondaryColor, accentColor];

    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {

        let r = random.value() * params.randomness;
        const color = filteredColors[Math.floor(Math.random() * filteredColors.length)];

        for (let i = 0; i < numStrokesPerLine; i++) {
          const noiseFrequency = random.range(0.02, 0.5);
          const noiseAmplitude = random.range(0, 50);

          const pressureVariation = random.noise2D(x, y, noiseFrequency, 1);

          context.lineWidth = random.range(1.0, 10.0) * (1 + pressureVariation);
          context.globalAlpha = random.range(0.3, 0.7) * (1 + pressureVariation * 0.5);

          let lengthMultiplier = random.range(0.1, 1.0);

          let startWobbleX = random.range(-15, 15) * (1 - i * 0.2);
          let startWobbleY = random.range(-15, 15) * (1 - i * 0.2);
          let endWobbleX = random.range(-15, 15) * (1 - i * 0.2) * lengthMultiplier;
          let endWobbleY = random.range(-15, 15) * (1 - i * 0.2) * lengthMultiplier;

          const noise = random.noise2D(x + random.range(-1, 1), y + random.range(-1, 1), noiseFrequency, noiseAmplitude);
          let rotationAngle;

          if (params.waveType === 'sine') {
            rotationAngle = Math.sin(x * 0.2 + y * 0.2 + time) * Math.PI * goldenRatio * 0.1;
          } else if (params.waveType === 'sqrt') {
            rotationAngle = Math.sqrt(x * 0.2 + y * 0.2 + time) * Math.PI * goldenRatio * 0.1;
          } else if (params.waveType === 'exp') {
            rotationAngle = Math.pow(x * 0.2 + y * 0.2 + time, 2) % Math.PI * goldenRatio * 0.1;
          } else {
            rotationAngle = random.noise3D(x * 0.2, y * 0.2, Math.PI * goldenRatio * 0.1);
          }

          context.save();
          context.translate(x + step / 2, y + step / 2);
          context.rotate(rotationAngle);

          context.strokeStyle = color;
          context.beginPath();

          if (r < 0.1) {
            context.moveTo(startWobbleX + noise - step / 2, startWobbleY + noise - step / 2);
            context.lineTo(endWobbleX + noise + step / 2, endWobbleY + noise + step / 2);
          } else {
            // context.moveTo(startWobbleX + noise - step / 2, startWobbleY + noise + step / 2);
            // context.lineTo(endWobbleX + noise + step / 2, endWobbleY + noise - step / 2);
          }

          context.stroke();
          context.restore();
        }
      }
    }
  };
};

canvasSketch(sketch, settings).then(sketchManager => {
  manager = sketchManager;
});
