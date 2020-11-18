document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
showConfirmation();

function changeActive(toItem) {
  var wasActive = document.getElementById("uploadItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("spanishItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("germanItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("frenchItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("exportItem");
  wasActive.classList.remove("active");

  var nowActive =  document.getElementById(toItem);
  nowActive.classList.add("active");

  scrollTo(toItem);
}

function scrollTo(section){
  if(section == "uploadItem"){
    document.getElementById('uploadSection').style.display = "inherit";
    document.getElementById('spanishSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "spanishItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('spanishSection').style.display = "inherit";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "germanItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('spanishSection').style.display = "none";
    document.getElementById('germanSection').style.display = "inherit";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "frenchItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('spanishSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "inherit";
    document.getElementById('exportSection').style.display = "none";
  }
  else if(section == "exportItem"){
    document.getElementById('uploadSection').style.display = "none";
    document.getElementById('spanishSection').style.display = "none";
    document.getElementById('germanSection').style.display = "none";
    document.getElementById('frenchSection').style.display = "none";
    document.getElementById('exportSection').style.display = "inherit";
  }
}

function showToast(message, colour) {
  var toast = document.getElementById("snackbar");
  toast.innerHTML = message;

  // Add the "show" class to DIV
  toast.className = "show";
  if(colour == "G"){
    toast.style.backgroundColor = "#3CB371";
  }
  else if(colour = "R"){
    toast.style.backgroundColor = "#B22222"
  }

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function showConfirmation(){
  $("#myModal").collapse('toggle');
};

function removeOptions(selectElement) {
   var count = selectElement.options.length - 1;
   for(var i = count; i >= 0; i--) {
      selectElement.remove(i);
   }
}
