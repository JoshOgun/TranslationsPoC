// Investigating JSONs
init();
 
var english = {};
var spanish = {};
var esIdentical = {};

function init() {

 loadJSON('en.json', function(response) {
  // Parse JSON string into object
    var english = JSON.parse(response);
 });

 loadJSON('es.json', function(response) {
  // Parse JSON string into object
    var spanish = JSON.parse(response);
 });

 loadJSON('esIdentical.json', function(response) {
  // Parse JSON string into object
    var esIdentical = JSON.parse(response);
 });
}

function loadJSON(fileName, callback) {

   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', fileName, true);
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

// $.getJSON("en.json", function(engJson) {
//     english = engJson;
// });
//
// $.getJSON("es.json", function(espJson) {
//     spanish = espJson;
// });

var accessor = [];
var missingTranslations = {};

function allKeys(eng, comparator){
  for (var key in eng) {
    if(typeof eng[key] === "object"){
      accessor.push(key);
      allKeys(eng[key], comparator[key]);
    }else{
      accessor.push(key);
      if(getObjFromLastKey(eng, accessor) == getObjFromLastKey(comparator, accessor)){
        // Flag this word
        console.log("Flagged: " + accessor + " - " + comparator[key]);
        missingTranslations[comparator[key]] = accessor.slice();

      }
    }
    accessor.pop();
  }

}

function getObjFromLastKey(jsonObj, keyTrail){
  return jsonObj[keyTrail[keyTrail.length-1]];
}

function getObject(jsonObj, keyTrail){
  var baseObject = {};
  for(var i = 0; i < jsonObj.length; i++){
    baseObject = jsonObj[keyTrail[i]];
  }
  return baseObject;
}

function getTranslations(missingTranslations){
  for (var key in missingTranslations) {

  }

}

function isTranslated(){

}


// allKeys(english, spanish);
// console.log(missingTranslations);
