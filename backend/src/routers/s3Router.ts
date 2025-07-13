import express from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing AWS environment variables");
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const s3Router = express.Router();

s3Router.get("/signed-url", async (req, res) => {
  const { contentType } = req.query;
  const userName = req.query.userName as string;

  if (!userName || !contentType) {
    return res
      .status(400)
      .send({ message: "Missing userName or contentType query parameter" });
  }

  const rawBytes = await randomBytes(16);
  const imageName = userName + "/" + rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    ContentType: req.query.contentType as string,
  };

  const command = new PutObjectCommand(params);
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${imageName}`;

  res.send({ uploadUrl, imageUrl });
});

export default s3Router;
