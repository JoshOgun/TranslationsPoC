
var accessor = [];

init();

function init(){
  var english = {};
  var spanish = {};
  var esIdentical = {};


  $.ajax({
    url: '/getEnglish',
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
    },
    success: function(data, textStatus, jqXHR){
      english = data;
    }
  });

  $.ajax({
    url: '/getSpanish',
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
    },
    success: function(data, textStatus, jqXHR){
      spanish = data;
    }
  });

  addOptions(english, spanish);

}


function allKeys(eng, comparator, missingTranslations){
  for (var key in eng) {
    if(typeof eng[key] === "object"){
      accessor.push(key);
      allKeys(eng[key], comparator[key], missingTranslations);
    } else{
      accessor.push(key);
      if(getObjFromLastKey(eng, accessor) == getObjFromLastKey(comparator, accessor)){
        // Flag this word
        console.log("Flagged: " + accessor + " - " + comparator[key]);
        missingTranslations[comparator[key]] = accessor.slice();

      }
    }
    accessor.pop();
  }

  return missingTranslations;

}

// Retrieves an object while algorithm is in recursion.
function getObjFromLastKey(jsonObj, keyTrail){
  return jsonObj[keyTrail[keyTrail.length-1]];
}

// Retrieves object from JSON, given the keyTrail.
function getObject(jsonObj, keyTrail){
  var baseObject = {};
  for(var i = 0; i < jsonObj.length; i++){
    baseObject = jsonObj[keyTrail[i]];
  }
  return baseObject;
}

// function getTranslations(missingTranslations){
//   for (var key in missingTranslations) {
//
//   }
//
// }

// Function to check if the english translation is the same as the comparator language.
function isTranslated(){

}

function addOptions(base, comparator){
    var missing = {};
    missing = allKeys(base, comparator, missing);
    console.log(missing);

  for(var element in missing){
     var opt = document.createElement("option");
     var select = document.getElementById('toTranlsate');
     opt.value = element;
     opt.innerHTML = element;

     // then append it to the select element
     select.appendChild(opt);
  }
}
