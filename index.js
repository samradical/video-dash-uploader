const Q = require('bluebird')
const fs = require('fs')
const path = require('path')
const Dash = require('dash-mp4box-sidx')
const Downloader = require('youtube-manifest-downloader')
const GOOGLE = require('google-cloudstorage-commands')


const uploadFile = (p, BUCKET) => {
  return GOOGLE.upload(p, BUCKET, true)
    .then(() => {})
    .catch(err => {
      console.log(err);
    })
}

module.exports = (IDS, BUCKET, options = {}) => {
  const save = options.save || __dirname
  try {
    fs.mkdirSync(save)
  } catch (e) {

  }
  return Downloader(IDS, BUCKET, { save: save })
    .then(r => {
      return Dash(r, { save: save })
        .then(sidxs => {
          return Q.map(sidxs, d => {
            const { name } = path.parse(d.path)
            fs.writeFileSync(`${name}.json`, d)
            return uploadFile(d.path, BUCKET)
              .then(() => uploadFile(`${name}.json`, BUCKET))
          },{concurrency:1})
        })
    })

}
