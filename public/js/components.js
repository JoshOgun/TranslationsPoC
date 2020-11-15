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
    document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  else if(section == "spanishItem"){
    document.getElementById('spanishSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  else if(section == "germanItem"){
    document.getElementById('germanSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  else if(section == "frenchItem"){
    document.getElementById('frenchSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  else if(section == "exportItem"){
    document.getElementById('exportSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
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
