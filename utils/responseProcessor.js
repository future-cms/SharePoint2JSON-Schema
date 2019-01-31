const html2json = require('html2json').html2json;
const Entities = require('html-entities').XmlEntities;
var minify = require('html-minifier').minify;
const entities = new Entities();
const json2schema = (json) => {
  // console.log(util.inspect(json, {showHidden: false, depth: null}));
  let children = [];
  for (let i = 0; i < json.child.length; i++) {
    if(json.child[i].node==='text'){
      json.child[i].node ='element';
      json.child[i].tag ='span';
      json.child[i].child = [{node:'text', text:json.child[i].text}];
      delete json.child[i].text;
    }
    let component = {
      component:json.child[i].tag=='p'?'div':json.child[i].tag,
      className: 'content-'+json.child[i].tag,
    }; 
    if(undefined!==json.child[i].attr){
      for (const attribute of Object.keys(json.child[i].attr)) {
        component[attribute]=json.child[i].attr[attribute];
      }
    }
    if(undefined!==json.child[i].child){
      if(json.child[i].child.length===1 && json.child[i].child[0].node ==='text'){
        component.text = json.child[i].child[0].text;
      } else {
        component.children = json2schema(json.child[i]);
      }
    } else{
      //component.text ='';     
    }

    children.push(component);
  }
  return children;
};
const jsonImages2Array = (jsonImages) => {
  let images = [];
  let parsed = jsonImages.searchablePlainTexts;
  Object.assign(parsed,jsonImages.imageSources);
  for (const key of Object.keys(parsed)) {
    if(key.indexOf('images[')>-1){
      let prop = key.replace('images[','').replace(']','').split('.');
      if(undefined===images[prop[0]]){
        images[prop[0]]={};
      }
      images[prop[0]][prop[1]] = parsed[key]; 
    } 
  }
  return images;
};
const image2Slide = (image)=>{
  let Slide =
  `<Slide className="Slider-swiper__slide">
    <div className="Slider-div">
      <div className="imageWrapper">
        <img className="slide-img" src="${'/assets'+image.url.split('Shared%20Documents')[1]}"/>
      </div>
      <div className="textWrapper">
      
        <h2 className="slide-h2">
          <a className="slide-a" href="${image.description.split('LINK:')[1].trim()}">${image.title}</a>
        </h2>
        <h3 className="slide-h3">
          <a className="slide-a" href="${image.description.split('LINK:')[1].trim()}">${image.description.split('LINK:')[0].trim()}</a>
        </h3>
      </div>
    </div>
  </Slide>`;
  return Slide;
};
const images2Swiper = (images) => {
  let Slides = images.map( (image) =>{
    return image2Slide(image);
  } 
  ); 
  let Swiper = 
  `<Swiper className="swiper">
    ${Slides.join('')}
  </Swiper>`;
  return  minify(Swiper,{caseSensitive:true,collapseWhitespace:true});
};
exports.responseProcessor = (file)=>{
  return new Promise(function(resolve, reject) {
    var page = {};
    page.rows = [];
    page.meta = {};
    let dataJson = file.manufacturer.content;
    for (var i = 0; i < dataJson.sections.length; i++) {
      page.rows.push({
        id: i,
        columns: []
      });
      for (let j = 0; j < dataJson.sections[i].columns.length; j++) {
        page.rows[i].columns.push({
          id: j,
          content: []
        });
        for (let k = 0; k < dataJson.sections[i].columns[j].controls.length; k++) {
          let control = dataJson.sections[i].columns[j].controls[k];
          if(control.controlType==3){
            let fileSrc = [];
            let fileName = '';
            let folderName = '';
            let type = '';
            if(control.title=='File viewer'){
              fileSrc = control.serverProcessedContent.links.serverRelativeUrl.split('/');
              fileName = fileSrc.pop();
              folderName = fileSrc.pop();
              let typeArr = fileName.split('.');
              type = typeArr.pop();
              if(type === 'pdf'){
                control._text =
              '<PDF file="/assets/' + folderName.toLowerCase() + '/' +  fileName + '" ></PDF>';
              } else if(type === 'mp4'){
                control._text =
                '<video controls="controls"><source type="video/mp4" src="/assets/' + folderName.toLowerCase() + '/' +  fileName + '" ></video>';
              }
              
            } else if (control.title=='Image'){
              fileSrc = control.serverProcessedContent.imageSources.imageSource.split('/');
              fileName = fileSrc.pop();
              folderName = fileSrc.pop();
              control._text = 
              '<img src="/assets/' + folderName.toLowerCase() + '/' +  fileName + '"/>';
            } else if (control.title=='Image gallery'){
              if(control.propertieJson.layout==1){ //Carousel
                let images = jsonImages2Array(control.serverProcessedContent);
                control._text = images2Swiper(images);
              }
              if(control.propertieJson.layout==2){ //Tiles
                control._text = '<Tiles></Tiles>';
              }
              if(control.propertieJson.layout==4){ //Bricks
                control._text = '<Bricks></Bricks>';
              }
            }
          }
          page.rows[i].columns[j].content.push({
            component: 'div',
            className: 'content-div',
            children: json2schema(html2json(entities.decode(control._text)))
          });
        }

      }

    }
    page.meta.title = file.manufacturer.meta.MetaTitle;
    page.meta.description = file.manufacturer.meta.MetaDescription;
    page.meta.image = file.manufacturer.meta.MetaImage;// @TODO fix spfx extension, didnt include MetaImege
    page.meta.contentType = file.manufacturer.meta.metaContentType;
    page.meta.twitter = file.manufacturer.meta.MetaTwitter;
    page.meta.facebookAppId = file.manufacturer.meta.MetaFacebookAppID;
    page.meta.noCrawl = file.manufacturer.meta.metaNoCrawl;
    page.meta.published = file.manufacturer.meta.Created;
    page.meta.updated = file.manufacturer.meta.Modified;
    page.meta.category = file.manufacturer.meta.metaCategory;
    page.meta.tags = file.manufacturer.meta.metaTags;

    resolve(page);
  });
};