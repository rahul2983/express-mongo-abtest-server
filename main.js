// Used to insert script that makes AJAX call to /api/ server
console.log("Inside Main JS");
var xhttp = new XMLHttpRequest();
// xhttp.overrideMimeType('text/html');
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("demo").innerHTML = this.responseText;  
  }
};
var res;
res = xhttp.open("POST", "/api/abtest/getAllAbTests", true);
xhttp.send();
console.log(res);
