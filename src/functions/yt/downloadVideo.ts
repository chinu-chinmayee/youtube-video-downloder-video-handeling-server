import ytdl from "@distube/ytdl-core";
import os from "os";
import fs from "fs";
import mergeAudioVideo from "./mergeAudioVideo.js";
import updateStatus from "../statusDb/updateStatus.js";
import uploadMergedVideos from "../../storage/uploadMergedVideo.js";

const agent = ytdl.createAgent([
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.331227,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,

    "value": "g.a000sggzMusHYML0oplqO2TovJzivGOax2JoHZvCC0X4mEWgABB9tYkjr8vqqxBJWEjQonWJCAACgYKAYQSAQASFQHGX2MigRjXWEuBD_gxrtfrzcOfTxoVAUF8yKqXL_qQ_A5yCoXdez6YFre20076"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771002977.292565,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "sidts-CjIBEJ3XVyZCL0zo6cx5agXPCWAnHCoYXETcbduIowWE3pDbon0-aku3kJ5xvj0oFYTfIBAA"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.330953,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SAPISID",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "w30EnxT87uAuRI3r/AkrmMxiPqzSTDJHdS"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771002987.793457,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "AKEyXzVZkaggpaGSNRG0xyLZgIlLZdOP8ih6z-ZU2ma8hyh-ORoPpIPxYhygF-aBVJzSV9yMSZk"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.330914,
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "AbC4r2VHddb99x84Y"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.33097,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "w30EnxT87uAuRI3r/AkrmMxiPqzSTDJHdS"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.331211,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "g.a000sggzMusHYML0oplqO2TovJzivGOax2JoHZvCC0X4mEWgABB9NRs4zVsn1TS5Y5QsX3yajAACgYKAYASAQASFQHGX2MiWwzb-WLkRa2BnbCUMRmaahoVAUF8yKoeb026Xjsqgb-mj5zg5ZPO0076"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771767247.330984,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,

    "value": "w30EnxT87uAuRI3r/AkrmMxiPqzSTDJHdS"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771002987.79357,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,

    "value": "AKEyXzWiK_x-ySXEzRgnn0gKpKBzVJul7sxUIqnE8HTd5YTPNgzfrHQ6UtY83VmCMQwP6gUUrqQ"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1771002977.292753,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,

    "value": "sidts-CjIBEJ3XVyZCL0zo6cx5agXPCWAnHCoYXETcbduIowWE3pDbon0-aku3kJ5xvj0oFYTfIBAA"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1756910310.327552,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,

    "value": "AFmmF2swRQIgT5Td6jEL_MSSjb5TLuZACIndfHxZTDIbTud7wXvg3s0CIQDqyDc6xSdl7vKbscKusjtdP2wJMHTALPvHmPFBAdIqgA:QUQ3MjNmeUg0Z0RiaEZVSk0zRHBtR0haOE9Nbnc0UU15RUt4eUc1NTJfZEozNUZZN0ZNVlVxODlaMDloaENoZVZDYW5mWkd1S3VmUDF6eUo2U01QMHFfN0d3NERLNDRpUU04NUhWMlZkZVU2Uk5qVTlaX3hrSF9DUmNkLTdlVlZQaE9ON1ptZHFXSXFQTEhEWG9Kb2VvbWlmZ3U0a2N5NTln"
  },
  {
    "domain": ".youtube.com",
    "expirationDate": 1774026975.50194,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": null,
    "secure": true,

    "value": "f6=40000000&f7=4100&tz=Asia.Calcutta&f4=4000000&f5=30000"
  }
]);

//create a unique file name for the video which is not present in the temp folder
function createUniqueFileName(extension: string) {
  const tempDir = os.tmpdir() + "/";
  const fileName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const filePath = tempDir + fileName + Date.now() + "." + extension;

  // create file if not present
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    return filePath;
  }

  createUniqueFileName(extension);
}

export default async function DownloadVideo(
  link: string,
  quality: string,
  id: string
) {
  // const tempDir = os.tmpdir() + "/";

  try {
    // return false;
    const info = await ytdl.getInfo(link,{agent});
    const formats = info.formats;


    // check if the quality is present in the formats

    if (!formats.find((format) => format.qualityLabel === quality))
      return false;

    const videoFormat = info.formats.find(
      (format) => format.qualityLabel === quality
    );

    const audioFormat = info.formats
      .filter((format) => format.hasAudio && !format.hasVideo)
      .find((format) => format.audioQuality === "AUDIO_QUALITY_MEDIUM");

    if (!audioFormat) return false;



    let videoFileExtension = formats.find(
      (format) => format.qualityLabel === quality
    )?.container;

    if (!videoFileExtension) {
      videoFileExtension = "mp4";
    }

    const videoFilePath = createUniqueFileName(videoFileExtension);

    const videoWritableStream = fs.createWriteStream(videoFilePath);

    //update status to downloading
    await updateStatus("downloading-video", id, 0);


    await new Promise<void>((resolve, reject) => {
      let percent = 0;
      // wait
      ytdl(link, {
        filter: (format) => {
          if (format.qualityLabel === quality) {
            return format.qualityLabel === quality
          }
        },
      },)
        .on("progress", async (chunkLength, downloaded, total) => {

          const currentPercent = (downloaded / total) * 100;
          if (currentPercent - percent > 5) {
            percent = currentPercent;
            await updateStatus("downloading-video", id, percent);
          }
        })
        .pipe(videoWritableStream)
        .on("close", () => {
          resolve(); // finish
        })
        .on("error", async (err) => {
          console.log(err);
          await updateStatus("failed", id, 0);

          return reject(new Error("Can't download video"));
        });
    });

    const audioFileExtension = audioFormat.mimeType
      .split(" ")[0]
      .split("/")[1]
      .split(";")[0];
    // console.log(audioFileExtension);

    const audioFilePath = createUniqueFileName(audioFileExtension);
    const audioWritableStream = fs.createWriteStream(audioFilePath);

    await updateStatus("downloading-audio", id, 0);

    await new Promise<void>((resolve, reject) => {
      // console.log("downloading audio");
      // wait
      let percent = 0;
      ytdl(link, {
        filter: (format) => format.audioCodec === audioFormat.audioCodec,
      })
        .on("progress", async (chunkLength, downloaded, total) => {
          const currentPercent = (downloaded / total) * 100;
          if (currentPercent - percent > 5) {
            percent = currentPercent;
            // console.log(percent);
            await updateStatus("downloading-audio", id, percent);
          }
        })
        .pipe(audioWritableStream)
        .on("close", () => {
          resolve(); // finish
        })
        .on("error", async (err) => {
          await updateStatus("failed", id, 0);

          return reject(new Error("Can't download audio"));
        });
    });

    //convert audio into mp3

    const outputPath = createUniqueFileName("mp4");
    await updateStatus("merging", id, 0);
    //calculate time
    const startTime = Date.now();

    const res = await mergeAudioVideo(
      audioFilePath,
      videoFilePath,
      outputPath,
      id
    );

    if (!res) {
      return false;
    }

    //calculate time
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    // console.log("time taken", timeTaken);
    //uploading
    await updateStatus("uploading", id, 0);

    const uploadedLink = await uploadMergedVideos(outputPath);
    if (!uploadedLink) {
      return false;
    }
    // // //update status to uploaded
    await updateStatus("uploaded", id, 100, uploadedLink);
    //delete merged video
    fs.unlinkSync(outputPath);

    // console.log(outputPath);

    return res;
  } catch (error) {
    await updateStatus("failed", id, 0);
    console.log("error");
    console.log(error);
  }
  return false;
}
