//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Cognitive Services (formerly Project Oxford): https://www.microsoft.com/cognitive-services
//
// Microsoft Cognitive Services (formerly Project Oxford) GitHub:
// https://github.com/Microsoft/Cognitive-Speech-TTS
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

const request = require("request");
const fs = require("fs");

var subscriptionKey = "c6f6ab2a17ec4b69a947e8d1365d2cf3" // replace this with your subscription key
var region = "eastus" // replace this with the region corresponding to your subscription key, e.g. westus, eastasia

// build pronunciation assessment parameters
var referenceText = "Today was a beautiful day. We had a great time taking a long walk outside in the morning. The countryside was in full bloom, yet the air was crisp and cold. Towards the end of the day, clouds came in, forecasting much needed rain.";
var pronAssessmentParamsJson = `{"ReferenceText":"${referenceText}","GradingSystem":"HundredMark","Dimension":"Comprehensive"}`;
var pronAssessmentParams = Buffer.from(pronAssessmentParamsJson, 'utf-8').toString('base64');

// build request
var options = {
    method: 'POST',
    baseUrl: `https://${region}.stt.speech.microsoft.com/`,
    url: 'speech/recognition/conversation/cognitiveservices/v1?language=en-us',
    headers: {
        'Accept': 'application/json;text/xml',
        'Connection': 'Keep-Alive',
        'Content-Type': 'audio/wav', // Change the Content-Type to audio/wav
        'Transfer-Encoding': 'chunked',
        'Expect': '100-continue',

        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Pronunciation-Assessment': pronAssessmentParams
    }
}

var uploadFinishTime;

var req = request.post(options);
req.on("response", (resp) => {
    resp.on("data", (chunk) => {
        var result = chunk.toString('utf-8');
        console.log("Pronunciation assessment result:\n");
        console.log(result); // the result is a JSON string, you can parse it with JSON.parse() when consuming it
        var getResponseTime = Date.now();
        console.log(`\nLatency = ${getResponseTime - uploadFinishTime}ms`);
    });
});

// Read the WAV file and send it as the audio stream
var audioStream = fs.createReadStream("reading.wav", { highWaterMark: 1024 });
audioStream.on("data", (data) => {
    sleep(data.length / 32); // to simulate human speaking rate
});
audioStream.on("end", () => {
    uploadFinishTime = Date.now();
});

audioStream.pipe(req);

function sleep(milliseconds) {
    var startTime = Date.now();
    var endTime = Date.now();
    while (endTime < startTime + milliseconds) {
        endTime = Date.now();
    }
}