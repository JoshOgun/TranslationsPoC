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
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "italianItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "inherit";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "germanItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "inherit";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "frenchItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "inherit";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "exportItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('italianSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
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

function closePreview(container, preview){
  preview.innerHTML = "";
  container.style.display = "none";
}
