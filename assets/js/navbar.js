/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function showNavIcon() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

/* make the navbar tab of the current site active so users know where they are */
function highlightTab() {
  var url_name = window.location.href.toString().split("/").pop();
  var id_name = "nav_" + url_name.substring(0, url_name.indexOf("."));
  var x = document.getElementById(id_name);
  x.classList.add("active");
}
