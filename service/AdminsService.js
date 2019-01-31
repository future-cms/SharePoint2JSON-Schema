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
exports.addInventory = function(inventoryItem) {
  return new Promise(function(resolve, reject) {
    console.log(global.currentPage + ' item received : ' + Date().toString());
    const fs = require('fs');
    let sitePath = apiConfig.default().sitePaths.dev;
    if(apiConfig.default().env=='prod'){
      sitePath = apiConfig.default().sitePaths[global.currentSite];
    }
    if(inventoryItem.name=='File Adapter'){
      inventoryItem.manufacturer.homePage = inventoryItem.manufacturer.homePage.replace('Shared Documents/','');
      console.log(inventoryItem.manufacturer.homePage + '/'+ inventoryItem.manufacturer.name + ' file received : ' + Date().toString());
      console.log(sitePath);
      console.log(inventoryItem.manufacturer.name);
      let assetsPath = sitePath + 'assets/';
      let paths = inventoryItem.manufacturer.homePage.split('/');
      //paths.shift();

      for (let i = 0; i < paths.length; i++) {
        assetsPath += paths[i];
        if (!fs.existsSync(assetsPath)){
          fs.mkdirSync(assetsPath);
        }
        assetsPath += '/'; 
      }

      let fileBuffer = new Buffer(inventoryItem.manufacturer.content.$content, 'base64');
      //fs.writeFile(sitePath + 'assets/page/' + inventoryItem.homePage.split('/')[2].toLowerCase() + '/' +inventoryItem.manufacturer.name, fileBuffer, { flag: 'w' }, function (err) {
      fs.writeFile(assetsPath + inventoryItem.manufacturer.name, fileBuffer, { flag: 'w' }, function (err) {

        if (err) throw err;
        console.log(inventoryItem.manufacturer.name + ' file saved to public : ' + Date().toString());
      });
    } else if(inventoryItem.name=='Widget Adapter'){
      scraper.responseProcessor(inventoryItem).then((response)=>{

        
        fs.writeFile(sitePath + 'data/page/' + global.currentPage + '.json', JSON.stringify(response), { flag: 'w' }, function (err) {
  
          if (err) throw err;
          console.log(global.currentPage + ' page saved to public : ' + Date().toString());
        });
      });
    }


    
    fs.writeFile('about.json', JSON.stringify(inventoryItem), { flag: 'w' }, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
    resolve();
  });
};

