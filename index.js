import express from "express";
import accountsRouter from "./routes/accounts.js";
import winston from "winston";
import { promises as fs, write } from "fs";

const { readFile, writeFile } = fs;
const { combine, timestamp, label, printf } = winston.format;

const app = express();
global.fileName = "accounts.json";

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}]: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: "my-bank-api.log" })
  ],
  format: combine(
    label({ label: "my-bank-api" }),
    timestamp(),
    myFormat
  )
});

app.use(express.json());
app.use("/account", accountsRouter);
app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    logger.info("API Started & Running!");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: []
    }
    writeFile(global.fileName, JSON.stringfy(initialJson)).then(() => {
      logger.info("API Started & File Created!");
    }).catch(err => {
      logger.error(err);
    });
  };

});

