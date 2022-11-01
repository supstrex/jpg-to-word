import React, { useState } from "react";
import axios from "axios";
import { UploadingFile } from "../interfaces/intefaces";
import { NextPage } from "next";
import Image from 'next/image';

let Upload: NextPage <{onConversion: Function}>= ({onConversion})=> {

  /*Used hooks*/
  const [file, setFile] = useState<UploadingFile>({data:""});
  const [errorMsg, setErrorMsg] = useState("");

  /*For selection from local file system*/
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFile({ data: e.target.files[0] });    
    setErrorMsg("")
  }

  /*On submition convert file into FormData*/
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file.data) {
      const formData = new FormData();
      formData.append("original_file", file.data, file.name);

      try {
        const { data } = await axios.post("/api/conversion", formData, {})
        setErrorMsg("");
        let fileUrl: string = data.url;
        onConversion(fileUrl);
      } catch (error: any) {
        if (typeof error?.response?.data === 'string') {
          setErrorMsg(error.response.data)
        }
      }
      
      // console.log('fetchic araj');
      // fetch("/api/conversion", {
      //   method: "POST",
      //   body: formData
      // }).then((resp) => {
      //   console.log('theni mej');
      //   resp.json()
      // })
      // .then((data) => {
      //   setErrorMsg("");
      //   let fileUrl: string = data.url;
      //   onConversion(fileUrl);})
      // .catch((error: any)=>{
      //   console.log('error@ qcuma?');
      //   console.log("error", error);
      //   if(typeof error?.response?.data === 'string'){
      //     setErrorMsg(error.response.data)
      //   }
      // });
    } 
  }

  return (
    <div className="row-upload">
      <div className="file-pickers">
        <div className="file-selection">
          <label htmlFor="file-input">
            <div className="file-selection-image">
              <Image
                priority
                src="/media/fileSelectionIcon.png"
                alt="Icon for file selection"
                height={100}
                width={100}
              />
            </div>     
          </label>
          <input
            type="file"
            className="file-selection-input"
            name="file-input"
            id="file-input"
            accept=".png, .jpg, .jpeg"
            onChange={onFileChange}
          />
        </div>
        <div>
          <button className="picker-button">
            <div className="picker-button-image">
              <Image
                priority
                src="/media/googleDriveIcon.png"
                alt="Google Drive Icon"
                height={100}
                width={100}
              />
            </div>
          </button>
        </div>
        <div>
          <button className="picker-button">
            <div className="picker-button-image">
              <Image
                priority
                src="/media/dropboxIcon.ico"
                alt="DropBox Icon"
                height={100}
                width={100}
              />
            </div>
          </button>
        </div>
      </div>
      {file.data !== "" ? (
        <div className="convert">
          <form onSubmit={onSubmit}>
              <button className="convert-button" type="submit">
                Convert
              </button>
          </form>
        </div>
      ) : (
        <></>
      )}
      <div>
        <p className="error-msg">{errorMsg}</p>
      </div>
    </div>
    );
}

export default Upload;
