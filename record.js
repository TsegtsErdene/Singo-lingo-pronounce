const sound = require("node-sound");

const record = async () => {
  const recorder = await sound.createRecorder();
  const filename = `output.wav`;

  recorder.on('data', (data) => {
    fs.writeFileSync(filename, data);
  });

  recorder.start();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      recorder.stop();
      resolve();
    }, 5000);
  });
};

record();