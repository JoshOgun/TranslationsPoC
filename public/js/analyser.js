var accessor = [];
var english = {};
var spanish = {};
var german = {};
var currMissing = {};
var identicals = {};


loadIdenticals();

function retrieveFile(){
  var language = document.getElementById('languageSelected').value;
  var params = document.getElementById('fileName').value;

  $.ajax({
    url: '/getJSON',
    data: params,
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      alert("File not found - please try again.");
    },
    success: function(data, textStatus, jqXHR){
      document.getElementById('fileName').value = "";
      switch(language) {
        case "English":
          english = data;
          break;
        case "Spanish":
          spanish = data;
          break;
        case "French":
          french = data;
          break;
        case "German":
          german = data;
          break;
        default:
          console.log("Something went wrong");
      }
      // console.log("English: " + JSON.stringify(english));
      // console.log("Spanish: " + JSON.stringify(spanish));
      // console.log("French: " + JSON.stringify(french));
      // console.log("German: " + JSON.stringify(german));
    }
  });
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
        // console.log("Flagged: " + accessor + " - " + comparator[key]);
        if(!identicals["Es"].includes(comparator[key])){
          missingTranslations[comparator[key]] = accessor.slice();
        }
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
  var baseObject = jsonObj;
  for(var i = 0; i < keyTrail.length; i++){
    baseObject = baseObject[keyTrail[i]];
  }
  return baseObject;
}

function inputObject(jsonObj, keyTrail, input){
  var baseObject = jsonObj;
  if(keyTrail.length != 0){
    var key = keyTrail[0];
    keyTrail.shift();
    baseObject[key] = inputObject(baseObject[key], keyTrail, input);
  }
  else{
    return input;
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
  console.log(english);
  console.log(spanish);
  return;
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

  currMissing = missing;
}

function submitTranslation(){
  var select = document.getElementById('toTranlsate');

  var inputTranslation = document.getElementById('translatedText').value;

  var newSpanish = inputObject(spanish, currMissing[select.value], inputTranslation);
  console.log(newSpanish);

  select.remove(select.selectedIndex);
  document.getElementById('translatedText').value = '';

}

function updateJSON(){
  $.ajax({
    url: '/updateSpanish',
    data: spanish,
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
    },
    success: function(data, textStatus, jqXHR){
      console.log("Done");
    }
  });
}

function loadIdenticals(){
  $.ajax({
    url: '/loadIdenticals',
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
    },
    success: function(data, textStatus, jqXHR){
      data = identicals;
    }
  });
}
