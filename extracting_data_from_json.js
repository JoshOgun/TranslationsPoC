// Investigating JSONs

// var english = require('./en.json');
// var spanish = require('./es.json');

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


// allKeys(english, spanish);
// console.log(missingTranslations);
