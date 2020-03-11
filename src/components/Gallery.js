import React, { useEffect, useState } from 'react'
import GridGallery from 'react-grid-gallery'

//client side only
import Loadable from '@loadable/component'
import axios from 'axios'

const apiListToContent = apiList => {
  // https://stackoverflow.com/a/10284006/7735591
  const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]))

  //scale image so that image covers 0.1*screen.availWidth while ensuring at least 80 pix dims
  const thumbDims = imgDims => {
    const MIN_D = 80
    const availDims = [window.screen.availWidth, window.screen.availHeight]
    const dimRatios = zip([imgDims, availDims]).map(
      (imgD, screenD) => imgD / screenD
    )
    const newRatio = 0.1 / Math.max(...dimRatios)
    const retDims = imgDims.map(d => d * newRatio)
    return Math.min(...retDims) > MIN_D
      ? retDims
      : retDims.map(d => (d * MIN_D) / Math.min(...retDims))
  }
  return apiList.map(img => {
    let w, h
    if (img.img_width && img.img_height) {
      ;[w, h] = thumbDims([img.img_width, img.img_height].map(Number))
    }
    return {
      key: img.Key,
      src: img.url,
      thumbnail: img.url,
      thumbnailWidth: w || 100,
      thumbnailHeight: h || 100,
      tagString: img.tags,
      tags: img.tags
        .split(',')
        .filter(t => t !== '')
        .map(t => ({ value: t, title: t })),
      isSelected: false,
    }
  })
}

const fetchImageList = async () => {
  const { data } = await axios.get(`${process.env.API}/images/all`)
  return data
}

const getImageList = async () => {
  const imageListData = await fetchImageList()
  return apiListToContent(imageListData)
}

const Gallery = () => {
  const [filter, setFilter] = useState('')
  const [fullImageList, setFullImageList] = useState()
  const [imageList, setImageList] = useState()
  const [changeInd, setChangeInd] = useState(false)

  useEffect(() => {
    const requestAndUpdateImages = async () => {
      const freshImageList = await getImageList()
      setFullImageList(freshImageList)
      setImageList(freshImageList)
    }
    requestAndUpdateImages()
  }, [])

  useEffect(() => {
    if (fullImageList) {
      const filteredList = fullImageList.filter(
        img => img.tagString.includes(filter) || img.isSelected
      )
      setImageList(filteredList)
    }
    return () => {
      setChangeInd(false)
    }
  }, [filter, changeInd, fullImageList])

  const tagFilterChangeHandler = e => {
    setFilter(
      e.target.value.replace(/[ #*;,.<>\{\}\[\]\\\/]/gi, '').toLocaleLowerCase()
    )
  }

  //Ref: SO
  const handleDownloadSelected = e => {
    const dlKeys = imageList.filter(img => img.isSelected).map(img => img.key)
    axios
      .post(`${process.env.API}/s3/zip`, dlKeys, {
        responseType: 'arraybuffer',
      })
      .then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute(
          'download',
          `${Math.floor(Date.now() / 1000)}_tenerife20.zip`
        )
        document.body.appendChild(fileLink)
        fileLink.click()
      })
      .catch(err =>
        console.error(`could not download selected
        ${err}`)
      )
  }

  return (
    <>
      {imageList && (
        <>
          <div>
            <div className="parent grid-parent">
              <h2 className="child">Tag Filter</h2>
              <button
                onClick={() => {
                  imageList.forEach(img => {
                    img.isSelected = true
                  })
                  setChangeInd(true)
                }}
                className="child btn btn-primary gradient-green"
              >
                select all
              </button>
              <button
                onClick={() => {
                  imageList.forEach(img => {
                    img.isSelected = false
                  })
                  setChangeInd(true)
                }}
                className="child btn btn-primary gradient-green"
              >
                clear selection
              </button>
              <button
                onClick={handleDownloadSelected}
                className="child btn btn-primary gradient-green"
              >
                download selected
              </button>
            </div>
            <input
              onChange={tagFilterChangeHandler}
              value={filter}
              placeholder='Type to filter by tag e.g. "teide"'
              name="tagsField"
              type="text"
            />
          </div>
          <GridGallery
            images={imageList}
            onSelectImage={(i, img) => {
              imageList[i].isSelected = !img.isSelected
            }}
          />
        </>
      )}
    </>
  )
}

const LoadableGallery = Loadable(() => import('./Gallery'))

export default Gallery
