'use strict';
const apiConfig = require('../setups/config');
const scraper = require('../utils/responseProcessor');

/**
 * adds an inventory item
 * Adds an item to the system
 *
 * inventoryItem InventoryItem Inventory item to add (optional)
 * no response value expected for this operation
 **/
exports.uploadFile = function(uploadedFile) {
  return new Promise(function(resolve, reject) {
    console.log(global.currentPage + ' file received : ' + Date().toString());
    const fs = require('fs');
    console.log(uploadedFile);

    let sitePath = apiConfig.default().sitePaths.dev;
    if(apiConfig.default().env=='prod'){
      sitePath = apiConfig.default().sitePaths[global.currentSite];
    }
    
    fs.writeFile(sitePath + uploadedFile.originalname, uploadedFile.buffer, { flag: 'w' }, function (err) {

      if (err) throw err;
      console.log(global.currentPage + ' file saved to public : ' + Date().toString());
    });


    /*
    fs.writeFile('about.json', JSON.stringify(inventoryItem), { flag: 'w' }, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    */
    resolve();
  });
};

exports.uploadFileBase64 = function(uploadedFile) {
  return new Promise(function(resolve, reject) {
    console.log(global.currentPage + ' file received : ' + Date().toString());
    const fs = require('fs');
    console.log(uploadedFile);

    let sitePath = apiConfig.default().sitePaths.dev;
    if(apiConfig.default().env=='prod'){
      sitePath = apiConfig.default().sitePaths[global.currentSite];
    }
    
    fs.writeFile(sitePath + uploadedFile.originalname, uploadedFile.buffer, { flag: 'w' }, function (err) {

      if (err) throw err;
      console.log(global.currentPage + ' file saved to public : ' + Date().toString());
    });


    /*
    fs.writeFile('about.json', JSON.stringify(inventoryItem), { flag: 'w' }, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    */
    resolve();
  });
};

