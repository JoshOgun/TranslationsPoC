var accessor = [];
var english = {};
var spanish = {};
var german = {};
var french = {};
var currMissing = {};
var identicals = {};

function retrieveFile(){
  var language = document.getElementById('languageSelected').value;
  var fileObj = document.getElementById('fileInstance').files[0];

  if (fileObj) {
    var reader = new FileReader();
    reader.readAsText(fileObj, "UTF-8");
    reader.onload = function (data) {
      var langJSON = JSON.parse(data.target.result);
      switch(language) {
        case "Identicals":
        identicals = langJSON;
        document.getElementById('identicalCheck-01').setAttribute("style", "stroke: green;");
        document.getElementById('identicalCheck-02').setAttribute("style", "stroke: green;");
        break;
        case "English":
        english = langJSON;
        document.getElementById('englishCheck-01').setAttribute("style", "stroke: green;");
        document.getElementById('englishCheck-02').setAttribute("style", "stroke: green;");
        // console.log(english);
        break;
        case "Spanish":
        spanish = langJSON;
        document.getElementById('spanishCheck-01').setAttribute("style", "stroke: green;");
        document.getElementById('spanishCheck-02').setAttribute("style", "stroke: green;");
        break;
        case "German":
        german = langJSON;
        document.getElementById('germanCheck-01').setAttribute("style", "stroke: green;");
        document.getElementById('germanCheck-02').setAttribute("style", "stroke: green;");
        break;
        case "French":
        french = langJSON;
        document.getElementById('frenchCheck-01').setAttribute("style", "stroke: green;");
        document.getElementById('frenchCheck-02').setAttribute("style", "stroke: green;");
        break;
        default:
        console.log("Something went wrong");
      }
      showToast("File Uploaded Successfully.");
      document.getElementById("languageSelected").selectedIndex = document.getElementById("languageSelected").selectedIndex+1;
    }
    reader.onerror = function (data) {
      alert("Error Reading File.");
    }
  }
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
        if(!identicals["All"].includes(comparator[key]) && ( !identicals.hasOwnProperty(lang) || !identicals[lang].includes(comparator[key]) )){
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
  try{
    return jsonObj[keyTrail[keyTrail.length-1]];
  }
  catch{
    // reference not found in the counterpart
    return null;
  }
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
    // Value ensures exact duplicates are removed.
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
    case "All":
    appendToIgnores("All", selectComponent.value);
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

function saveJSON(){
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
