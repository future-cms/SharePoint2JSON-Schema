'use strict';

var utils = require('../utils/writer.js');
var Admins = require('../service/AdminsService');
var Uploads = require('../service/UploadService');

module.exports.addInventory = function addInventory (req, res, next) {
  var inventoryItem = req.swagger.params['inventoryItem'].value;
  Admins.addInventory(inventoryItem)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.uploadFile = function addInventory (req, res, next) {
  var uploadedFile = req.swagger.params['uploadedFile'].value;
  Uploads.uploadFile( uploadedFile)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
