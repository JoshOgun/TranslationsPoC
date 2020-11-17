var accessor = []; // NEEDS RESETTING AFTER EVERY LOAD
var english = {};
var spanish = {};
var german = {};
var french = {};
var currMissing = {};
var identicals = {};
var autoChanges = 0;

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
          showToast("Something went wrong.", "G");
          break;
      }
      showToast("File Uploaded Successfully.", "G");
      document.getElementById("fileInstance").value = "";
      document.getElementById("languageSelected").selectedIndex = document.getElementById("languageSelected").selectedIndex+1;
    }
    reader.onerror = function (data) {
      showToast("Error Reading File.", "G");
    }
  }
}


function allKeys(eng, comparator, missingTranslations, lang){
  var languageMode;
  switch (lang) {
    case "Es":
      languageMode = spanish;
      break;
    case "De":
      languageMode = german;
      break;
    case "Fr":
      languageMode = french;

      break;
    default:
      showToast("Something went wrong.", "R");
      break;
  }

  for (var key in eng) {
    accessor.push(key);
    if(typeof eng[key] === "object"){
      if(!comparator.hasOwnProperty(key)) {comparator[key] = eng[key]};
      allKeys(eng[key], comparator[key], missingTranslations, lang);

    } else{
      var engVal = getObjFromLastKey(eng, accessor);
      var langVal = getObjFromLastKey(comparator, accessor);
      if(langVal == null){
        // Synchronise JSONs
        inputObject(languageMode, accessor.slice(), engVal);
      }
      if(engVal == langVal || langVal == null){
        // Flag this word
        console.log("Flagged: " + accessor + " - " + engVal);

        if(!identicals["All"].includes(engVal) && ( !identicals.hasOwnProperty(lang) || !identicals[lang].includes(engVal) )){
          // Check if translation exsists before asking for a transaltion.
          var translatedVal = checkTranslationExists(engVal, english, languageMode);

          if(translatedVal != ""){
            inputObject(languageMode, accessor.slice(), translatedVal);
            autoChanges++;
          }else{
            missingTranslations.hasOwnProperty(engVal) ? missingTranslations[engVal].push(accessor.slice()) : missingTranslations[engVal] = [accessor.slice()] ;
          }
        }
      }
    }
    accessor.pop();
  }
  showToast(autoChanges + " Phrase(s) translated. " + Object.keys(missingTranslations).length + " Translation(s) left.", "G");
  // autoChanges = 0;
  console.log(missingTranslations);
  return missingTranslations;

}

function checkTranslationExists(keyInstance, base, compare){
  var retrievedVal = "";
  for (var key in base) {
    if(typeof base[key] === "object"){
      try{
        retrievedVal = checkTranslationExists(keyInstance, base[key], compare[key]);
        if(retrievedVal != ""){
          return retrievedVal;
        }
      }catch(e){ }
    }
    else if(base[key] == keyInstance && keyInstance != compare[key]){
      return compare[key];
    }
  }
  return retrievedVal;
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
    if(key in baseObject){
      baseObject[key] = inputObject(baseObject[key], keyTrail, input);
    }
    else{
      baseObject[key] = {};
      baseObject[key] = inputObject(baseObject[key], keyTrail, input);
    }

  }
  else{
    return input;
  }
  return baseObject;
}

function addOptions(base, comparator, selectComponent, lang){

  if(!checkFilesNeeded(base, comparator, identicals)){
    return;
  }

  var missing = {};
  missing = allKeys(base, comparator, missing, lang);

  removeOptions(selectComponent);

  for(var element in missing){
    var opt = document.createElement("option");
    // Value ensures exact duplicates are removed.
    opt.value = element;

    // 42 characters
    if(element.length <= 42){
      opt.innerHTML = element;
    }
    else{
      opt.innerHTML = element.substring(0, 42) + " ...";
    }
    // then append it to the select element
    selectComponent.appendChild(opt);
  }

  currMissing = missing;
}

function submitTranslation(lang, selectComponent, textComponent){

  var inputTranslation = textComponent.value;
  var missingKey = selectComponent.value;
  var updatedTranlsations;
  for(var i = 0; i < currMissing[missingKey].length; i++){
    updatedTranlsations = inputObject(lang, currMissing[missingKey][i], inputTranslation); // An array of keytrails
  }

  selectComponent.remove(selectComponent.selectedIndex);
  textComponent.value = '';

  checkCompleted(selectComponent);

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
      showToast("Something went wrong", "R");
      break;
  }
  selectComponent.options[selectComponent.selectedIndex].remove();
  checkCompleted(selectComponent);
}

function checkCompleted(selectComponent){
  if(selectComponent.length == 0){
    showToast("All translations done.", "G");
    changeActive('exportItem');
  }
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

function checkSelected(selectElement, tArea){

  if(selectElement.value.length > 42){
    document.getElementById(tArea).style.display = "block";
    document.getElementById(tArea).value = selectElement.value;
  }
  else {
    document.getElementById(tArea).style.display = "none";
  }
}

function checkFilesNeeded(base, comparator, ignores){
  // Check if the the file has been uploaded.

  if(Object.keys(base).length === 0 && base.constructor === Object || comparator.constructor != Object || Object.keys(ignores).length === 0 && ignores.constructor === Object){
    showToast("Please check you have loaded the appropriate files.", "R");
    return false;
  }
  else{
    return true;
  }
}

function exportMissing(transNeeded){
  var toSend = {};

  if(Object.keys(currMissing).length === 0){
    showToast("There is nothing to export.", "R");
    return;
  }

  Object.assign(toSend, currMissing);
  if(transNeeded == "Spanish"){
    toSend["fileName"] = "spanish_missing_translations.json";
  }
  else if(transNeeded == "German"){
    toSend["fileName"] = "german_missing_translations.json";
  }
  else if(transNeeded == "French"){
    toSend["fileName"] = "french_missing_translations.json";
  }

  $.ajax({
    url: '/saveJSON',
    data: JSON.stringify(toSend),
    contentType: 'application/json; charset=utf-8',
    type: 'POST',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      showToast("Error saving file.", "R");
    },
    success: function(data, textStatus, jqXHR){
      showToast("File Exported Successfully.", "G");
    }
  });


}


function saveJSON(){
  // var fileName = document.getElementById('exportFile').value;
  var toSend = {};
  var languageExporting = document.getElementById('languageExporting').value;
  if(languageExporting == "Spanish"){
    Object.assign(toSend, spanish);
  }
  else if(languageExporting == "German"){
    Object.assign(toSend, german);
  }
  else if(languageExporting == "French"){
    Object.assign(toSend, french);
  }
  else if(languageExporting == "Identicals"){
    Object.assign(toSend, identicals);
  }

  toSend["fileName"] = "output.json";

  $.ajax({
    url: '/saveJSON',
    data: JSON.stringify(toSend),
    contentType: 'application/json; charset=utf-8',
    type: 'POST',
    async: false,
    error: function(xhr, ajaxOptions, thrownError){
      showToast("Error saving file.", "R");
    },
    success: function(data, textStatus, jqXHR){
      showToast("File Exported Successfully.", "G");
    }
  });
}

function downloadFile(filename) {
  saveJSON();
  var element = document.createElement('a');
  element.setAttribute('href', '/public/output/output.json');
  element.setAttribute('download', filename.value);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

}
