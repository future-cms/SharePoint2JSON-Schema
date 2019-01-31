var convert = require('xml-js');
exports.responseScraper = (file)=>{
  return new Promise(function(resolve, reject) {

    var page = {};
    page.rows=[];
    file.manufacturer.content = file.manufacturer.content.replace(/\r\n/g,'');
    file.manufacturer.content = file.manufacturer.content.replace(/>\n</g,'><');
    file.manufacturer.content = file.manufacturer.content.replace(/mso:/g,'');
    let xml = file.manufacturer.content.split('<xml>')[1].split('</xml>')[0];
  
    xml = '<xml>' + xml + '</xml>';
     
    var resultJson = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 0}));
    let html = resultJson.xml.CustomDocumentProperties.CanvasContent1._text;
      
    let dataJson = JSON.parse(convert.xml2json(html, {compact: true, spaces: 0}));
    for(var item of dataJson.div.div){
      let content = '';
      let controlData = JSON.parse(item._attributes['data-sp-controldata']);
      //console.log(JSON.stringify(controlData));
      if(controlData.controlType==4){ //Plain text type
        content = item.div.p._text;
      } else if(controlData.controlType==3){ // Image type
        let imageData = JSON.parse(item.div._attributes['data-sp-webpartdata']);
        content = imageData.serverProcessedContent.imageSources.imageSource;
      }
      let rowId = controlData.position.zoneIndex;
      let columnId = controlData.position.sectionIndex;
      var getRow = page.rows.find(o => o.id === rowId);
      if(undefined===getRow){
        page.rows.push({id:rowId,columns:[]});
        getRow = page.rows.find(o => o.id === rowId);
      }
      var getColumn = getRow.columns.find(o => o.id === columnId);
      if(undefined===getColumn){
        getRow.columns.push({id:columnId,content:content});
      }
    }
    resolve(page);
  });
};