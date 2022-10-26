import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Layout from '../components/layout'
import { DownloadStatus } from '../interfaces/intefaces'
import Download from './download'
import Upload from './upload'

const Home: NextPage = () => {
  /*Keep state of downloaded file info*/
  const [download, setDownload] = useState<DownloadStatus>({
    isReady: false,
    fileUrl: "",
  });
  
  /*Keep state of downloaded file*/
  function onConversion(fileUrl: string) {
    setDownload({ isReady: true, fileUrl });
  }
  /*Clear state of downloaded file*/
  function clearDownload() {
    setDownload({ isReady: false, fileUrl: "" });
  }

  return (
    <div >
      <Head>
        <title>JPG to Word</title>
      </Head>
      <Layout download={download} clearDownload={clearDownload} >
        <>
          {download.isReady ? (
            <Download download={download} />
          ) : (
            <Upload onConversion={onConversion}/>
          )}
        </>
      </Layout>
    </div>
  )
}

export default Home
