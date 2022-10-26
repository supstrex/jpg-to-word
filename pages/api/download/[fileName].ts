import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import fs from "fs";
import path from "path";

export const config = {
  api:{
    bodyParser: false,
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})

handler.get(async (req, res) => {
  const docxName = req.query.fileName;
  const fileName = path.resolve("./public/docxs/" + docxName);
  const file  = fs.readFileSync(fileName)
  
  res.setHeader('Content-Disposition', 'attachment');
  res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
   
  res.end(file);
})

export default handler;
