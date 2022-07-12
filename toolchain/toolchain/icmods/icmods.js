import ICModsAPI from 'icmodsapi';

const commander = require('commander'),
  { prompt } = require('inquirer'),
chalk = require('chalk'),
fs = require('fs')

commander
  .command('mod_byID')
  .description('load mod_byID.')
  .action(async (name, cmd) => {
      console.log(cmd);

      const mod = await ICModsAPI.getModInfo(22);
      console.log(mod);
  })

commander
  .command('mod_byName')
  .description('load mod_byName.')
  .action(async (name, cmd) => {
      console.log(cmd);

      const mods = await ICModsAPI.searchMods("industrial");
      console.log(mods);
  })

commander.parse(process.argv)