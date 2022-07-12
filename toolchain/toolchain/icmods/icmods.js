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
  .action(async (name, cmd) => {
      console.log(cmd);

      const mod = await ICModsAPI.getModInfo(22);
      console.log(mod);
  })

  cli
  .command('mod_byName')
  .description('load mod_byName.')
  .action((name, cmd) => {
    (async () => {
      console.log("getting mod " + cmd.args[0] + " from icmods");

      //cmd.args[0] get build, strip

      const mods = await ICModsAPI.searchMods(cmd.args[0]);
      
      const modz = [];
      mods.forEach(function callback(curr) {
        if(curr.title == cmd.args) modz.push(curr);
      });

      if(modz.length == 0) throw "mod " + cmd.args[0] + " not found on icmods!";
      if(modz.length > 1) console.log("Several mods on icmods have one name. WTF?! It's not forbidden?! Use only first mod");

      console.log("found mod " + modz[0].title);

      console.log("Downloading");

      let p_path = '../../../third_party/' + modz[0].title + "/";
      console.log(p_path)

      if(!fs.existsSync(p_path) || !fs.existsSync(p_path + "BUILD")) throw "bazel package for mod " + modz[0].title + " not prepared";

      await download("https://icmods.mineprogramming.org/api/download?horizon&id=" + modz[0].id, p_path + modz[0].title + ".icmod");
    
      var zip = new StreamZip({
        file: p_path + modz[0].title + ".icmod", 
        storeEntries: true
      });

      zip.on('error', function (err) { console.error('[ERROR]', err); });

      zip.on('ready', function () {
        console.log('All entries read: ' + zip.entriesCount);
        //console.log(zip.entries());
        fs.unlink(p_path + modz[0].title + ".icmod", (err => {
          if (err) console.log(err);
        }));
      });

      zip.on('entry', function (entry) {
        var pathname = path.resolve(p_path, entry.name);
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

          // example: print contents to screen
          //stream.pipe(process.stdout);

          // example: save contents to file

          let new_path = pathname.replace(path.resolve(p_path), "");

          if(new_path.split("/").length - 1 > 1) {
            new_path = p_path + new_path.substring(new_path.indexOf("/", new_path.indexOf("/") + 1) + 1, new_path.length);
          } else {
            new_path = p_path + new_path.substring(new_path.indexOf("/") + 1, new_path.length);
          }

          console.log('[', new_path);

          fs.mkdir(
            path.dirname(new_path),
            { recursive: true },
            function (err) {
              stream.pipe(fs.createWriteStream(new_path));
            }
          );
        });
      });


    })();
  })

  cli.parse(process.argv)