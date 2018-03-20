// Used to insert script that makes AJAX call to /api/ server
// console.log("Inside Main JS");

const xhttp = new XMLHttpRequest();
const currentUrl = window.location.href;
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const res = JSON.parse(xhttp.response);
    console.log(res['data']);
    // Check if cookie is present on the URL
    const cookieValue = getCookie("testID");
    console.log(cookieValue);
    if (!cookieValue) {
      res['data'].forEach(element => {
        if (currentUrl === element.url + '/') {
          console.log("The URL that matched = " + currentUrl);
          // Add the cookie
          const expires = 5;
          document.cookie = "testID" + "=" + element._id + ";" + expires + ";path=/";
          console.log(document.cookie);
          addCustomCode(element.codeSnippet);
        }
      });
    }
    else {
      // Check to see first if the testID still exists in DB
      // if (element.codeSnippet) {
        res['data'].forEach(element => {
          if (currentUrl === element.url + '/') {
            console.log("The URL that matched = " + currentUrl);
            addCustomCode(element.codeSnippet);
          }
        });
      // }
    }
    
    // If the queryParam contains testPreviewID
    if (window.location.href.includes('testPreviewID')) {
      const testID = window.location.href.split('?testPreviewID=')[1];
      // console.log(res['data']);
      res['data'].forEach(element => {
        if (testID === element._id) {
          showPreview(element.codeSnippet);
        }
      });
    }
  }
};
xhttp.open("POST", "http://localhost:3000/api/abtest/getAllAbTests", true);
xhttp.send();

addCustomCode = function(codeToBeAdded) {
  // console.log(codeToBeAdded);
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

showPreview = function(previewCode) {
  const previewScript = document.createElement('script');
  previewScript.setAttribute("type", "text/javascript");
  previewScript.setAttribute("id", "fromABTesting");
  previewScript.innerText = previewCode;
  document.body.appendChild(previewScript);    
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  console.log(ca);
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
  }
  return "";
}

// document.querySelector('h1').innerText = 'Inside Aprajitas Version of the Page';
