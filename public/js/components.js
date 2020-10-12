document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth', block: 'end' });

function changeActive(toItem) {
  var wasActive = document.getElementById("uploadItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("spanishItem");
  wasActive.classList.remove("active");

  wasActive = document.getElementById("germanItem");
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
  else if(section == "exportItem"){
    document.getElementById('exportSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function showToast() {
  var toast = document.getElementById("snackbar");

  // Add the "show" class to DIV
  toast.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}
