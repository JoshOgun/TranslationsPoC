function changeActive(toItem) {
  var wasActive = document.getElementById("uploadItem");
  wasActive.classList.remove("active");

  var wasActive = document.getElementById("spanishItem");
  wasActive.classList.remove("active");

  var wasActive = document.getElementById("germanItem");
  wasActive.classList.remove("active");

  var nowActive =  document.getElementById(toItem);
  nowActive.classList.add("active");

  scrollTo(toItem);
}

function scrollTo(section){
  if(section == "uploadItem"){
    document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // document.getElementById('uploadSection').scrollIntoView();
  }
  else if(section == "spanishItem"){
    document.getElementById('spanishSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // document.getElementById('spanishSection').scrollIntoView();
  }
  else if(section == "germanItem"){
    document.getElementById('germanSection').scrollIntoView({ behavior: 'smooth', block: 'end' });
    // document.getElementById('germanSection').scrollIntoView();
  }
}
