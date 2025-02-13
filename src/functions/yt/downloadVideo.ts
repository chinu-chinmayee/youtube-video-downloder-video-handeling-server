import ytdl from "@distube/ytdl-core";
import os from "os";
import fs from "fs";
import mergeAudioVideo from "./mergeAudioVideo.js";
import updateStatus from "../statusDb/updateStatus.js";
import uploadMergedVideos from "../../storage/uploadMergedVideo.js";

const agent = ytdl.createAgent([
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
    const info = await ytdl.getInfo(link, { agent });
    console.log("Info Collected")
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
        agent:agent
       
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
        agent
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
