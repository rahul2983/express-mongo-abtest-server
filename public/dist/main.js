// Used to insert script that makes AJAX call to /api/ server
// console.log("Inside Main JS");
const xhttp = new XMLHttpRequest();
const currentUrl = window.location.href;
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const res = JSON.parse(xhttp.response);
    // console.log(res['data'].length);
    res['data'].forEach(element => {
      if (currentUrl === element.url + '/') {
        console.log("The URL that matched = " + currentUrl);
        addCustomCode(element.codeSnippet);
      }
    });
  }
};
xhttp.open("POST", "http://localhost:3000/api/abtest/getAllAbTests", true);
xhttp.send();

addCustomCode = function(codeToBeAdded) {
  console.log(codeToBeAdded);
  // console.log(document.body.querySelector("#fromABTesting"));
  // Temporary code to remove existing script tags from AB Testing Client
  if (document.body.querySelector("#fromABTesting")) {
    document.body.querySelector("#fromABTesting").remove();
  }

  if (codeToBeAdded) {
    const customScript = document.createElement('script');
    customScript.setAttribute("type", "text/javascript");
    customScript.setAttribute("id", "fromABTesting");
    customScript.innerText = codeToBeAdded;
    document.body.appendChild(customScript);
  }
  
}

// document.querySelector('h1').innerText = 'Inside Aprajitas Version of the Page';
