// const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const taskPath = path.resolve(__dirname, '../talker.json');

const readTalkerFiles = async () => {
   const fileContent = await fs.readFile(taskPath, 'utf-8');
   return JSON.parse(fileContent);
};

module.exports = {
  readTalkerFiles,
};
