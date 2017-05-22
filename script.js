/*image will load 50/50 until form is submitted, then local storage will hold a value for which image to use for 
  future page loads and button clicks. to reset local storage use homeworkApp.clearStorage();
*/

var homeworkApp = {
  imageState: 0,
  
  inputs: document.getElementsByClassName("inputs"),

  init: function() {
    //set event listeners
    document.getElementById("popup").addEventListener("click", function(e) {
      e.preventDefault();
      var bannerImage = document.getElementById("bannerImage");
      document.getElementById("user-data").classList.remove("hide");

      var session = homeworkApp.sessionId();
      if (localStorage.getItem("imageState") == "true") {
        homeworkApp.imageState = true;
      } else if (localStorage.getItem("imageState") == "false") {
        homeworkApp.imageState = false;
      } else {
        homeworkApp.imageState = homeworkApp.randomBool();
      }

      console.log(
        "session id is: " +
          session.session_id +
          " banner is: " +
          homeworkApp.imageState
      );
      if (!homeworkApp.imageState) {
        bannerImage.src = "form-img-1.png";
      } else {
        bannerImage.src = "form-img-2.png";
      }
    });
    document
      .getElementById("close-modal")
      .addEventListener("click", function() {
        document.getElementById("user-data").classList.add("hide");
      });
    document
      .getElementById("submit-button")
      .addEventListener("click", function(e) {
        e.preventDefault();
        if (homeworkApp.validateEmail()) {
          homeworkApp.createJSON();
          homeworkApp.storeImageVal();
        } else {
          homeworkApp.validateEmail();
        }
      });
    document.getElementById("email-input").addEventListener("blur", function() {
      homeworkApp.validateEmail();
    });
  },

  validateEmail: function() {
    var email = document.getElementById("email-input");
    var emailError = document.getElementById("email-error");
    var message = "Invalid email address. Try again.";
    var emailPattern = /[0-9a-z_]+@[0-9a-z_]+\.[a-z]{2,5}/i;
    var emailTest = emailPattern.test(email.value);


    if (email != "" && emailTest) {
      emailError.innerHTML = "";
      return true;
    } else {
      emailError.innerHTML = message;
      console.log(email.value + " is the value");
      return false;
    }
  },
  createJSON: function() {
    var jsonObj = [];
    for (var i = 0; i < homeworkApp.inputs.length; i++) {
      var id = this.inputs[i].getAttribute("placeholder");
      var val = this.inputs[i].value;
      var x = {};
      x[id] = val;
      jsonObj.push(x);
    }
    jsonObj.push({ "image-state": homeworkApp.imageState });
    console.log(JSON.stringify(jsonObj));
  },
  storeImageVal: function() {
    if (localStorage.getItem("imageState") === null) {
      localStorage.setItem("imageState", homeworkApp.imageState);
    }
  },
  //use in console to clear local storage homeworkApp.clearStorage();
  clearStorage: function() {
    localStorage.removeItem("imageState");
  },
  //random bool for A or B image
  randomBool: (function() {
    var a = new Uint8Array(1);
    return function() {
      crypto.getRandomValues(a);
      return a[0] < 127;
    };
  })(),
  sessionId: function() {
    //shim for Date.now
    if (!Date.now) {
      Date.now = function now() {
        return new Date().getTime();
      };
    } else {
      var timestamp = Date.now();
      var time = { session_id: timestamp };
      return time;
    }
  }
};

window.onload = function() {
  homeworkApp.init();
};
