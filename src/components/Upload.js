import React, { useState } from 'react'

//client side only
import Loadable from '@loadable/component'
import 'react-dropzone-uploader/dist/styles.css'
import axios from 'axios'
import Dropzone from 'react-dropzone-uploader'

const Upload = () => {
  const [tags, setTags] = useState('')

  const ImageAudioVideo = () => {
    const getUploadParams = async ({ file, meta }) => {
      const aux = {
        'x-amz-meta-img_width': meta.width.toString(),
        'x-amz-meta-img_height': meta.height.toString(),
        'x-amz-meta-tag_string': tags,
      }
      const apiUrl = `${process.env.API}/s3/file/${meta.name}`
      const { data } = await axios.post(apiUrl, { aux })
      const { url, fields } = data
      const fileUrl = `${url}/${fields.key}`
      return { fields, meta: { fileUrl }, url }
    }

    const handleChangeStatus = ({ meta }, status) => {
      console.log(status, meta)
    }

    const handleSubmit = (files, allFiles) => {
      console.log(files.map(f => f.meta))
      allFiles.forEach(f => f.remove())
    }

    return (
      <>
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          accept="image/*,audio/*,video/*"
          inputContent={(files, extra) =>
            extra.reject
              ? 'Image, audio and video files only'
              : 'Click or Drop (multiple)'
          }
          styles={{
            dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
            inputLabel: (files, extra) =>
              extra.reject ? { color: 'red' } : {},
          }}
        />
      </>
    )
  }

  const tagChangeHandler = e => {
    setTags(
      e.target.value.replace(/[ #*;.<>\{\}\[\]\\\/]/gi, '').toLocaleLowerCase()
    )
  }

  return (
    <>
      <h2>
        Tags for pictures comma-separated e.g.{' '}
        {'<photographer>,<place> (oscar,teide)'}
      </h2>
      <input
        onChange={tagChangeHandler}
        value={tags}
        placeholder="optional"
        name="tagsField"
        type="text"
      />
      <ImageAudioVideo />
    </>
  )
}

const LoadableUpload = Loadable(() => import('./Upload'))

export default Upload
