const fs = require('fs').promises;

const readJsonData = async (path) => {
   const fileContent = await fs.readFile(path, 'utf-8');
   const talkers = JSON.parse(fileContent);
  //  console.log(talkers);
   return talkers;
};

function main() {
  readJsonData('./src/talker.json');
}

main();

module.exports = readJsonData;