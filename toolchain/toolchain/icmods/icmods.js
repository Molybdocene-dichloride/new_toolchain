import ICModsAPI from 'icmodsapi';

import { Command } from 'commander';

import fs from 'fs'

import path from 'path'

import StreamZip from 'node-stream-zip';

const cli = new Command();

//{ prompt } = import('inquirer'),
//chalk = import('chalk'),

import { download } from './downl.js'

cli
  .command('mod_byID')
  .description('load mod_byID.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .action((name, cmd) => {
    (async () => {
      console.log("getting mod " + cmd.args[0] + " from icmods");

      const mod = await ICModsAPI.getModInfo(22);
      console.log(mod);

      let strip = cmd.opts["strip_prefix"];

      await load_fle(mod, strip);
    })();
  })

  cli
  .command('mod_byName')
  .description('load mod_byName.')
  .option('-s, --strip_prefix [strings...]', 'dirs and files for excuded')
  .action((name, cmd) => {
    (async () => {
      console.log("getting mod " + cmd.args[0] + " from icmods");

      let strip = cmd.opts["strip_prefix"];

      //console.log('Options: ', cmd.opts());

      const mods = await ICModsAPI.searchMods(cmd.args[0]);
      
      const modz = [];
      mods.forEach(function callback(curr) {
        if(curr.title == cmd.args) modz.push(curr);
      });

      if(modz.length == 0) throw "mod " + cmd.args[0] + " not found on icmods!";
      if(modz.length > 1) console.log("Several mods on icmods have one name. WTF?! It's not forbidden?! Use only first mod");

      await load_fle(modz[0], strip);
    })();
  })

async function load_fle(mod, strip) {
  console.log("found mod " + mod.title);

  console.log("Downloading");

  let p_path = '../../../third_party/' + mod.title + "/";
  console.log(p_path)

  if(!fs.existsSync(p_path) || !fs.existsSync(p_path + "BUILD")) {
    fs.mkdir(p_path, function (err) {
      if (err) throw err;
    });
    fs.writeFile(p_path + "BUILD", "", function (err) {
      if (err) throw err;
    });
  }
  
  if(!fs.existsSync(p_path + mod.title + ".icmod")) await download("https://icmods.mineprogramming.org/api/download?horizon&id=" + mod.id, p_path + mod.title + ".icmod");

  const zippoi = new StreamZip.async({ file: p_path + mod.title + ".icmod" });

  let data;
  const entries = await zippoi.entries();
  for (const entry of Object.values(entries)) {
    if(entry.name.split("/").length - 1 == 1 && entry.name.includes("build.config")) data = await zippoi.entryData(entry.name);
  }
  
  if(!data) throw "build.config not exists"
  
  const json = JSON.parse(data.toString());
  
  console.log(json);
  
  let dirtoadd = [];
  let filestoadd = [];
  
  //if(strip_prefix *js)
  if(json.buildDirs) {
    for(dir of json.buildDirs) {
      //dirtoadd.add(dir.dir)
    }
  } else if(json.compile) {
    for(file of json.buildDirs) {
      //if(file.sourceType == "mod") filestoadd.add(file.path);
    }
  } else {
    throw js files probably is compiled to dexes;
  }
  
  //if(strip_prefix *native)
  //if(json.nativeDirs) {}
  
  //To Do libs
  
  zippoi.close();

  var zip = new StreamZip({
    file: p_path + mod.title + ".icmod", 
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

      let new_path = pathname.replace(path.resolve(p_path), "");

      if(new_path.split("/").length - 1 > 1) {
        new_path = p_path + new_path.substring(new_path.indexOf("/", new_path.indexOf("/") + 1) + 1, new_path.length);
      } else {
        new_path = p_path + new_path.substring(new_path.indexOf("/") + 1, new_path.length);
      }

      //
      
      //console.log('gribz[', new_path);

      fs.mkdir(
        path.dirname(new_path),
        { recursive: true },
        function (err) {
            stream.pipe(fs.createWriteStream(new_path));
        }
      );
    });
  });
}

  cli.parse(process.argv);