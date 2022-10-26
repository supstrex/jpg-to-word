import React from "react";
import QRCode from "react-qr-code";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import { NextPage } from "next";
import { DownloadStatus } from "../interfaces/intefaces";
import Image from 'next/image';

let Download: NextPage <{download: DownloadStatus}>= ({download})=> {
  const fileUrl = download.fileUrl;
  /*Copy file URL to the clipboard*/
  function copyText() {
    navigator.clipboard.writeText(fileUrl);
  }

  return (
    <div className="row-download">
      <div className="link-handling">
        <div className="converted-file">
          <p className="text-of-download">Scan QR code</p>
          <div style={{ background: "white", padding: "10px", width: "100px", height: "100px", margin: "auto" }}>
            <QRCode value={fileUrl} size={100} />
          </div>
        </div>
        <div className="converted-file">
          <p className="text-of-download">Use sharable link</p>
          <button className="copy-button" onClick={copyText}>
            <div className="copy-img">
              <Image
                priority
                src="/media/link.png"
                alt="Icon for copying"
                height={100}
                width={100}
              />
            </div>
          </button>
        </div>
        <div className="converted-file">
          <p className="text-of-download">Or simply download</p>
          <a href={fileUrl}>
            <div className="download-img">
              <Image
                priority
                src="/media/downloading.png"
                alt="Icon for downloading"
                height={100}
                width={100}
              />
            </div>
          </a>
        </div>
      </div>
      <div className="social-medias">
        <div className="social">
          <EmailShareButton url={fileUrl}>
            <EmailIcon size={60} borderRadius={10} />
          </EmailShareButton>
        </div>
        <div className="social">
          <FacebookShareButton url={fileUrl}>
            <FacebookIcon size={60} borderRadius={10} />
          </FacebookShareButton>
        </div>
        <div className="social">
          <TwitterShareButton url={fileUrl}>
            <TwitterIcon size={60} borderRadius={10} />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
}

export default Download;