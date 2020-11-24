var accessor = []; // Sequence of keys to access a specific value.
var english = {}; // English JSON Object
var italian = {}; // Italian JSON Object
var german = {}; // German JSON Object
var french = {}; // French JSON Object
var currMissing = {}; // Current missing translations object
var identicals = {}; // Phrases which do not have a tranlsation object.
var autoChanges = 0; // Counter for the number of automatic translations that were done.

/*
* Function to retrieve the data from the uploaded files and segregate the data appropriately.
*/
function retrieveFile(){
  var language = document.getElementById('languageSelected').value;
  var fileObj = document.getElementById('fileInstance').files[0];
  if(fileObj == null){
    showToast('Please click the "Choose File" button before importing.', "R");
    return;
  }

  if (fileObj) {
    var reader = new FileReader();
    reader.readAsText(fileObj, "UTF-8");
    reader.onload = function (data) {
      var langJSON = JSON.parse(data.target.result);

      // Store data and feedback to the user.
      switch(language) {
        case "Identicals":
          identicals = langJSON;
          changeStrokeGreen('identicalCheck-01');
          changeStrokeGreen('identicalCheck-02');
          break;
        case "English":
          english = langJSON;
          changeStrokeGreen('englishCheck-01');
          changeStrokeGreen('englishCheck-02');
          break;
        case "German":
          german = langJSON;
          changeStrokeGreen('germanCheck-01');
          changeStrokeGreen('germanCheck-02');
          break;
        case "Italian":
          italian = langJSON;
          changeStrokeGreen('italianCheck-01');
          changeStrokeGreen('italianCheck-02');
          break;
        case "French":
          french = langJSON;
          changeStrokeGreen('frenchCheck-01');
          changeStrokeGreen('frenchCheck-02');
          break;
        default:
          showToast("Something went wrong.", "R");
          return;
          break;
      }
      // Display toast feedback to the user
      showToast("File Uploaded Successfully.", "G");
      // Clear form
      document.getElementById("fileInstance").value = "";
      // Cycle to the next option
      var uploadLang = document.getElementById("languageSelected");
      (uploadLang.selectedIndex == (uploadLang.options.length - 1)) ? uploadLang.selectedIndex = 0 : uploadLang.selectedIndex = uploadLang.selectedIndex+1;
    }
    reader.onerror = function (data) {
      showToast("Error Reading File.", "G");
    }
  }
}

/*
* Find the missing translations and store them alongside the trail keys keys to access it.
*/
function allKeys(eng, comparator, missingTranslations, lang){
  var languageMode;
  // Identify the language being referenced.
  switch (lang) {
    case "It":
      languageMode = italian;
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
    // Check for nested JSON.
    if(typeof eng[key] === "object"){
      // Synchronise object if keys are missing.
      if(!comparator.hasOwnProperty(key)) {comparator[key] = eng[key]};
      // Recursive call on the object.
      allKeys(eng[key], comparator[key], missingTranslations, lang);

    } else{
      // Extract values
      var engVal = getObjFromLastKey(eng, accessor);
      var langVal = getObjFromLastKey(comparator, accessor);
      if(langVal == null){
        // Synchronise JSONs is value doesn't exists.
        inputObject(languageMode, accessor.slice(), engVal);
      }
      if(engVal == langVal || langVal == null){
        // Flag this word if: the values are the same, the value doesn't exist and it is not on the ignore list.
        if(!identicals["All"].includes(engVal) && ( !identicals.hasOwnProperty(lang) || !identicals[lang].includes(engVal) )){
          // Check if translation exsists before asking for a transaltion.
          var translatedVal = checkTranslationExists(engVal, english, languageMode);
          // Fill translation if found.
          if(translatedVal != ""){
            inputObject(languageMode, accessor.slice(), translatedVal);
            autoChanges++;
          }else{
            // Append or add the associated key trails to the corresponding phrase.
            missingTranslations.hasOwnProperty(engVal) ? missingTranslations[engVal].push(accessor.slice()) : missingTranslations[engVal] = [accessor.slice()] ;
          }
        }
      }
    }
    accessor.pop();
  }

  console.log(missingTranslations);
  return missingTranslations;
}

