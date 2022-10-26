import type { NextApiRequest, NextApiResponse } from 'next'
import multer from "multer";
import { v4 as uuid } from 'uuid';
import nc from "next-connect";
import { Document, ImageRun, Packer, Paragraph } from "docx";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";

export const config = {
  api:{
    bodyParser: false,
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    if(err.message === "Only .jpg/.jpeg format is allowed!"){ 
      res.status(415).end(err.message);
    } else if(err.message === 'File too large'){
      res.status(413).end(err.message)
    } else if(err.message === "No file found, please attach a file"){
      res.status(400).end(err.message)
    } else {
      console.log(err);
      res.status(500).end("Something broke!");  
    }
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})

/*multer setup*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuid() + '-' + fileName)
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .jpg/.jpeg format is allowed!"));
    }
  },
});

let uploadFile = upload.single("original_file")

handler.use(uploadFile)

interface ExtendedRequest {
  file: Express.Multer.File | undefined;
}

handler.post<ExtendedRequest>(async (req, res) => {
  /*Throw an Error if there is no file attached*/
  if (typeof req.file == "undefined") {
    throw new Error("No file found, please attach a file")
  }

  /*Call docxConversion function responsible for file conversion*/
  const { docxName, convertedFileUrl } = await docxConversion(
    req.file.filename,
  );
  
  /*If successful return file metadata*/
  res.status(200).json({
    status: "Success",
    message: "File is successfully converted",
    name: docxName,
    url: convertedFileUrl,
  }); 
})

async function docxConversion(imageName: string) {
  /*Generate requested image path*/
  const imagePath = path.resolve("./public/images/" + imageName);
  
  /*Get image dimensions*/
  const dimensions = sizeOf(imagePath);

  /*Using docx package to  build new docx file*/
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(imagePath),
                transformation: {
                  width: dimensions.width || 400,
                  height: dimensions.height || 300,
                },
              }),
            ],
          }),
        ],
      },
    ],
  });
  
  /*Convert file to base64String*/
  const base64 = await Packer.toBase64String(doc);
  
  /*Generate docx file path and save file*/
  const docxName =
  imageName.slice(0, imageName.lastIndexOf(".")) + ".docx";

  fs.writeFileSync(
    path.resolve("./public/docxs/" + docxName),
    base64,
    "base64"
  );
  
  /*Generate converted file url for http get request*/
  const convertedFileUrl = "http://localhost:3000/api/download/" + docxName;
  
  return { docxName, convertedFileUrl };
}

export default handler;
