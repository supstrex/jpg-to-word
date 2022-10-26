import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import useDrivePicker from "react-google-drive-picker";
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
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("original_file", file.data, file.name);
      axios.post("/api/conversion", formData, {}).then((res) => {
        setErrorMsg("");
        let fileUrl: string = res.data.url;
        onConversion(fileUrl);
      }).catch((err: AxiosError)=>{
        if(typeof err?.response?.data === 'string'){
          setErrorMsg(err.response.data)
        }
      })
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
            accept="image/*"
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
