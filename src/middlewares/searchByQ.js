// const { readTalkerFiles } = require('../utils/readAndWriteFiles');

const searchByQ = (array, q) => {
  if (q) {
   array.filter(({ name }) => name.includes(q));
  }
};
module.exports = searchByQ;
