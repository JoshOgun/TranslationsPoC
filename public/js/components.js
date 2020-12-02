/*
* Changes the active tab.
*/
function changeActive(toItem) {
  var wasActive = document.getElementById("uploadItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("italianItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("germanItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("frenchItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("dataViewItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("exportItem");
  wasActive.classList.remove("active");

  var nowActive =  document.getElementById(toItem);
  nowActive.classList.add("active");

  displayTab(toItem);
}

/*
* Shows the active tab.
*/
function displayTab(section){
  if(section == "uploadItem"){
    document.getElementById('uploadSection').style.display = "inherit";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('dataViewSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "italianItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "inherit";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('dataViewSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "germanItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "inherit";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('dataViewSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "frenchItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "inherit";
    document.getElementById('dataViewSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "dataViewItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('dataViewSection').style.display = "inherit";
    document.getElementById('exportSection').style.display = "none";

  }
  else if(section == "exportItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('dataViewSection').style.display = "none";
    document.getElementById('exportSection').style.display = "inherit";
  }
}

/*
* Shows a customisable toast message.
*/
function showToast(message, colour) {
  var toast = document.getElementById("snackbar");
  toast.innerHTML = message;

  toast.className = "show";
  if(colour == "G"){
    toast.style.backgroundColor = "#3CB371";
  }
  else if(colour = "R"){
    toast.style.backgroundColor = "#B22222"
  }

  // After 3 seconds, remove toast.
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

/*
* Resets the select components.
*/
function resetSelects() {
  var allTranslationSelects = ["toTranslateGer", "toTranslateIta", "toTranslateFr"];
  for(var j = 0; j < allTranslationSelects.length; j++){
    var selectElement = document.getElementById(allTranslationSelects[j]);
     var count = selectElement.options.length - 1;
     for(var i = count; i >= 0; i--) {
        selectElement.remove(i);
     }
 }
}

/*
* Indicates whether the file has been uploaded.
*/
function changeStrokeGreen(componentID){
  document.getElementById(componentID).setAttribute("style", "stroke: green;");
}

/*
* Creates a key and container for the nested JSON content
*/
function addJSONHeading(title, level, parent, parentIndex, childIndex, kTrail){
  var dataSection = document.getElementById("dataViewSection");
  var nestedHeader = document.createElement("button");
  nestedHeader.classList.add("jsonHeading");
  nestedHeader.style.width = "100%";
  nestedHeader.innerHTML = title;

  var div = document.createElement("div");
  div.classList.add("jsonContent");
  // Computable unique code created so content can be appended to the div.
  div.id = "content-"+title+"-"+level+""+childIndex+extractKeyCode(kTrail, false);

  div.style.width = "100%";

  nestedHeader.addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block"){
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });

  if(level == 0){
    dataSection.appendChild(nestedHeader);
    dataSection.appendChild(div);
  }
  else{
    var parentContent = document.getElementById("content-"+parent+"-"+(level-1)+""+parentIndex+extractKeyCode(kTrail, true));

    parentContent.appendChild(nestedHeader);
    parentContent.appendChild(div);
  }
}

/*
* Adds the content to a JSON key
*/
function addJSONContent(dvPair, level, parent, childIndex, kTrail){
  var dataSection = document.getElementById("dataViewSection");
  var contentDiv = document.getElementById("content-"+parent+"-"+(level-1)+""+childIndex+extractKeyCode(kTrail, false));

  var pElement = document.createElement("p");
  pElement.classList.add("mt-10");
  pElement.innerHTML = dvPair;

  contentDiv.appendChild(pElement);

}

/*
* Creates a unique code based on the trail of keys for a value;
*/
function extractKeyCode(trail, findParent){
  var code = "";
  var trailLength = trail.length;
  if(findParent == true){
    trailLength--;
  }
  for(var i=0; i < trailLength; i++){
    code = code.concat(trail[i].substring(0, 4));
  }
  return code;
}

/*
* Removes the existing data view up to the root.
*/
function clearDataView(){
  var dvSection = document.getElementById("dataViewSection");
  while (dvSection.hasChildNodes()) {
    if(dvSection.childNodes.length == 2){
      var initial = [];
      addJSONHeading("root", 0, null, -1, -1, initial);
      return;
    }
    dvSection.removeChild(dvSection.lastChild);
  }
}

function loadLangDataView(langSelect){
  var lang = langSelect.options[langSelect.selectedIndex].text;
  var initial = [];
  clearDataView();

  if(lang == "English"){
    createDataView(english, 1, "root", -1, initial);
  }
  else if(lang == "German"){
    createDataView(german, 1, "root", -1, initial);
  }
  else if(lang == "Italian"){
    createDataView(italian, 1, "root", -1, initial);
  }
  else if(lang == "French"){
    createDataView(french, 1, "root", -1, initial);
  }
}
