const fs = require('fs');
const { Readable } = require('stream');
const record = require('node-record-lpcm16');
const wav = require('wav');

function recordAudio(durationInSeconds, outputPath) {
  // Create a new Readable stream to store the audio data
  const audioStream = new Readable();

  // Create the Writable stream to save the WAV file
  const fileStream = fs.createWriteStream(outputPath);

  // Set up the WAV writer
  const wavWriter = new wav.FileWriter(outputPath, {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
  });

  // Pipe the audio data to the WAV writer and then to the file stream
  audioStream.pipe(wavWriter).pipe(fileStream);

  // Start recording
  const recording = record.record({
    sampleRate: 16000,
    verbose: false,
  });

  // Stop recording after the specified duration
  setTimeout(() => {
    recording.stop();
    console.log('Recording stopped.');
  }, durationInSeconds * 1000);

  // Capture audio data and push it to the audio stream
  recording.stream().on('data', (data) => {
    audioStream.push(data);
  });

  // When recording is finished, close the WAV writer and file stream
  recording.stream().on('end', () => {
    audioStream.push(null);
    wavWriter.end();
    fileStream.end();
    console.log('Recording saved to', outputPath);
  });
}

// Usage example: Record 5 seconds of audio and save it to 'output.wav'
recordAudio(5, 'output.wav');
