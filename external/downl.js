import { parse } from 'url'
import http from 'https'
import fs from 'fs'
import { basename } from 'path'

const TIMEOUT = 100000

export function download(url, path) {
  const uri = parse(url)
  
console.log(uri);

  if (!path) {
    path = basename(uri.path)
  }
  const file = fs.createWriteStream(path)

  return new Promise(function(resolve, reject) {
    const request = http.get(uri).on('response', function(res) {
      const len = parseInt(res.headers['content-length'], 10)
      
      console.log(len);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let downloaded = 0
        let percent = 0
        res
          .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / len).toFixed(2)
          process.stdout.write(`Downloading ${percent}% ${downloaded} bytes\r`)
        })
        .on('end', function() {
          file.end()
          console.log(`${uri.path} downloaded to: ${path}`)
          resolve()
        })
        .on('error', function (err) {
          reject(err)
          throw err;
        })
      } else if (res.headers.location) {
        console.log("real", res.headers.location);
        download(res.headers.location, path);
            
      } else {
            deferred.reject(new Error(res.statusCode + ' ' + res.statusMessage));
        }
      
    
    })
    request.setTimeout(TIMEOUT, function() {
      request.abort()
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}