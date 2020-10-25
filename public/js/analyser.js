var accessor = [];
var english = {};
var spanish = {};
var german = {};
var french = {};
var currMissing = {};
var identicals = {};

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
        case "Identicals":
          identicals = data;
          document.getElementById('identicalCheck-01').setAttribute("style", "stroke: green;");
          document.getElementById('identicalCheck-02').setAttribute("style", "stroke: green;");
          break;
        case "English":
          english = data;
          document.getElementById('englishCheck-01').setAttribute("style", "stroke: green;");
          document.getElementById('englishCheck-02').setAttribute("style", "stroke: green;");
          break;
        case "Spanish":
          spanish = data;
          document.getElementById('spanishCheck-01').setAttribute("style", "stroke: green;");
          document.getElementById('spanishCheck-02').setAttribute("style", "stroke: green;");
          break;
        case "German":
          german = data;
          document.getElementById('germanCheck-01').setAttribute("style", "stroke: green;");
          document.getElementById('germanCheck-02').setAttribute("style", "stroke: green;");
          break;
        case "French":
          french = data;
          document.getElementById('frenchCheck-01').setAttribute("style", "stroke: green;");
          document.getElementById('frenchCheck-02').setAttribute("style", "stroke: green;");
          break;
        default:
          console.log("Something went wrong");
      }
      // console.log("English: " + JSON.stringify(english));
      // console.log("Spanish: " + JSON.stringify(spanish));
      // console.log("French: " + JSON.stringify(french));
      // console.log("German: " + JSON.stringify(german));
      showToast("File Uploaded Successfully.");
    }
  });
  document.getElementById("languageSelected").selectedIndex = document.getElementById("languageSelected").selectedIndex+1;
}


function allKeys(eng, comparator, missingTranslations, lang){
  for (var key in eng) {
    if(typeof eng[key] === "object"){
      accessor.push(key);
      allKeys(eng[key], comparator[key], missingTranslations, lang);
    } else{
      accessor.push(key);
      if(getObjFromLastKey(eng, accessor) == getObjFromLastKey(comparator, accessor)){
        // Flag this word
        console.log("Flagged: " + accessor + " - " + comparator[key]);
        if(!identicals.hasOwnProperty(lang) || !identicals[lang].includes(comparator[key])){
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

function addOptions(base, comparator, selectComponent, lang){
  // Check if the the file has been uploaded.
  if(Object.keys(base).length === 0 && base.constructor === Object || Object.keys(comparator).length === 0 && comparator.constructor === Object){
    showToast("Please check you have loaded the appropriate files.");
    return;
  }
  var missing = {};
  missing = allKeys(base, comparator, missing, lang);
  console.log(missing);

  removeOptions(selectComponent);

  for(var element in missing){
     var opt = document.createElement("option");
     opt.value = element;
     opt.innerHTML = element;

     // then append it to the select element
     selectComponent.appendChild(opt);
  }

  currMissing = missing;
}

function submitTranslation(lang, selectComponent, textComponent){

  var inputTranslation = textComponent.value;

  var updatedTranlsations = inputObject(lang, currMissing[selectComponent.value], inputTranslation);
  console.log(updatedTranlsations);

  selectComponent.remove(selectComponent.selectedIndex);
  textComponent.value = '';

}

function updateIdenticals(lang, selectComponent){

  switch(lang) {
    case "Spanish":
      appendToIgnores("Es", selectComponent.value);
      break;
    case "German":
      appendToIgnores("De", selectComponent.value);
      break;
    case "French":
      appendToIgnores("Fr", selectComponent.value);
      break;
    default:
      console.log("Something went wrong.");
  }
  console.log(identicals);
  selectComponent.options[selectComponent.selectedIndex].remove();
}

function appendToIgnores(key, element){
  if(identicals.hasOwnProperty(key)){
    identicals[key].push(element);
  }
  else{
    identicals[key] = [element];
  }
  return identicals;
}

function updateJSON(){
  var fileName = document.getElementById('exportFile').value;
  var toSend = null;
  var languageExporting = document.getElementById('languageExporting').value;
  if(languageExporting == "Spanish"){
    toSend = JSON.parse(JSON.stringify(spanish));
  }
  else if(languageExporting == "German"){
    toSend = JSON.parse(JSON.stringify(german));
  }
  else if(languageExporting == "French"){
    toSend = JSON.parse(JSON.stringify(french));
  }
  else if(languageExporting == "Identicals"){
    toSend = JSON.parse(JSON.stringify(identicals));
  }

  toSend["fileName"] = fileName;

  $.ajax({
    url: '/saveJSON',
    data: toSend,
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
    },
    success: function(data, textStatus, jqXHR){
      console.log("Done");
      showToast("File Exported Successfully.");
    }
  });
}