/*
* Check if the tranlsation exists anywhere else in the JSON.
*/
function checkTranslationExists(keyInstance, base, compare){
  var retrievedVal = "";
  for (var key in base) {
    // Recursion if the JSON is nested.
    if(typeof base[key] === "object"){
      try{
        retrievedVal = checkTranslationExists(keyInstance, base[key], compare[key]);
        // Return tranlsated value if found.
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

/*
* Retrieves an object while in recursion.
*/
function getObjFromLastKey(jsonObj, keyTrail){
  try{
    return jsonObj[keyTrail[keyTrail.length-1]];
  }
  catch{
    // reference not found in the counterpart object.
    return null;
  }
}

/*
* Retrieves a value from JSON, given the sequence of keys.
*/
function getObject(jsonObj, keyTrail){
  var baseObject = {};
  Object.assign(baseObject, jsonObj);
  for(var i = 0; i < keyTrail.length; i++){
    baseObject = baseObject[keyTrail[i]];
  }
  return baseObject;
}

/*
* Injects a value into a nested json, given a sequence of keys.
*/
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

/*
* Populates the drop down with the translations needed.
*/
function addOptions(base, comparator, selectComponent, lang){

  // Reset variables
  Object.assign(currMissing, {});
  accessor = [];
  autoChanges = 0;

  // Check if the appropriate files have been uploaded.
  if(!checkFilesNeeded(base, comparator, identicals)){
    return;
  }

  var missing = {};
  missing = allKeys(base, comparator, missing, lang);
  // Output how many translations have been filled in automatically and how many are remaining.
  showToast(autoChanges + " Phrase(s) translated. " + Object.keys(missing).length + " Translation(s) left.", "G");

  // Clear all the drop downs.
  resetSelects();

  // Add the translations needed to the dropdown.
  for(var element in missing){
    var opt = document.createElement("option");
    // Value ensures exact duplicates are removed.
    opt.value = element;

    // Limits the size of the dropdown
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

/*
* Store the submitted tranlsations in the appropriate object.
*/
function submitTranslation(lang, selectComponent, textComponent){

  var inputTranslation = textComponent.value;
  var missingKey = selectComponent.value;
  var updatedTranlsations;

  if(missingKey == ""){
    showToast('Please ensure that you have pressed "Load".', "R");
    return;
  }

  // Ensures the translations are stored in duplicates as well.
  for(var i = 0; i < currMissing[missingKey].length; i++){
    updatedTranlsations = inputObject(lang, currMissing[missingKey][i], inputTranslation);
  }

  selectComponent.remove(selectComponent.selectedIndex);
  textComponent.value = '';

  // Check if there are anymore translations needed.
  checkCompleted(selectComponent);

}

/*
* Add a phrase to the list of words which are to be ignored.
*/
function updateIdenticals(lang, selectComponent){

  if(selectComponent.value == ""){
    showToast("Something went wrong.", "R");
    return;
  }

  switch(lang) {
    case "German":
      appendToIgnores("De", selectComponent.value);
      break;
    case "Italian":
      appendToIgnores("It", selectComponent.value);
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

/*
* Navigate to export section once there are no more translations needed.
*/
function checkCompleted(selectComponent){
  if(selectComponent.length == 0){
    showToast("All translations done.", "G");
    changeActive('exportItem');
  }
}

/*
* Append the phrase that is to be ignored to the appropriate list.
*/
function appendToIgnores(key, element){
  if(identicals.hasOwnProperty(key)){
    identicals[key].push(element);
  }
  else{
    identicals[key] = [element];
  }
  return identicals;
}

/*
* Enable the preview component if the phrase is too long.
*/
function checkSelected(selectElement, tArea){

  if(selectElement.value.length > 42){
    document.getElementById(tArea).style.display = "block";
    document.getElementById(tArea).value = selectElement.value;
  }
  else {
    document.getElementById(tArea).style.display = "none";
  }
}

/*
* Check if the necessary files have been uploaded.
*/
function checkFilesNeeded(base, comparator, ignores){
  if(Object.keys(base).length === 0 && base.constructor === Object || comparator.constructor != Object || Object.keys(ignores).length === 0 && ignores.constructor === Object){
    showToast("Please check you have loaded the appropriate files.", "R");
    return false;
  }
  else{
    return true;
  }
}

function exportMissing(transNeeded){
  var toExport = {};

  if(Object.keys(currMissing).length === 0){
    showToast("There is nothing to export.", "R");
    return;
  }

  Object.assign(toExport, currMissing);

  // IMPLEMENT SOME PREVIEW AND COPY TO CLIPBOARD

}

/*
* Previews the resultant JSON object.
*/
function showJson(){
  var exportObj = document.getElementById('languageExporting').value;
  var output = "";

  if(exportObj == "German"){
     output = JSON.stringify(german, null, "\t");
  }
  else if(exportObj == "Italian"){
    output = JSON.stringify(italian, null, "\t");
  }
  else if(exportObj == "French"){
    output = JSON.stringify(french, null, "\t");
  }
  else if(exportObj == "Identicals"){
    output = JSON.stringify(identicals, null, "\t");
  }

  if(output != "{}"){
    document.getElementById('outputResult').value = output;
    showToast("Content loaded.", "G");
  }
  else{
    showToast("Object is empty.", "R");
  }
}

/*
* Copys the resultant JSON object to clipboard.
*/
function copyJSON(){
  var copyText = document.getElementById("outputResult");

  copyText.select();

  document.execCommand("copy");

  if(copyText.value != " "){
    showToast("Saved to Clipboard", "G");
  }
  else{
    showToast("Please ensure you have loaded an object.", "R");
  }

}
