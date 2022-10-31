// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: euro-sign;
const minReq = new Request("https://api.preciodelaluz.org/v1/prices/min?zone=PCB");
const allReq = new Request("https://api.preciodelaluz.org/v1/prices/all?zone=PCB");
const maxReq = new Request("https://api.preciodelaluz.org/v1/prices/max?zone=PCB");
minReq.method = "get";
allReq.method = "get";
maxReq.method = "get";

let minResponse = await minReq.loadJSON();
let allResponse = await allReq.loadJSON();
let maxResponse = await maxReq.loadJSON();

let maxPrice = (maxResponse.price / 1000).toFixed(4);
let minPrice = (minResponse.price / 1000).toFixed(4);

const subAvgColor = new Color("#4287f5");
const cheapColor = new Color("#42f578");
const pricyColor = new Color("#d92929");

const w = new ListWidget();
w.backgroundColor=new Color("#222222");
w.spacing = 2;

addBars();

let minText = w.addText(`Precio mínimo: ${minResponse.hour} (${minPrice}eur/kWh)`);
minText.font = Font.blackSystemFont(10);

Script.setWidget(w);
Script.complete();
w.presentLarge();

function drawBar(price) {
 
	const context = new DrawContext();
	const width = 210;
	const height = 3;
	let fill;
	const priceValue = price.price / 1000;
	context.size=new Size(width, height);
	context.opaque=false;
	context.respectScreenScale=true;
	context.setFillColor(new Color("#48484b"));

	const resizeFactor = priceValue / maxPrice;	

	const path = new Path();
	path.addRoundedRect(new Rect(0, 0, width, height), 3, 2);
	context.addPath(path);
	context.fillPath();

	if (price["is-cheap"]) {
      
      fill = cheapColor;
      
	} else if (price["is-under-avg"]) {
  	  
  	  fill = subAvgColor;
  	  
	} else {

	  fill = pricyColor;

	}

	context.setFillColor(fill);
	const path1 = new Path();
	path1.addRoundedRect(new Rect(0, 0, width * resizeFactor, height), 3, 2);
    context.addPath(path1);
    context.fillPath();

	return context.getImage();
   
}

function addBars() {
 
	let stack;
	let time;
    let currentTimeFormat = "00";
    let nextTimeFormat;
    let currentTimeObject;
    let priceText;
    
    for (let i = 0; i < 24; i++) {
      
      nextTimeFormat = (i + 1).toLocaleString("en-US", {minimumIntegerDigits: 2});
      currentTimeObject = allResponse[`${currentTimeFormat}-${nextTimeFormat}`];
      stack = w.addStack();
      time = stack.addText(currentTimeFormat);      
      stack.centerAlignContent();
      stack.spacing = 2;
      time.centerAlignText();
      time.font = Font.blackMonospacedSystemFont(10);
	  stack.addImage(drawBar(currentTimeObject));

      priceText = stack.addText((currentTimeObject.price / 1000).toFixed(3));
	  priceText.font = Font.blackMonospacedSystemFont(10);

	  currentTimeFormat = nextTimeFormat;

    }
    
   
}