import ICModsAPI from 'icmodsapi';

import { Command } from 'commander';

import fs from 'fs'

import path from 'path'

import StreamZip from 'node-stream-zip';

const cli = new Command();

//{ prompt } = import('inquirer'),
//chalk = import('chalk'),

import { download } from './downl.js'

Array.prototype.remove = function(elem) {
  if(this.indexOf(elem) != -1) this.splice(this.indexOf(elem), 1);
}

cli
  .command('mod_byID')
  .description('load mod_byID.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .option('-d, --dir [strings...]', 'third party dir for downloaded icmods')
  .action((name, cmd) => {
    (async () => {
      console.log("getting mod " + cmd.args[0] + " from icmods");

      const mod = await ICModsAPI.getModInfo(22);
      console.log(mod);

      let strip = cmd.opts()["strip_prefix"];
      console.log('Options: ', strip);

      let dir = cmd.opts()["dir"][0];
      console.log('Options: ', dir);

      await load_fle(dir, mod, strip);
    })();
  })

  cli
  .command('mod_byName')
  .description('load mod_byName.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .option('-d, --dir [strings...]', 'third party dir for downloaded icmods')
  .action((name, cmd) => {
    (async () => {
      console.log("getting mod " + cmd.args[0] + " from icmods");

      let strip = cmd.opts()["strip_prefix"];
      console.log('Options: ', strip);

      let dir = cmd.opts()["dir"][0];
      console.log('Options: ', dir);

      const mods = await ICModsAPI.searchMods(cmd.args[0]);
      
      const modz = [];
      mods.forEach(function callback(curr) {
        if(curr.title == cmd.args) modz.push(curr);
      });

      if(modz.length == 0) throw "mod " + cmd.args[0] + " not found on icmods!";
      if(modz.length > 1) console.log("Several mods on icmods have one name. WTF?! It's not forbidden?! Use only first mod");

      await load_fle(dir, modz[0], strip);
    })();
  })

async function load_fle(tpdir, mod, strip) {
  let p_path = tpdir + mod.title + "/";
  
  if(!fs.existsSync(p_path)) {
    fs.mkdir(p_path, function (err) {
      if(err) throw err;
    });
  }
    
  if(!strip.includes("build.config")) console.warn("build.config not found in --strip-prefix array. BUILD config by default uses build.config!");
  
  if(!fs.existsSync(p_path + ".cache/")) {
    fs.mkdir(p_path + ".cache/", function (err) {
      if (err) throw err;
    });
  }
  
  if(!fs.existsSync(p_path + ".cache/" + mod.title + ".icmod")) {
    console.log("found mod " + mod.title);

    console.log(p_path);
  
    console.log("Downloading");
    await download("https://icmods.mineprogramming.org/api/download?horizon&id=" + mod.id, p_path + ".cache/" + mod.title + ".icmod");
  }
  const zippoi = new StreamZip.async({ file: p_path + ".cache/" + mod.title + ".icmod" });

  let data;
  const entries = await zippoi.entries();
  for (const entry of Object.values(entries)) {
    if(entry.name.split("/").length - 1 == 1 && entry.name.includes("build.config")) data = await zippoi.entryData(entry.name);
  }
  
  if(!data) throw "build.config not exists"
  
  const json = JSON.parse(data.toString());
  
  //console.log(json);
  
  let dirtoadd = [];
  let filestoadd = [];
  
  if(strip.includes("*js")) {
    if(json.buildDirs) {
      for(let dir of json.buildDirs) {
        //dirtoadd.add(dir.dir)
        console.log(dir.dir);
      }
    } else if(json.compile) {
      for(let file of json.compile) {
        if(file.sourceType == "mod") {
          filestoadd.push(file.path);
          console.log(file.path);
        }
      }
    } else {
      throw "js files probably is compiled to dexes";
    }
  }
  //if(strip.includes("*native")) {
    //if(json.nativeDirs) {}
  //}
  //To Do libs
  
  //strip.remove("*library");
  strip.remove("*js");
  strip.remove("*native");
  
  zippoi.close();

  var zip = new StreamZip({
    file: p_path + ".cache/" + mod.title + ".icmod", 
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
      
      let exists = false;
      
      for(let path of strip) {
        if(path[path.length - 1] == "/") {
          console.log('grikkt', path);
          if(pre_new_path.startsWith(path)) {
            console.log('grikkt', path);
            exists = true;
            break;
          }
        } else {
          if(pre_new_path == path) {
            exists = true;
            break;
          }
        }
      }
      
      console.log('gribokkt', exists);
      
      if(!exists && !filestoadd.includes(pre_new_path)) {
        console.log('gribyt', filestoadd);
      
        console.log('gribyt', pre_new_path);
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
}

  cli.parse(process.argv);