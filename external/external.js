import ICModsAPI from 'icmodsapi';

import { Command } from 'commander';

import fs from 'fs'

import fsExtra from "fs-extra"
import path from 'path'

import StreamZip from 'node-stream-zip';

import child_process from "child_process"

import util from 'util'

let exec_prom = util.promisify(child_process.exec)

const cli = new Command();

//{ prompt } = import('inquirer'),
//chalk = import('chalk'),

import { download } from './downl.js'

Array.prototype.remove = function(elem) {
  if(this.indexOf(elem) != -1) this.splice(this.indexOf(elem), 1);
}

cli
  .command('remote')
  .description('load remote.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .option('-d, --dir [strings...]', 'third party dir for downloaded icmods')
  .option('-n, --name [strings...]', 'third party dir for downloaded icmods')
  .action((name, cmd) => {
    (async () => {
      let strip = cmd.opts()["strip_prefix"];
      console.log('Options: ', strip);

      let dir = cmd.opts()["dir"][0];
      console.log('Options: ', dir);
      
      let url = cmd.args[0];
      
      let p_path = dir + cmd.opts()["name"][0] + "/";
  
      if(!fs.existsSync(p_path)) {
        console.log(p_path);
          fs.mkdir(p_path, function (err) {
            if(err) throw err;
          });
      }
    
      if(strip.includes("make.json")) console.warn("build.config found in --strip-prefix array. cmake config by default uses make.json!");
  
      if(!fs.existsSync(p_path + ".cache/")) {
console.log("cache", p_path);
          fs.mkdir(p_path + ".cache/", function (err) {
            if (err) throw err;
          });
      }
  
      if(!fs.existsSync(p_path + ".cache/" + cmd.opts()["name"][0])) {
            console.log(p_path + ".cache/" + cmd.opts()["name"][0]);
          
          console.log("Downloading");
          await download(url, p_path + ".cache/" + cmd.opts()["name"][0]);
      }
      
      const zippoi = new StreamZip.async({ file: p_path + ".cache/" + cmd.opts()["name"][0]});
      
      let data;
      const entries = await zippoi.entries();
      for (const entry of Object.values(entries)) {
        if(entry.name.split("/").length - 1 == 1 && entry.name.includes("make.json")) data = await zippoi.entryData(entry.name);
      }
  
      if(!data) throw "make.json not exists"
  
      const json = JSON.parse(data.toString());
      
      console.log(json);
      
      let dirtoadd = [];
  let filestoadd = [];
  
  if(strip.includes("*js")) {
    if(json.sources) {
      for(let dir of json.sources) {
        console.log(dir.source);
        if(dir.type == "main") {
          console.log(dir.source + "/");
          
          dirtoadd.push(dir.source + "/")
        } else if(dir.source[dir.source.length - 1] == "*") {
          console.log("каяок", dir.source.slice(0, dir.source.length - 2) + "/");
          dirtoadd.push(dir.source.slice(0, dir.source.length - 2) + "/")
        } else {
          console.log("source");
          filestoadd.push(dir.source)
        }
      }
    }
  }
  if(strip.includes("*native")) {
    if(json.compile) {
      for(let dir of json.compile) {
        console.log(dir.source);
        if(dir.source[dir.source.length - 1] == "*") {
          console.log(dir.source);
          dirtoadd.push(dir.source.slice(0, dir.source.length - 2) + "/")
        } else {
          console.log("source");
          filestoadd.push(dir.source)
        }
      }
    }
  }
  
  strip.remove("*js");
  strip.remove("*native");
      
  zippoi.close();

  var zip = new StreamZip({
    file: p_path + ".cache/" + cmd.opts()["name"][0], 
    storeEntries: true
  });

  zip.on('error', function (err) { console.error('[ERROR]', err); });

  zip.on('ready', function () {
    console.log('All entries read: ' + zip.entriesCount);
    //console.log(zip.entries());
  });

  zip.on('entry', function (entry) {
    let pathname = path.resolve(p_path, entry.name);
    if (/\.\./.test(path.relative(p_path, pathname))) {
      console.warn("[zip warn]: ignoring maliciously crafted paths in zip file:", entry.name);
      return;
    }
    
if ('/' === entry.name[entry.name.length - 1]) {
      //fs.mkdir(p_path + entry.name);
      return;
    }
      
    zip.stream(entry.name, function (err, stream) {
      if (err) { console.error('Error:', err.toString()); return; }
      
      stream.on('error', function (err) { console.log('[ERROR]', err); return; });

      let pre_new_path = pathname.replace(path.resolve(p_path), "");
      
      let new_path;
      
      if(pre_new_path.split("/").length - 1 > 1) {
        pre_new_path = pre_new_path.substring(pre_new_path.indexOf("/", pre_new_path.indexOf("/") + 1) + 1, pre_new_path.length);
      } else {
pre_new_path = pre_new_path.substring(pre_new_path.indexOf("/") + 1, pre_new_path.length);
      }
      
      new_path = p_path + pre_new_path;
      
      let no_exists = false;
      
      for(let path of strip) {
        //console.log('grilt', path);
        if(path[path.length - 1] == "/") {
          //console.log('grikkt', path);
          if(pre_new_path.startsWith(path)) {
            console.log('grikkt', path);
            no_exists = true;
            break;
          }
        } else {
          if(pre_new_path == path) {
            no_exists = true;
            break;
          }
        }
      }
      
      for(let path of dirtoadd) {
          if(pre_new_path.startsWith(path)) {
            console.log('gteer', path);
            no_exists = true;
            break;
          }
      }
      //console.log('gribokkt', exists);
      
      if(!no_exists && !filestoadd.includes(pre_new_path)) {
        //console.log('gribyt', filestoadd);
      
        //console.log('gribyt', pre_new_path);
        fs.mkdir(
          path.dirname(new_path),
          { recursive: true },
          function (err) {
              stream.pipe(fs.createWriteStream(new_path));
          }
        );
      }
    });
  });
    })();
  });



cli
  .command('git')
  .description('load git.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .option('-d, --dir [strings...]', 'third party dir for downloaded icmods')
  .option('-n, --name [strings...]', 'third party dir for downloaded icmods')
  .action((name, cmd) => {
    (async () => {
      let strip = cmd.opts()["strip_prefix"];
      console.log('Options: ', strip);

      let dir = cmd.opts()["dir"][0];
      console.log('Options: ', dir);
      
      let url = cmd.args[0];
      
      let p_path = dir + cmd.opts()["name"][0] + "/";
    
      if(!fs.existsSync(p_path + ".git")) {
        console.log("nong");
        
        const { stdout, stderr } = await exec_prom("git clone " + url + " " + p_path);
        
        //console.log(stdout);
        console.log(stderr);
      
        let datamake = fs.readFileSync(p_path + "make.json");
        
        //console.log(datamake);
        
        const json = JSON.parse(datamake);
      
        console.log(json);
        
        let dirtoadd = [];
        let filestoadd = [];
        
        for(let s of strip) {
          console.log(s);
          if(s == "*js") {
            if(json.sources) {
              for(let dir of json.sources) {
                console.log(dir.source);
                if(dir.type == "main") {
                  console.log(dir.source + "/");
          
                  dirtoadd.push(p_path + dir.source + "/")
                } else if(dir.source[dir.source.length - 1] == "*") {
                  console.log("каяок", dir.source.slice(0, dir.source.length - 2) + "/");
                  dirtoadd.push(p_path + dir.source.slice(0, dir.source.length - 2) + "/")
                } else {
                  console.log("source");
                  filestoadd.push(p_path + dir.source)
                }
              }
            }
          } else if(s == "*native") {
            if(json.compile) {
            for(let dir of json.compile) {
              console.log(dir.source);
              if(dir.source[dir.source.length - 1] == "*") {
                console.log(dir.source);
                dirtoadd.push(p_path + dir.source.slice(0, dir.source.length - 2) + "/")
              } else {
                console.log("source");
                filestoadd.push(p_path + dir.source)
              }
            }
            }
          } else if(fs.existsSync(p_path + s)) {
          console.log("nat", p_path + s);
            fsExtra.removeSync(p_path + s);
          }
        }
        
      for(let path of dirtoadd) {
          fsExtra.removeSync(path);
      }
      
      for(let path of filestoadd) {
          fsExtra.removeSync(path);
      }
      //console.log('gribokkt', exists);
      
      } else {
        console.log("nothing");
      }
  })();
});

cli.parse(process.argv);