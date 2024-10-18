import express = require("express");
import { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';

export const conf = express.Router();
conf.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

conf.use(express.json());
conf.use(bodyParser.json());

