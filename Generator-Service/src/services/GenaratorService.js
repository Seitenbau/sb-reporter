const htmlToPdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const { Duplex } = require('stream');

module.exports = class GeneratorService {
  constructor() {

  }

  create(html, filename) {
    return new Promise((resolve, reject) => {
      htmlToPdf.create(html, {
        format: 'A1'
      }).toStream((err, stream) => {
        if (err) return reject(err);
        const file = path.resolve(__dirname, `../../temp/${filename}.pdf`)
        stream.pipe(fs.createWriteStream(file))
        .on('finish', () => {
          resolve(fs.createReadStream(file)); // or pipe it elsewhere!
        })
      });
    });
  }
}
