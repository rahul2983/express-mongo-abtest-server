// Add Code to implement workaround for Same Origin Security Policy
// Refer https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame

// Call API and get the existing AB Tests
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
        if (currentUrl === element.url + '/' && element.testStatus === 'active') {
          // console.log("The URL that matched = " + currentUrl);
          // Add the cookie
          const expires = 5;
          document.cookie = "testID=" + element._id + ";" + expires + ";path=/";
          console.log("Setting cookie for the first time" + document.cookie);
          // Set the Traffic and add custom code only if it is not control
          console.log(element.testTraffic);
          console.log(element.testType);
          if (element.testStatus === 'active') {
            if (element.testType === 'WYSIWYG') {
              allocateTestTraffic(element.testTraffic, element.modifiedDom, element.testType); 
            } else if (element.testType === 'Custom Code')
            allocateTestTraffic(element.testTraffic, element.codeSnippet, element.testType); 
          }
        }
      });
    }
    else {
      // Check to see first if the testID still exists in DB
      res['data'].forEach(element => {
        if (currentUrl === element.url + '/' && element.testStatus === 'active') {
          // console.log("The URL that matched = " + currentUrl);
          // Set the Traffic and add custom code only if it is not control
          console.log(element.testTraffic);
          console.log(element.testType);
          if (element.testStatus === 'active') {
            if (element.testType === 'WYSIWYG') {
              allocateTestTraffic(element.testTraffic, element.modifiedDom, element.testType); 
            } else if (element.testType === 'Custom Code')
            allocateTestTraffic(element.testTraffic, element.codeSnippet, element.testType); 
          }
        }
      });
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

addCustomCode = function(codeToBeAdded, testType) {
  // console.log(codeToBeAdded);
  // console.log(document.body.querySelector("#fromABTesting"));
  // Temporary code to remove existing script tags from AB Testing Client
  if (testType === 'Custom Code') {
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
  } else if (testType === 'WYSIWYG') {
    // document.body.innerHTML = '';
    document.body.innerHTML = codeToBeAdded;
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

allocateTestTraffic = function(trafficPercentage, codeToBeAdded, testType) {
  // generate a random number and compare with traffic percentage
  const min = 1;
  const max = 100;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  if (randomNumber <= trafficPercentage) {
    console.log("Random Number is " + randomNumber);
    // the random generator is within traffic allocation
    console.log("In the Test");
    addCustomCode(codeToBeAdded, testType);  
  }
  else {
    console.log("In the Control");
  }
}
