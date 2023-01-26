import { Command } from 'commander';
const cli = new Command();

cli
  .command('length')
  .description('string length.')
  .action((name, cmd) => {
    let str = cmd.args[0];
    
    console.log(str);
  });
  
  
cli.parse(process.argv);