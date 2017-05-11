"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*jshint esversion: 6*/
/*jshint sub:true*/
/* jshint loopfunc: true */

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props)); //TODO: change this to a yaml parser when you're done testing out the basic UI


    _this.developmentMode = false;

    _this.json = {};

    _this.retrieve = _this.retrieve.bind(_this);

    _this.tagLine = "The Ultimate QT Infograph";
    _this.webVersion = "2.0 Alpha";
    _this.chartVersion = "3.0";

    _this.contactInfo = 'qtprime@qtchart.com';

    _this.requestChartImage = _this.requestChartImage.bind(_this);

    _this.pageLoadHandler = _this.pageLoadHandler.bind(_this);
    _this.loginConfirmationHandler = _this.loginConfirmationHandler.bind(_this);
    _this.pageLoadAndLoginConfirmationHandler = _this.pageLoadAndLoginConfirmationHandler.bind(_this);

    _this.createPage = _this.createPage.bind(_this);
    _this.login = _this.login.bind(_this);
    _this.logout = _this.logout.bind(_this);

    //TODO: I'm planning on rolling the field format generation into the back-end, these hard-coded lists will disappear
    _this.categoryMulticolorCheckboxMap = { 'Emotional': { 'Quirks': ['Adventurous', 'Ambitious', 'Analytical', 'Artistic', 'Assertive', 'Athletic', 'Confident', 'Creative', 'Cutesy', 'Cynical', 'Easy-going', 'Empathetic', 'Energetic', 'Honest', 'Humorous', 'Hygienic', 'Intelligent', 'Kind', 'Lazy', 'Loud', 'Materialistic', 'Messy', 'Outdoorsy', 'Passionate', 'Reliable', 'Resourceful', 'Romantic', 'Serious', 'Sexual', 'Social', 'Talkative', 'Wise']
      } };

    _this.categorySingleColorYouCheckboxMap = { 'Physical': { 'Gender': ['Male', 'Female', 'MTF', 'FTM'],
        'Race': ['White', 'Asian', 'Latin', 'Arab', 'Black', 'Other'],
        'Body Type': ['Fit', 'Skinny', 'Thin', 'Medium', 'Chubby', 'Fat'],
        'Facial Hair': ['None', 'Moustache', 'Goatee', 'Stubble', 'Beard', 'Wizard'],
        'Hair Style': ['Bald', 'Short', 'Medium', 'Long', 'Very Long'],
        'Hair Color': ['Black', 'Brown', 'Gold', 'Blonde', 'Ginger', 'Other'] },
      'Beliefs': { 'Religion': ['Christian', 'Muslim', 'Jewish', 'Pagan', 'Satanist', 'Deist', 'Polydeist', 'Agnostic', 'Atheist', 'Other']
      } };

    _this.categoryBooleanBarMap = { 'Physical': ['Piercings', 'Tattoos'] };

    _this.categoryNumericalBarMap = { 'Physical': { 'Age': { 'min': 16, 'max': 31, 'numCells': 8 }, 'Height': { 'min': 57, 'max': 76, 'numCells': 10 } } };

    _this.categoryFuzzyBarMap = { 'Emotional': { 'Extroversion': { 'numCells': 10, 'left': 'Introverted', 'right': 'Extroverted' },
        'Practicality': { 'numCells': 10, 'left': 'Theoretical', 'right': 'Practical' },
        'Emotional': { 'numCells': 10, 'left': 'Logical', 'right': 'Emotional' },
        'Spontaneity': { 'numCells': 10, 'left': 'Structured', 'right': 'Spontaneous' } },
      'Beliefs': { 'Religious Devotion': { 'numCells': 5, 'left': 'Low', 'right': 'High' },
        'Political Views': { 'numCells': 7, 'left': 'Libertarian', 'right': 'Authoritarian' },
        'Social Views': { 'numCells': 7, 'left': 'Progressive', 'right': 'Conservative' } },
      'Other': { 'Alcohol': { 'numCells': 3, 'left': 'Never', 'right': 'Frequently' },
        'Tobacco': { 'numCells': 3, 'left': 'Never', 'right': 'Frequently' },
        'Other Drugs': { 'numCells': 3, 'left': 'Never', 'right': 'Frequently' } }
    };

    _this.categorySingleColorYou2DCheckboxMap = { 'Beliefs': { 'Economic Views': { 'top': 'Capitalist', 'bottom': 'Socialist', 'left': 'Free Market', 'right': 'Regulated Market', 'cellDimensions': 5 } } };

    _this.bulletListMap = { 'More Information': { 'Contact Info': { 'maxBullets': 3 }, 'Sites/Boards': { 'maxBullets': 3 }, 'Sports': { 'maxBullets': 3 }, 'Music': { 'maxBullets': 3 }, 'Literature': { 'maxBullets': 3 }, 'Games': { 'maxBullets': 3 }, 'Movies/TV': { 'maxBullets': 3 }, 'Mutual Activities': { 'maxBullets': 7 }, 'Other Interests': { 'maxBullets': 6 }, 'Other Information': { 'maxBullets': 10 } } };

    _this.singleBulletListMap = { 'Other': ['Location', 'Occupation'] };

    _this.categoryElementMap = {
      'singleColorYouCheckboxSets': _this.categorySingleColorYouCheckboxMap,
      'multicolorCheckboxSets': _this.categoryMulticolorCheckboxMap,
      'booleanSelectBars': _this.categoryBooleanBarMap,
      'numericalSelectBars': _this.categoryNumericalBarMap,
      'fuzzySelectBars': _this.categoryFuzzyBarMap,
      'singleColorYou2DCheckboxSets': _this.categorySingleColorYou2DCheckboxMap,
      'bulletLists': _this.bulletListMap,
      'singleBulletLists': _this.singleBulletListMap
    };

    _this.allowDownloadClick = true; //prevent the backend from being POST-spammed through the frontend by download-button mashing

    _this.state = {
      generateButtonText: 'Download',
      errorMessage: '',
      errorMessageDisplayMode: 'off',
      loadedJson: {},
      interactionFrozen: false,
      emptyElementsHidden: false
    };

    _this.jsonLoadId = '';

    _this.state.loggedIn = false;

    var restParams = new URLSearchParams(window.location.search.slice(1));

    _this.state.username = '';
    if (restParams.has("user")) {
      var username = restParams.get("user");

      _this.userDataFromUsername(username, _this.pageLoadHandler);
      _this.userDataFromSessionCookie(_this.loginConfirmationHandler);
      _this.state.viewerType = "visitor";
    } else {
      _this.userDataFromSessionCookie(_this.pageLoadAndLoginConfirmationHandler);
      _this.state.viewerType = "owner";
    }

    if (_this.state.viewerType == "visitor") {
      _this.state.interactionFrozen = true;
      _this.state.emptyElementsHidden = true;
    }
    return _this;
  }

  //static get restServerDomain() { return 'http://127.0.0.1:5000/'; }


  _createClass(Chart, [{
    key: "getLoadedJsonForChild",
    value: function getLoadedJsonForChild(targetName) {
      //console.log(this.state.loadedJson);
      if (targetName.toLowerCase() in this.state.loadedJson) {
        var jsonWithId = {};
        jsonWithId[targetName.toLowerCase()] = JSON.parse(JSON.stringify(this.state.loadedJson))[targetName.toLowerCase()];
        jsonWithId["id"] = this.jsonLoadId;
        //console.log(jsonWithId);
        return jsonWithId;
      } else {
        return {};
      }
    }
  }, {
    key: "freezeInteraction",
    value: function freezeInteraction() {
      this.setState({ interactionFrozen: true });
    }
  }, {
    key: "unfreezeInteraction",
    value: function unfreezeInteraction() {
      this.setState({ interactionFrozen: false });
    }
  }, {
    key: "retrieve",
    value: function retrieve(childJson) {
      for (var firstName in childJson) {
        this.json[firstName] = childJson[firstName];
      }
    }

    //the backend uses a different image element tree configuration than the frontend -- backend starts with a category, frontend with a target

  }, {
    key: "jsonFrontend2BackendRepresentation",
    value: function jsonFrontend2BackendRepresentation() {
      var backendJson = {};

      //TODO: there HAS to be a better way to initialize the first two dimensions without introducing more global state
      for (var targetName in this.json) {
        for (var categoryName in this.json[targetName]) {
          backendJson[categoryName] = {};
          for (var elementName in this.json[targetName][categoryName]) {
            backendJson[categoryName][elementName] = {};
          }
        }
        break; //only does one iteration
      }

      for (var _targetName in this.json) {
        for (var _categoryName in this.json[_targetName]) {
          for (var _elementName in this.json[_targetName][_categoryName]) {
            backendJson[_categoryName][_elementName][_targetName] = this.json[_targetName][_categoryName][_elementName];
          }
        }
      }

      return backendJson;
    }
  }, {
    key: "missingElements",
    value: function missingElements() {
      var missingElements = {};
      for (var targetName in this.json) {
        missingElements[targetName] = {};
        for (var categoryName in this.json[targetName]) {
          missingElements[targetName][categoryName] = [];
          for (var elementName in this.json[targetName][categoryName]) {
            var nonNoneElementExists = false;
            var noneElementExists = false;

            if (typeof this.json[targetName][categoryName][elementName] != 'string') {
              for (var subelementName in this.json[targetName][categoryName][elementName]) {
                if (this.json[targetName][categoryName][elementName][subelementName] != 'none') {
                  nonNoneElementExists = true;
                } else {
                  noneElementExists = true;
                }
              }
            } else {
              if (this.json[targetName][categoryName][elementName] != 'none') {
                nonNoneElementExists = true;
              } else {
                noneElementExists = true;
              }
            }

            //whether 'you' or 'them', every MC CB in the set should be filled out
            if (Chart.capitalize(categoryName) in this.categoryMulticolorCheckboxMap) {
              if (Chart.capitalize(elementName) in this.categoryMulticolorCheckboxMap[Chart.capitalize(categoryName)]) {
                if (noneElementExists) {
                  missingElements[targetName][categoryName].push(elementName);
                  continue;
                }
              }
            }

            if (targetName.toLowerCase() == 'you') {
              if (!nonNoneElementExists) {
                missingElements[targetName][categoryName].push(elementName);
                continue;
              }
            }

            if (targetName.toLowerCase() == 'them') {
              if (noneElementExists) {
                missingElements[targetName][categoryName].push(elementName);
                continue;
              }
            }
          }
        }
      }

      return missingElements;
    }
  }, {
    key: "firstMissingElement",
    value: function firstMissingElement() {
      var missingElements = this.missingElements();
      for (var targetName in missingElements) {
        for (var categoryName in missingElements[targetName]) {
          if (missingElements[targetName][categoryName].length > 0) {
            var singleMissingElementHash = {};
            singleMissingElementHash[targetName] = {};
            singleMissingElementHash[targetName][categoryName] = missingElements[targetName][categoryName][0];

            return singleMissingElementHash; //returns a multilevel hash of a single element indexed by its target and category
          }
        }
      }

      throw "There were no missing elements to return.";
    }
  }, {
    key: "noMissingElements",
    value: function noMissingElements() {
      var missingElements = this.missingElements();
      for (var targetName in missingElements) {
        for (var categoryName in missingElements[targetName]) {
          if (missingElements[targetName][categoryName].length !== 0) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "pageLoadHandler",
    value: function pageLoadHandler(username, initialData) {
      this.jsonLoadId = Math.random();
      this.setState({ username: username, loadedJson: initialData });
    }

    //basically ignores the user data, just confirms that the user is logged in
    //TODO: new request function which just returns whether your session is valid

  }, {
    key: "loginConfirmationHandler",
    value: function loginConfirmationHandler(username, initialData) {
      this.setState({ loggedIn: true });
    }
  }, {
    key: "pageLoadAndLoginConfirmationHandler",
    value: function pageLoadAndLoginConfirmationHandler(username, initialData) {
      this.pageLoadHandler(username, initialData);
      this.loginConfirmationHandler(username, initialData);
    }
  }, {
    key: "createPage",
    value: function createPage(username, password, successHandler, failureHandler) {
      this.createPageServerSide(username, password, this.json, successHandler, failureHandler);
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(username, password) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.open('DELETE', Chart.userDeleteRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "text";
      httpRequest.send(JSON.stringify({ "username": username, "password": password }));
    }
  }, {
    key: "userDataFromSessionCookie",
    value: function userDataFromSessionCookie(handler) {
      //returns nothing and deletes session cookie on error
      var sessionId;
      var username;
      var initialData = {};

      var httpRequest = new XMLHttpRequest();

      if (localStorage.getItem("sessionId") !== null) {
        httpRequest.open('POST', Chart.userUsernameRequestUri, true); //need the username before we can do anything else
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        //httpRequest.responseType = "text";

        //console.log(JSON.stringify({"sessionId": localStorage.getItem("sessionId")}));

        var that = this;
        httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
            username = httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, "");
            that.userDataFromUsername(username, handler);
          } else if (httpRequest.status >= 400) {
            localStorage.removeItem("sessionId");
          }
        };
        httpRequest.onerror = function () {
          localStorage.removeItem("sessionId");
        };
        //httpRequest.send(JSON.stringify({"username": "username"}));
        httpRequest.send(JSON.stringify({ "sessionId": localStorage.getItem("sessionId") }));
      }
    }
  }, {
    key: "userDataFromUsername",
    value: function userDataFromUsername(username, handler) {
      var initialData = '';

      var httpRequest = new XMLHttpRequest();

      httpRequest.open('POST', Chart.userDataRequestUri, true); //need the data before we can load components
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "json";

      var that = this;
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
          initialData = JSON.parse(httpRequest.response);
          handler(username, initialData);
        } else if (httpRequest.status >= 400) {
          localStorage.removeItem("sessionId");
        }
      };
      httpRequest.onerror = function () {
        localStorage.removeItem("sessionId");
      };
      httpRequest.send(JSON.stringify({ 'username': username }));
    }
  }, {
    key: "createPageServerSide",
    value: function createPageServerSide(username, password, userData, successHandler, failureHandler) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.open('POST', Chart.userCreationRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "text";

      var that = this;
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 201) {
          localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
          successHandler();
        } else if (httpRequest.status >= 400) {
          failureHandler(httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
        }
      };
      httpRequest.onerror = function () {
        failureHandler('Unidentified failure.');
      };
      httpRequest.send(JSON.stringify({ "username": username, "password": password, "userData": userData }));
    }
  }, {
    key: "logout",
    value: function logout() {
      this.setLoginStatusAndViewerType(false, 'owner');

      localStorage.removeItem('sessionId');

      var httpRequest = new XMLHttpRequest();

      httpRequest.open('DELETE', Chart.userLogoutRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "text";
      httpRequest.send(JSON.stringify({ "sessionId": localStorage.getItem('sessionId') }));
    }
  }, {
    key: "login",
    value: function login(username, password, pageLoadHandler, successHandler, failureHandler) {
      localStorage.removeItem('sessionId');

      var httpRequest = new XMLHttpRequest();

      httpRequest.open('POST', Chart.userLoginRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "text";

      //grab our session from the login response
      var that = this;
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 201) {
          localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
          successHandler();
          that.userDataFromSessionCookie(pageLoadHandler);
          that.setLoginStatusAndViewerType(true, 'owner');
        } else if (httpRequest.status >= 400) {
          failureHandler(httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
        }
      };
      httpRequest.onerror = function () {
        failureHandler('Unidentified failure.');
      };
      httpRequest.send(JSON.stringify({ "username": username, "password": password }));
    }
  }, {
    key: "setLoginStatusAndViewerType",
    value: function setLoginStatusAndViewerType(loggedIn, viewerType) {
      var loadedJson = this.state.loadedJson;
      var username = this.state.username;
      if (!loggedIn) {
        this.jsonLoadId = Math.random();
        loadedJson = {};

        if (viewerType === "owner") {
          username = '';
        }
      }

      if (viewerType === "visitor") {
        this.setState({
          loggedIn: loggedIn,
          viewerType: viewerType,
          loadedJson: loadedJson,
          username: username,
          interactionFrozen: true,
          emptyElementsHidden: true
        });
      } else if (viewerType === "owner") {
        this.setState({
          loggedIn: loggedIn,
          viewerType: viewerType,
          loadedJson: loadedJson,
          username: username,
          interactionFrozen: false,
          emptyElementsHidden: false
        });
      }
    }
  }, {
    key: "updatePageServerSide",
    value: function updatePageServerSide() {
      var httpRequest = new XMLHttpRequest();

      httpRequest.open('POST', Chart.userDataUpdateRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "text";

      var that = this;
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
          localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
        } else if (httpRequest.status >= 400) {
          that.showFailedRequestWarning(httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
        }
      };
      httpRequest.onerror = function () {
        that.showFailedRequestWarning(httpRequest.responseText.replace(/(\n)/gm, "").replace(/(\")/gm, ""));
      };
      httpRequest.send(JSON.stringify({ "sessionId": localStorage.getItem("sessionId"), "userData": this.json }));
    }
  }, {
    key: "showGenerateWaitAnimation",
    value: function showGenerateWaitAnimation() {
      this.setState({ generateButtonText: 'Generating' });

      //TODO: figure out how to get this working in Firefox
      /*
      var that = this;
      var periodCount = 0;
      this.generationAnimationTimer = setInterval( function() { //keep timer short, so that
        that.setState({generateButtonText: 'Generating' + '.'.repeat(periodCount)});
        if (periodCount<3) {
          periodCount++;
        } else {
          periodCount = 0;
        }
      }, that.generateAnimationTick);
      */
    }
  }, {
    key: "hideGenerateWaitAnimation",
    value: function hideGenerateWaitAnimation() {
      if (this.generationAnimationTimer !== null) {
        clearInterval(this.generationAnimationTimer);
      }

      this.setState({ generateButtonText: Chart.defaultGenerateButtonText });
    }
  }, {
    key: "showEmptyFieldWarning",
    value: function showEmptyFieldWarning() {
      var missingElement = this.firstMissingElement();
      for (var targetName in missingElement) {
        for (var categoryName in missingElement[targetName]) {
          var elementName = missingElement[targetName][categoryName];
          this.setState({ errorMessage: 'Missing field in \'' + Chart.capitalize(elementName) + '\' under \'' + Chart.capitalize(targetName) + '\' → \'' + Chart.capitalize(categoryName) + '\'', errorMessageDisplayMode: 'on' });
          return;
        }
      }
    }
  }, {
    key: "showFailedRequestWarning",
    value: function showFailedRequestWarning(errorMessage) {
      this.setState({ errorMessage: errorMessage, errorMessageDisplayMode: 'on' });
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, {
    key: "hideProcessingErrorWarning",
    value: function hideProcessingErrorWarning() {
      this.setState({ errorMessage: '', errorMessageDisplayMode: 'off' });
    }
  }, {
    key: "requestChartImage",
    value: function requestChartImage() {
      if (!this.allowDownloadClick) {
        return;
      }

      this.hideProcessingErrorWarning();

      //console.log(JSON.stringify(this.jsonFrontend2BackendRepresentation()));

      if (!this.noMissingElements()) {
        this.showEmptyFieldWarning();
        return;
      }

      var httpRequest = new XMLHttpRequest();

      //console.log(JSON.stringify(this.jsonFrontend2BackendRepresentation()).length);
      /*
      //refuse to go further and display a warning if fields are unselected
      if (!this.allFieldsSelected()) {
        this.showEmptyFieldWarning();
        return;
      } else {
        this.hideProcessingErrorWarning();
      }
      */

      this.showGenerateWaitAnimation();
      //console.log(this.imageRequestUri());
      httpRequest.open('POST', Chart.imageRequestUri, true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.responseType = "blob";

      var that = this;
      that.allowDownloadClick = false;
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
          var imageBlob = new Blob([httpRequest.response], { type: 'application/octet-stream' });
          that.hideGenerateWaitAnimation();
          that.allowDownloadClick = true;
          saveAs(imageBlob, "chart.jpg");
        } else if (httpRequest.status >= 400) {
          //something went wrong
          //console.log('Failed response.');
          that.showFailedRequestWarning('Could not contact image generation server -- try again.');
          that.hideGenerateWaitAnimation();
          that.allowDownloadClick = true;
        }
      };
      httpRequest.onerror = function () {
        that.showFailedRequestWarning('Could not contact image generation server -- try again.');
        that.hideGenerateWaitAnimation();
        that.allowDownloadClick = true;
      };
      //httpRequest.withCredentials = true;//TODO: might need this later (for when I'm using sessions)
      httpRequest.send(JSON.stringify(this.jsonFrontend2BackendRepresentation()));
    }
  }, {
    key: "openLoginPrompt",
    value: function openLoginPrompt() {
      $('#loginModal').modal('show');
    }
  }, {
    key: "openRegisterPrompt",
    value: function openRegisterPrompt() {
      $('#registerModal').modal('show');
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var targets = [];
      var possibleTargets = ["You", "Them"];
      for (var i = 0; i < possibleTargets.length; i++) {
        targets.push(React.createElement(Target, { key: possibleTargets[i], targetName: possibleTargets[i], username: this.state.username, categoryElementMap: this.categoryElementMap, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(possibleTargets[i]), interactionFrozen: this.state.interactionFrozen, emptyElementsHidden: this.state.emptyElementsHidden }));
      }

      var footerButtons = [];
      footerButtons.push(React.createElement(
        "button",
        { type: "button", name: "download", onClick: this.requestChartImage },
        this.state['generateButtonText']
      ));

      footerButtons.push(React.createElement("div", { className: "buttonSpacingDiv" }));

      if (this.state.viewerType == "owner") {
        if (this.state.loggedIn) {
          footerButtons.push(React.createElement(
            "button",
            { type: "button", name: "Update", onClick: function onClick() {
                _this2.updatePageServerSide();
              } },
            "Update"
          ));
        } else {
          footerButtons.push(React.createElement(
            "button",
            { type: "button", name: "registerModalButton", onClick: function onClick() {
                _this2.openRegisterPrompt();
              } },
            "Save Page"
          ));
        }
      }

      if (this.developmentMode) {
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "Logout", onClick: function onClick() {
              _this2.logout();
            } },
          "Logout"
        ));
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "loginModalButton", onClick: function onClick() {
              _this2.openLoginPrompt();
            } },
          "Log Modal"
        ));
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "freezeUnfreeze", onClick: function onClick() {
              _this2.setState({ interactionFrozen: !_this2.state.interactionFrozen });
            } },
          "Freezer"
        ));
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "hideUnhide", onClick: function onClick() {
              _this2.setState({ emptyElementsHidden: !_this2.state.emptyElementsHidden });
            } },
          "Hider"
        ));
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "deleteUserA", onClick: function onClick() {
              return _this2.deleteUser("testusera", "password");
            } },
          "DeleteUserA"
        ));
        footerButtons.push(React.createElement(
          "button",
          { type: "button", name: "deleteUserB", onClick: function onClick() {
              return _this2.deleteUser("testuserb", "password");
            } },
          "DeleteUserB"
        ));
      }

      return React.createElement(
        "div",
        { className: "chart fillSmallScreen" },
        React.createElement(ChartName, { webVersion: this.webVersion, contactInfo: this.contactInfo, viewerType: this.state.viewerType, loggedIn: this.state.loggedIn, logout: this.logout, openLoginPrompt: this.openLoginPrompt }),
        targets,
        React.createElement(
          "div",
          { className: "chartFooter" },
          React.createElement(LoginRegisterModal, { modalType: 'login', loginOrRegister: this.login, pageLoadHandler: this.pageLoadHandler }),
          React.createElement(LoginRegisterModal, { modalType: 'register', loginOrRegister: this.createPage, pageLoadHandler: this.pageLoadHandler }),
          React.createElement(
            "div",
            { className: "footerButtons" },
            footerButtons
          ),
          React.createElement(
            "div",
            { className: 'errorMessage ' + this.state.errorMessageDisplayMode },
            this.state.errorMessage
          )
        )
      );
    }
  }], [{
    key: "capitalize",
    value: function capitalize(string) {
      var words = string.toLowerCase().split(' ');
      for (var i = 0; i < words.length; i++) {
        var letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
      }

      return words.join(' ');
    }
  }, {
    key: "webApiDomain",
    get: function get() {
      return 'http://web-api.qtchart.com';
    }
  }, {
    key: "imageApiDomain",
    get: function get() {
      return 'http://image-api.qtchart.com';
    }
  }, {
    key: "imageRequestUri",
    get: function get() {
      return Chart.imageApiDomain + '/new';
    }
  }, {
    key: "userDataRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/read';
    }
  }, {
    key: "userCreationRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/create';
    }
  }, {
    key: "userDataUpdateRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/update';
    }
  }, {
    key: "userLoginRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/login';
    }
  }, {
    key: "userLogoutRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/logout';
    }
  }, {
    key: "userUsernameRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/username';
    }
  }, {
    key: "userDeleteRequestUri",
    get: function get() {
      return Chart.webApiDomain + '/user/delete';
    }
  }, {
    key: "defaultGenerateButtonText",
    get: function get() {
      return 'Download';
    }
  }, {
    key: "generateAnimationTick",
    get: function get() {
      return 1000;
    }
  }]);

  return Chart;
}(React.Component);

//TODO: the modal needs to define its own handler for login / registration (so that it can display the right messages)
//props: modalType, loginOrRegister (handler)


var LoginRegisterModal = function (_React$Component2) {
  _inherits(LoginRegisterModal, _React$Component2);

  function LoginRegisterModal(props) {
    _classCallCheck(this, LoginRegisterModal);

    var _this3 = _possibleConstructorReturn(this, (LoginRegisterModal.__proto__ || Object.getPrototypeOf(LoginRegisterModal)).call(this, props));

    _this3.username = '';
    _this3.password = '';

    _this3.loginRegistrationFailureHandler = _this3.loginRegistrationFailureHandler.bind(_this3);
    _this3.loginRegistrationSuccessHandler = _this3.loginRegistrationSuccessHandler.bind(_this3);

    _this3.state = {
      warningMessage: ''
    };
    return _this3;
  }

  _createClass(LoginRegisterModal, [{
    key: "usernameChangeHandler",
    value: function usernameChangeHandler(event) {
      this.username = event.target.value;
    }
  }, {
    key: "passwordChangeHandler",
    value: function passwordChangeHandler(event) {
      this.password = event.target.value;
    }
  }, {
    key: "loginRegistrationFailureHandler",
    value: function loginRegistrationFailureHandler(responseText) {
      this.setState({ warningMessage: 'Can\'t ' + this.props.modalType + ' - ' + responseText });
    }
  }, {
    key: "loginRegistrationSuccessHandler",
    value: function loginRegistrationSuccessHandler() {
      this.setState({ warningMessage: '' });
      this.close();
    }
  }, {
    key: "close",
    value: function close() {
      $('#' + this.props.modalType + "Modal").modal('toggle');
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var requestButtonJsx;
      if (this.props.modalType == "login") {
        requestButtonJsx = React.createElement(
          "button",
          { name: this.props.modalType, onClick: function onClick() {
              _this4.props.loginOrRegister(_this4.username, _this4.password, _this4.props.pageLoadHandler, _this4.loginRegistrationSuccessHandler, _this4.loginRegistrationFailureHandler);
            } },
          Chart.capitalize(this.props.modalType)
        );
      } else if (this.props.modalType == "register") {
        requestButtonJsx = React.createElement(
          "button",
          { name: this.props.modalType, onClick: function onClick() {
              _this4.props.loginOrRegister(_this4.username, _this4.password, _this4.loginRegistrationSuccessHandler, _this4.loginRegistrationFailureHandler);
            } },
          Chart.capitalize(this.props.modalType)
        );
      }

      return React.createElement(
        "div",
        { className: "modal fade", id: this.props.modalType + "Modal", tabindex: "-1", role: "dialog", "aria-labelledby": this.props.modalType + "ModalAria", "aria-hidden": "true" },
        React.createElement(
          "div",
          { className: "modal-dialog modal-sm", role: "document" },
          React.createElement(
            "div",
            { className: "modal-content" },
            React.createElement(
              "div",
              { className: "modal-header" },
              React.createElement(
                "h4",
                { className: "modal-title", id: this.props.modalType + "ModalAria" },
                Chart.capitalize(this.props.modalType)
              )
            ),
            React.createElement(
              "div",
              { className: "modal-body" },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  null,
                  "Username: ",
                  React.createElement("input", { type: "text", name: "username", onChange: function onChange(event) {
                      _this4.usernameChangeHandler(event);
                    } })
                )
              ),
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  null,
                  "Password: ",
                  React.createElement("input", { type: "text", name: "password", onChange: function onChange(event) {
                      _this4.passwordChangeHandler(event);
                    } })
                )
              )
            ),
            React.createElement(
              "div",
              { className: "modal-footer" },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "button",
                  { name: "close", onClick: function onClick() {
                      return _this4.close();
                    } },
                  "Close"
                ),
                React.createElement("div", { className: "buttonSpacingDiv" }),
                requestButtonJsx
              ),
              React.createElement(
                "div",
                null,
                this.state.warningMessage
              )
            )
          )
        )
      );
    }
  }]);

  return LoginRegisterModal;
}(React.Component);

//props: webVersion, contactInfo, baseUrl, viewerType, loggedIn, logout(), openLoginPrompt()


var ChartName = function (_React$Component3) {
  _inherits(ChartName, _React$Component3);

  function ChartName() {
    _classCallCheck(this, ChartName);

    return _possibleConstructorReturn(this, (ChartName.__proto__ || Object.getPrototypeOf(ChartName)).apply(this, arguments));
  }

  _createClass(ChartName, [{
    key: "render",
    value: function render() {
      var _this6 = this;

      var buttonA;
      var buttonB;

      if (this.props.viewerType == "visitor") {
        if (this.props.loggedIn) {
          buttonA = '';
          buttonB = React.createElement(
            "button",
            { onClick: function onClick() {
                window.location.href = window.location.protocol + '//' + window.location.host;
              } },
            "Your\xA0Page"
          );
        } else {
          buttonA = React.createElement(
            "button",
            { onClick: function onClick() {
                window.location.href = window.location.protocol + '//' + window.location.host;
              } },
            "New\xA0Chart"
          );
          buttonB = React.createElement(
            "button",
            { onClick: function onClick() {
                _this6.props.openLoginPrompt();
              } },
            "Login"
          );
        }
      } else if (this.props.viewerType == "owner") {
        if (this.props.loggedIn) {
          buttonB = React.createElement(
            "button",
            { onClick: function onClick() {
                _this6.props.logout();
              } },
            "Logout"
          );
        } else {
          buttonB = React.createElement(
            "button",
            { onClick: function onClick() {
                _this6.props.openLoginPrompt();
              } },
            "Login"
          );
        }
        buttonA = '';
      }

      var buttons = [];
      if (buttonA != '') {
        buttons.push(buttonA);
      }
      if (buttonA != '' && buttonB != '') {
        buttons.push(React.createElement("div", { className: "buttonSpacingDiv" }));
      }
      if (buttonB != '') {
        buttons.push(buttonB);
      }

      return React.createElement(
        "div",
        { className: "chartName" },
        React.createElement(
          "div",
          { className: "titleText" },
          React.createElement(
            "table",
            null,
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { rowSpan: "2", className: "theTd" },
                  React.createElement(
                    "h1",
                    null,
                    "The"
                  )
                ),
                React.createElement(
                  "td",
                  { className: "ultimateTd" },
                  React.createElement(
                    "h2",
                    null,
                    "Ultimate"
                  )
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { className: "infographTd" },
                  React.createElement(
                    "h2",
                    null,
                    "QT Infograph"
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "otherInfo" },
          React.createElement(
            "table",
            null,
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { className: "webVersionTd" },
                  "Site Version:\xA0"
                ),
                React.createElement(
                  "td",
                  { className: "versionNumber" },
                  this.props.webVersion
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { className: "contactInfoTd" },
                  "Contact:\xA0"
                ),
                React.createElement(
                  "td",
                  { className: "contactInfo" },
                  this.props.contactInfo
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { colSpan: 2 },
                  React.createElement("div", { style: { height: 5 } })
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  { className: "buttonTd", colSpan: 2 },
                  React.createElement(
                    "div",
                    { className: "cornerButtons" },
                    buttons
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return ChartName;
}(React.Component);

var Target = function (_React$Component4) {
  _inherits(Target, _React$Component4);

  function Target(props) {
    _classCallCheck(this, Target);

    var _this7 = _possibleConstructorReturn(this, (Target.__proto__ || Object.getPrototypeOf(Target)).call(this, props));

    _this7.json = {};
    _this7.json[_this7.props.targetName.toLowerCase()] = {};

    _this7.retrieve = _this7.retrieve.bind(_this7);

    if (_this7.props.targetName.toLowerCase() != "you" && _this7.props.targetName.toLowerCase() != "them") {
      throw "Target must be either \'You\' or \'Them\', received: " + _this7.props.targetName;
    }
    return _this7;
  }

  _createClass(Target, [{
    key: "getLoadedJsonForChild",
    value: function getLoadedJsonForChild(categoryName) {
      //console.log(this.props.loadedJson);
      if (this.props.targetName.toLowerCase() in this.props.loadedJson) {
        if (categoryName.toLowerCase() in this.props.loadedJson[this.props.targetName.toLowerCase()]) {
          var jsonWithId = {};
          jsonWithId[categoryName.toLowerCase()] = this.props.loadedJson[this.props.targetName.toLowerCase()][categoryName.toLowerCase()];
          jsonWithId["id"] = this.props.loadedJson["id"];
          //console.log(jsonWithId);
          return jsonWithId;
        } else {
          return {};
        }
      } else {
        return {};
      }
    }
  }, {
    key: "retrieve",
    value: function retrieve(childJson) {
      for (var firstName in childJson) {
        this.json[this.props.targetName.toLowerCase()][firstName] = childJson[firstName];
      }
      this.props.retrieve(this.json);
    }
  }, {
    key: "render",
    value: function render() {
      var onlyInYouCategory = ['More Information'];
      var unfilteredElementMapByCategoryByType = { 'Physical': {}, 'Emotional': {}, 'Beliefs': {}, 'Other': {}, 'More Information': {} }; //TODO: category names should be available globally

      //filter out categories not applicable to this target
      var elementMapByCategoryByType = {};
      for (var categoryNameTmp in unfilteredElementMapByCategoryByType) {
        if (this.props.targetName.toLowerCase() == "you" || !onlyInYouCategory.includes(categoryNameTmp)) {
          elementMapByCategoryByType[categoryNameTmp] = {};
        }
      }

      for (var elementType in this.props.categoryElementMap) {
        for (var categoryName in this.props.categoryElementMap[elementType]) {
          if (this.props.targetName.toLowerCase() == "you" || !onlyInYouCategory.includes(categoryName)) {
            elementMapByCategoryByType[categoryName][elementType] = this.props.categoryElementMap[elementType][categoryName];
          }
        }
      }

      var categories = [];
      for (var finalCategoryName in elementMapByCategoryByType) {
        categories.push(React.createElement(Category, { key: finalCategoryName, targetName: this.props.targetName, categoryName: finalCategoryName, elementMap: elementMapByCategoryByType[finalCategoryName], retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(finalCategoryName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      var targetTitle = React.createElement(
        "h2",
        null,
        React.createElement(
          "b",
          null,
          this.props.targetName
        )
      );
      if (this.props.targetName.toLowerCase() == "you" && this.props.username != '') {
        targetTitle = React.createElement(
          "h2",
          null,
          React.createElement(
            "b",
            null,
            this.props.targetName + ': '
          ),
          '(' + this.props.username + ')'
        );
      }

      return React.createElement(
        "div",
        { className: "target" },
        React.createElement(
          "div",
          { className: "targetName" },
          targetTitle
        ),
        React.createElement(
          "div",
          { className: "targetBody" },
          categories
        )
      );
    }
  }]);

  return Target;
}(React.Component);

var Category = function (_React$Component5) {
  _inherits(Category, _React$Component5);

  function Category(props) {
    _classCallCheck(this, Category);

    var _this8 = _possibleConstructorReturn(this, (Category.__proto__ || Object.getPrototypeOf(Category)).call(this, props));

    _this8.json = {};
    _this8.json[_this8.props.categoryName.toLowerCase()] = {};

    _this8.retrieve = _this8.retrieve.bind(_this8);

    _this8.detailsOpen = true;
    _this8.categoryDetailsManipulable = true;
    return _this8;
  }

  _createClass(Category, [{
    key: "getLoadedJsonForChild",
    value: function getLoadedJsonForChild(elementName) {
      //console.log(this.props.loadedJson);
      if (this.props.categoryName.toLowerCase() in this.props.loadedJson) {
        if (elementName.toLowerCase() in this.props.loadedJson[this.props.categoryName.toLowerCase()]) {
          var jsonWithId = {};
          jsonWithId[elementName.toLowerCase()] = JSON.parse(JSON.stringify(this.props.loadedJson))[this.props.categoryName.toLowerCase()][elementName.toLowerCase()];
          jsonWithId["id"] = this.props.loadedJson["id"];
          return jsonWithId;
        } else {
          return {};
        }
      } else {
        return {};
      }
    }
  }, {
    key: "retrieve",
    value: function retrieve(childJson) {
      for (var firstName in childJson) {
        this.json[this.props.categoryName.toLowerCase()][firstName] = childJson[firstName];
      }
      this.props.retrieve(this.json);
    }
  }, {
    key: "nothingSelected",
    value: function nothingSelected() {
      //returns true immediately on page load
      if (this.loadedJson == {}) {
        for (var categoryName in this.json) {
          for (var elementName in this.json[categoryName]) {
            for (var subelementName in this.json[categoryName][elementName]) {
              if (this.json[categoryName][elementName][subelementName] != 'none') {
                return false;
              }
            }
          }
        }
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "handleCategoryDetailsOpen",
    value: function handleCategoryDetailsOpen(event) {
      if (this.categoryDetailsManipulable) {
        return true;
      } else {
        event.preventDefault();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;

      if (this.props.emptyElementsHidden && this.nothingSelected()) {
        this.categoryDetailsManipulable = false;
        this.detailsOpen = false;

        //TODO: VERY ugly hack PLS FIX. React refuses to close details tags otherwise.
        var details = Array.from(document.querySelectorAll("details"));
        for (var detailIndex in details) {
          if (details[detailIndex].name == this.props.categoryName.toLowerCase()) {
            details[onlyDetailIndex].removeAttribute("open");
          }
        }
      } else {
        this.categoryDetailsManipulable = true;
        this.detailsOpen = true; //TODO: should depend on whether the details was previously open
      }

      //TODO: Really ugly and verbose. See if there's not a way to fix this.
      var singleColorYouElements = [];
      for (var numericalSelectBarName in this.props.elementMap['numericalSelectBars']) {
        var properties = this.props.elementMap['numericalSelectBars'][numericalSelectBarName];
        singleColorYouElements.push(React.createElement(NumericalSelectBar, { key: numericalSelectBarName, name: numericalSelectBarName, youOrThem: this.props.targetName, maxPossible: properties.max, minPossible: properties.min, numCells: properties.numCells, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(numericalSelectBarName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      for (var singleColorYouCheckboxSetName in this.props.elementMap['singleColorYouCheckboxSets']) {
        var _properties = this.props.elementMap['singleColorYouCheckboxSets'][singleColorYouCheckboxSetName];
        singleColorYouElements.push(React.createElement(SingleColorYouCheckboxSet, { key: singleColorYouCheckboxSetName, name: singleColorYouCheckboxSetName, youOrThem: this.props.targetName, possibleOptions: _properties, parentIsCategory: true, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(singleColorYouCheckboxSetName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      for (var fuzzySelectBarName in this.props.elementMap['fuzzySelectBars']) {
        var _properties2 = this.props.elementMap['fuzzySelectBars'][fuzzySelectBarName];
        singleColorYouElements.push(React.createElement(FuzzySelectBar, { key: fuzzySelectBarName, name: fuzzySelectBarName, youOrThem: this.props.targetName, numCells: _properties2.numCells, leftmostOption: _properties2.left, rightmostOption: _properties2.right, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(fuzzySelectBarName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      for (var booleanSelectBarIndex in this.props.elementMap['booleanSelectBars']) {
        singleColorYouElements.push(React.createElement(BooleanSelectBar, { key: booleanSelectBarIndex, name: this.props.elementMap['booleanSelectBars'][booleanSelectBarIndex], youOrThem: this.props.targetName, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(this.props.elementMap['booleanSelectBars'][booleanSelectBarIndex]), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      for (var singleColorYou2DCheckboxSetName in this.props.elementMap['singleColorYou2DCheckboxSets']) {
        var _properties3 = this.props.elementMap['singleColorYou2DCheckboxSets'][singleColorYou2DCheckboxSetName];
        singleColorYouElements.push(React.createElement(SingleColorYou2DCheckboxSet, { key: singleColorYou2DCheckboxSetName, name: singleColorYou2DCheckboxSetName, youOrThem: this.props.targetName, cellDimensions: _properties3.cellDimensions, top: _properties3.top, bottom: _properties3.bottom, left: _properties3.left, right: _properties3.right, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(singleColorYou2DCheckboxSetName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      var wrappedSingleColorYouElements = Category.fillGrid(singleColorYouElements);

      var bulletListElements = [];
      for (var singleBulletListIndex in this.props.elementMap['singleBulletLists']) {
        var name = this.props.elementMap['singleBulletLists'][singleBulletListIndex];
        bulletListElements.push(React.createElement(SingleBulletList, { name: name, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(name), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      for (var bulletListName in this.props.elementMap['bulletLists']) {
        var _properties4 = this.props.elementMap['bulletLists'][bulletListName];
        bulletListElements.push(React.createElement(BulletList, { name: bulletListName, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(bulletListName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden, maxBullets: _properties4['maxBullets'], singleBulletList: false }));
      }

      var wrappedBulletListElements = Category.fillGrid(bulletListElements);

      var multicolorYouElements = [];
      for (var multicolorCheckboxSetName in this.props.elementMap['multicolorCheckboxSets']) {
        var labels = this.props.elementMap['multicolorCheckboxSets'][multicolorCheckboxSetName];
        multicolorYouElements.push(React.createElement(MulticolorCheckboxSet, { key: multicolorCheckboxSetName, targetName: this.props.targetName, categoryName: this.props.categoryName, name: multicolorCheckboxSetName, labels: labels, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(multicolorCheckboxSetName), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden })); //TODO: change this when MulticolorCheckboxSet becomes an Element subclass
      }

      var nameContents = React.createElement(
        "summary",
        { className: "categoryName" },
        this.props.categoryName
      );

      var bodyContents = React.createElement(
        "div",
        { className: "categoryBody" },
        wrappedBulletListElements,
        wrappedSingleColorYouElements,
        multicolorYouElements
      );

      return React.createElement(
        "details",
        { className: "category", open: this.detailsOpen, onClick: function onClick(event) {
            _this9.handleCategoryDetailsOpen(event);
          }, name: this.props.categoryName.toLowerCase() },
        nameContents,
        bodyContents
      );
    }
  }], [{
    key: "fillGrid",
    value: function fillGrid(elements) {
      var row = this.fillRow(elements);

      return React.createElement(
        "div",
        { className: "multicolorCheckboxes" },
        React.createElement(
          ReactBootstrap.Grid,
          { fluid: true },
          row
        )
      );
    }
  }, {
    key: "fillRow",
    value: function fillRow(rowElements) {
      return React.createElement(
        ReactBootstrap.Row,
        null,
        rowElements
      );
    }
  }, {
    key: "fillColumn",
    value: function fillColumn(element, identifier, hidden) {
      var displayStyle = 'inline-block';
      if (hidden) {
        displayStyle = 'none';
      }

      if ((typeof element === "undefined" ? "undefined" : _typeof(element)) !== undefined) {
        //TODO: figure out if this is necessary
        return React.createElement(
          "div",
          { key: 'element-' + identifier, className: "col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2", style: { display: displayStyle } },
          element
        );
      }
    }
  }]);

  return Category;
}(React.Component);

var MulticolorCheckboxSet = function (_React$Component6) {
  _inherits(MulticolorCheckboxSet, _React$Component6);

  function MulticolorCheckboxSet(props) {
    _classCallCheck(this, MulticolorCheckboxSet);

    var _this10 = _possibleConstructorReturn(this, (MulticolorCheckboxSet.__proto__ || Object.getPrototypeOf(MulticolorCheckboxSet)).call(this, props));

    _this10.json = {};
    _this10.json[_this10.props.name.toLowerCase()] = {};

    _this10.retrieve = _this10.retrieve.bind(_this10);
    return _this10;
  }

  _createClass(MulticolorCheckboxSet, [{
    key: "getLoadedJsonForChild",
    value: function getLoadedJsonForChild(checkboxName) {
      //console.log(this.props.loadedJson);
      if (this.props.name.toLowerCase() in this.props.loadedJson) {
        if (checkboxName.toLowerCase() in this.props.loadedJson[this.props.name.toLowerCase()]) {
          var jsonWithId = {};
          jsonWithId["id"] = this.props.loadedJson["id"];
          jsonWithId[checkboxName.toLowerCase()] = this.props.loadedJson[this.props.name.toLowerCase()][checkboxName.toLowerCase()];
          //console.log(jsonWithId);
          return jsonWithId;
        } else {
          return {};
        }
      } else {
        return {};
      }
    }
  }, {
    key: "retrieve",
    value: function retrieve(childJson) {
      for (var firstLabel in childJson) {
        this.json[this.props.name.toLowerCase()][firstLabel] = childJson[firstLabel];
      }
      this.props.retrieve(this.json);
    }
  }, {
    key: "nothingSelected",
    value: function nothingSelected() {
      //returns true immediately on page load
      //console.log(this.json);
      for (var setName in this.json) {
        for (var checkboxName in this.json[setName]) {
          if (this.json[setName][checkboxName] != 'none') {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "getCheckboxes",
    value: function getCheckboxes() {
      this.props.labels.sort();

      var checkboxes = [];
      for (var i = 0; i < this.props.labels.length; i++) {
        checkboxes.push(React.createElement(MulticolorCheckbox, { key: this.props.labels[i], targetName: this.props.targetName, categoryName: this.props.categoryName, name: this.props.name, label: this.props.labels[i], pickOneIfYou: false, retrieve: this.retrieve, loadedJson: this.getLoadedJsonForChild(this.props.labels[i]), interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden }));
      }

      return checkboxes;
    }
  }, {
    key: "render",
    value: function render() {
      var checkboxes = this.getCheckboxes();
      var gridCheckboxes = Category.fillGrid(checkboxes);

      var displayStyle = 'block';
      if (this.props.emptyElementsHidden && this.nothingSelected()) {
        displayStyle = 'none';
      }

      return React.createElement(
        "div",
        { className: "multicolorCheckboxSet" },
        React.createElement(
          ReactBootstrap.Grid,
          { fluid: true },
          React.createElement(
            ReactBootstrap.Row,
            null,
            React.createElement(
              ReactBootstrap.Col,
              { lg: 12 },
              React.createElement(
                "label",
                { className: "multicolorCheckboxSetName", style: { display: displayStyle } },
                this.props.name
              )
            )
          )
        ),
        gridCheckboxes
      );
    }
  }], [{
    key: "numColsXSmall",
    get: function get() {
      return 1;
    }
  }, {
    key: "numColsSmall",
    get: function get() {
      return 3;
    }
  }, {
    key: "numColsMedium",
    get: function get() {
      return 4;
    }
  }, {
    key: "numColsLarge",
    get: function get() {
      return 6;
    }
  }]);

  return MulticolorCheckboxSet;
}(React.Component);

var MulticolorCheckbox = function (_React$Component7) {
  _inherits(MulticolorCheckbox, _React$Component7);

  _createClass(MulticolorCheckbox, null, [{
    key: "colorNames",
    value: function colorNames(index) {
      return ['red', 'orange', 'yellow', 'green', 'blue', 'pink'][index];
    }
  }, {
    key: "youMulticolorLabels",
    get: function get() {
      return ['Very Poorly', 'Poorly', 'Fairly Well', 'Accurately', 'Very Accurately'];
    }
  }, {
    key: "themMulticolorLabels",
    get: function get() {
      return ['Awful', 'Bad', 'Acceptable', 'Good', 'Very Good', 'Perfect'];
    }
  }]);

  function MulticolorCheckbox(props) {
    _classCallCheck(this, MulticolorCheckbox);

    var _this11 = _possibleConstructorReturn(this, (MulticolorCheckbox.__proto__ || Object.getPrototypeOf(MulticolorCheckbox)).call(this, props));

    _this11.makeSelection = _this11.makeSelection.bind(_this11); //ensure callbacks have the proper context
    _this11.reset = _this11.reset.bind(_this11);

    var descriptors = [];
    var footerInitial;
    var footer;
    if (_this11.props.targetName.toLowerCase() == 'you' && !_this11.props.pickOneIfYou || _this11.props.targetName.toLowerCase() == 'them') {
      if (_this11.props.targetName.toLowerCase() == 'you') {
        //present all colors except pink
        _this11.defaultFooter = 'How well does this describe you?';
        descriptors = MulticolorCheckbox.youMulticolorLabels;
        footerInitial = 'This describes me';
      } else {
        //present all colors including pink
        _this11.defaultFooter = 'How important is this in others?';
        descriptors = MulticolorCheckbox.themMulticolorLabels;
        footerInitial = 'I consider this';
      }
      footer = _this11.defaultFooter;
    } else {
      throw "Multicolor checkboxes cannot be \'pick one\'.";
    }

    var childColors = [];
    for (var i = 0; i < descriptors.length; i++) {
      childColors[i] = MulticolorCheckbox.colorNames(i);
    }

    _this11.loadedJsonKey = '';

    _this11.state = {
      footerInitial: footerInitial,
      footer: footer,
      descriptors: descriptors,
      childColors: childColors
    };
    return _this11;
  }

  //TODO: should not be dependent on the color of the selected cell; add state


  _createClass(MulticolorCheckbox, [{
    key: "toJson",
    value: function toJson() {
      //search childcolors for the black cell
      var colorScoreWithLabel = {};
      for (var i = 0; i < this.state.childColors.length; i++) {
        if (this.state.childColors[i] == 'black') {
          colorScoreWithLabel[this.props.label.toLowerCase()] = i;
          return colorScoreWithLabel;
        }
      }
      colorScoreWithLabel[this.props.label.toLowerCase()] = 'none';
      return colorScoreWithLabel;
    }
  }, {
    key: "makeSelection",
    value: function makeSelection(index) {
      if (!this.props.interactionFrozen) {
        var childColorsTmp = []; //reset the other checkbox choices' colors, and change the color of the new selection
        for (var i = 0; i < this.state.childColors.length; i++) {
          childColorsTmp[i] = MulticolorCheckbox.colorNames(i);
        }
        childColorsTmp[index] = 'black';
        this.setState({ footer: this.state.footerInitial + ' ' + this.state.descriptors[index].toLowerCase() + '.', childColors: childColorsTmp });
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      if (!this.props.interactionFroze) {
        var childColorsTmp = [];
        for (var i = 0; i < this.state.childColors.length; i++) {
          childColorsTmp[i] = MulticolorCheckbox.colorNames(i);
        }
        this.setState({ footer: this.defaultFooter, childColors: childColorsTmp });
      }
    }
  }, {
    key: "getCheckboxChoiceColor",
    value: function getCheckboxChoiceColor(index) {
      if (this.props.loadedJson === 'none' || this.props.loadedJson === '') {
        return MulticolorCheckbox.colorNames(index);
      } else {
        return MulticolorCheckbox.colorNames(this.props.loadedJson);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {

      //if fresh loadedJson is on its way, clear the old contents and replace with the new
      if (nextProps.loadedJson['id'] != this.props.loadedJson['id']) {
        var newColors = [];
        for (var i = 0; i < this.state.childColors.length; i++) {
          newColors[i] = MulticolorCheckbox.colorNames(i);
        }

        if (nextProps.loadedJson[nextProps.label.toLowerCase()] != 'none') {
          newColors[nextProps.loadedJson[nextProps.label.toLowerCase()]] = 'black';
        }

        //console.log(nextProps.label.toLowerCase());
        //console.log(newColors);

        this.setState({ childColors: newColors });
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.props.retrieve(this.toJson());

      var hidden = false;
      if (this.props.emptyElementsHidden && this.toJson()[Object.keys(this.toJson())[0]] == 'none') {
        hidden = true;
      }

      var footerDisplayStyle = 'block';
      if (this.props.interactionFrozen && this.toJson()[Object.keys(this.toJson())[0]] == 'none') {
        //retain flavor text if a selection has been made
        footerDisplayStyle = 'none';
      }

      var choices = [];
      var percentWidth = 100 / this.state.descriptors.length;
      for (var i = 0; i < this.state.descriptors.length; i++) {
        var side;
        var text;
        if (i === 0) {
          side = 'left';
          text = '-';
        } else if (i == this.state.descriptors.length - 1) {
          side = 'right';
          text = '+';
        } else {
          side = 'middle';
          text = '';
        }

        var color = this.state.childColors[i];
        //console.log(this.props.loadedJson['id']);
        //console.log(this.props.loadedJson[this.props.label.toLowerCase()]);
        //console.log(this.loadedJsonKey);
        if (this.props.loadedJson['id'] != this.loadedJsonKey) {
          if (this.props.loadedJson[this.props.label.toLowerCase()] == i) {
            color = 'black';
            this.loadedJsonKey = this.props.loadedJson['id'];
          }
        }

        choices.push(React.createElement(CheckboxChoice, { key: MulticolorCheckbox.colorNames(i), targetName: this.props.targetName, categoryName: this.props.categoryName, name: this.props.name, label: this.props.label, side: side, colorName: color, text: text, value: i, onClick: this.makeSelection, percentWidth: percentWidth, textHidden: true, hoverText: this.state.descriptors[i], interactionFrozen: this.props.interactionFrozen }));
      }

      //TODO: the extra line breaks here are a hideous kludge
      var contents = React.createElement(
        "div",
        { className: "multicolorCheckbox" },
        React.createElement(ElementName, { name: this.props.label, optionalNotice: false, interactionFrozen: this.props.interactionFrozen, reset: this.reset, resetType: "undo" }),
        choices,
        React.createElement(
          "span",
          { className: "multicolorCheckboxFooter", style: { display: footerDisplayStyle } },
          this.state.footer
        )
      );

      return Category.fillColumn(contents, this.props.label, hidden);
    }
  }]);

  return MulticolorCheckbox;
}(React.Component);

var CheckboxChoice = function (_React$Component8) {
  _inherits(CheckboxChoice, _React$Component8);

  function CheckboxChoice() {
    _classCallCheck(this, CheckboxChoice);

    return _possibleConstructorReturn(this, (CheckboxChoice.__proto__ || Object.getPrototypeOf(CheckboxChoice)).apply(this, arguments));
  }

  _createClass(CheckboxChoice, [{
    key: "render",
    value: function render() {
      var _this13 = this;

      var extraClasses = 'hoverable';
      if (this.props.interactionFrozen) {
        extraClasses = 'notHoverable';
      }

      return (//TODO: figure out how to add multiple optional classes
        React.createElement(
          "label",
          { className: 'checkboxChoice' + ' ' + this.props.colorName + ' ' + this.props.side + ' ' + extraClasses, style: { width: this.props.percentWidth + "%" }, title: this.props.hoverText },
          React.createElement("input", { type: "radio", value: this.props.value, onClick: function onClick() {
              return _this13.props.onClick(_this13.props.value);
            } }),
          React.createElement(
            "span",
            null,
            this.props.text
          )
        )
      );
    }
  }]);

  return CheckboxChoice;
}(React.Component);

//props: color, position, text


var ColorSelectChoice = function (_React$Component9) {
  _inherits(ColorSelectChoice, _React$Component9);

  function ColorSelectChoice() {
    _classCallCheck(this, ColorSelectChoice);

    return _possibleConstructorReturn(this, (ColorSelectChoice.__proto__ || Object.getPrototypeOf(ColorSelectChoice)).apply(this, arguments));
  }

  _createClass(ColorSelectChoice, [{
    key: "render",
    value: function render() {
      var _this15 = this;

      var activeBorder = '';
      if (this.props.activeBorder) {
        activeBorder = 'activeBorder';
      }

      return React.createElement(
        "label",
        { className: 'colorSelectChoice ' + this.props.color + ' ' + this.props.position + ' ' + activeBorder, title: this.props.hoverText },
        React.createElement("input", { type: "radio", onClick: function onClick() {
            _this15.props.onClick[0](_this15.props.color);_this15.props.onClick[1](_this15.props.color);
          } }),
        React.createElement(
          "span",
          null,
          this.props.text
        )
      );
    }
  }]);

  return ColorSelectChoice;
}(React.Component);

//props: onClick


var ColorSelectBar = function (_React$Component10) {
  _inherits(ColorSelectBar, _React$Component10);

  _createClass(ColorSelectBar, null, [{
    key: "scoreFromColor",
    value: function scoreFromColor(color) {
      for (var i = 0; i < ColorSelectBar.colors.length; i++) {
        if (color == ColorSelectBar.colors[i]) {
          return i;
        }
      }

      return 'none';
    }
  }, {
    key: "colorFromScore",
    value: function colorFromScore(score) {
      if (score == "none") {
        return "white";
      } else {
        return ColorSelectBar.colors[score];
      }
    }
  }, {
    key: "colors",
    get: function get() {
      return ['red', 'orange', 'yellow', 'green', 'blue', 'pink'];
    }
  }, {
    key: "themLabels",
    get: function get() {
      return ['Awful', 'Bad', 'Acceptable', 'Good', 'Very Good', 'Perfect'];
    }
  }]);

  function ColorSelectBar(props) {
    _classCallCheck(this, ColorSelectBar);

    var _this16 = _possibleConstructorReturn(this, (ColorSelectBar.__proto__ || Object.getPrototypeOf(ColorSelectBar)).call(this, props));

    _this16.frameColorSelection = _this16.frameColorSelection.bind(_this16);

    _this16.state = {
      selectedColor: 'none'
    };
    return _this16;
  }

  _createClass(ColorSelectBar, [{
    key: "frameColorSelection",
    value: function frameColorSelection(color) {
      if (!this.props.interactionFrozen) {
        this.setState({ selectedColor: color });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var displayStyle = 'block';
      if (this.props.interactionFrozen) {
        displayStyle = 'none';
      }

      var hasActiveBorder;
      var colorSelectChoices = [];
      for (var i = 0; i < ColorSelectBar.colors.length; i++) {
        var position = void 0;
        var text = void 0;

        if (i === 0) {
          position = 'left';
          text = '-';
        } else if (i == ColorSelectBar.colors.length - 1) {
          position = 'right';
          text = '+';
        } else {
          position = 'middle';
          text = '';
        }

        if (ColorSelectBar.colors[i] == this.state.selectedColor) {
          hasActiveBorder = true;
        } else {
          hasActiveBorder = false;
        }

        colorSelectChoices.push(React.createElement(ColorSelectChoice, { key: ColorSelectBar.colors[i], color: ColorSelectBar.colors[i], activeBorder: hasActiveBorder, position: position, text: text, hoverText: ColorSelectBar.themLabels[i], onClick: [this.props.onClick, this.frameColorSelection] }));
      }

      return React.createElement(
        "div",
        { className: "colorSelectBox", style: { display: displayStyle } },
        colorSelectChoices
      );
    }
  }]);

  return ColorSelectBar;
}(React.Component);

//props: label, color, position, onClick, index


var CheckboxSelectChoice = function (_React$Component11) {
  _inherits(CheckboxSelectChoice, _React$Component11);

  function CheckboxSelectChoice() {
    _classCallCheck(this, CheckboxSelectChoice);

    return _possibleConstructorReturn(this, (CheckboxSelectChoice.__proto__ || Object.getPrototypeOf(CheckboxSelectChoice)).apply(this, arguments));
  }

  _createClass(CheckboxSelectChoice, [{
    key: "render",
    value: function render() {
      var _this18 = this;

      var extraClasses = 'hoverable';
      if (this.props.interactionFrozen) {
        extraClasses = 'notHoverable';
      }

      return React.createElement(
        "div",
        { className: 'checkboxSelectChoice ' + this.props.color + ' ' + this.props.position + ' ' + extraClasses, onClick: function onClick() {
            return _this18.props.onClick(_this18.props.index);
          } },
        React.createElement(
          "span",
          null,
          this.props.label
        )
      );
    }
  }]);

  return CheckboxSelectChoice;
}(React.Component);

//props: possibleOptions, colors


var CheckboxSelectBox = function (_React$Component12) {
  _inherits(CheckboxSelectBox, _React$Component12);

  function CheckboxSelectBox() {
    _classCallCheck(this, CheckboxSelectBox);

    return _possibleConstructorReturn(this, (CheckboxSelectBox.__proto__ || Object.getPrototypeOf(CheckboxSelectBox)).apply(this, arguments));
  }

  _createClass(CheckboxSelectBox, [{
    key: "render",
    value: function render() {
      var selectChoices = [];
      var position;
      for (var i = 0; i < this.props.possibleOptions.length; i++) {
        if (i === 0) {
          position = 'top';
        } else if (i == this.props.possibleOptions.length - 1) {
          position = 'bottom';
        } else {
          position = 'middle';
        }

        selectChoices.push(React.createElement(CheckboxSelectChoice, { key: this.props.possibleOptions[i], label: this.props.possibleOptions[i], color: this.props.colors[i], position: position, index: i, onClick: this.props.onClick, interactionFrozen: this.props.interactionFrozen }));
      }

      return React.createElement(
        "div",
        { className: "checkboxSelectBox" },
        selectChoices
      );
    }
  }]);

  return CheckboxSelectBox;
}(React.Component);

//props: youOrThem


var SingleColorYouControlsText = function (_React$Component13) {
  _inherits(SingleColorYouControlsText, _React$Component13);

  function SingleColorYouControlsText() {
    _classCallCheck(this, SingleColorYouControlsText);

    return _possibleConstructorReturn(this, (SingleColorYouControlsText.__proto__ || Object.getPrototypeOf(SingleColorYouControlsText)).apply(this, arguments));
  }

  _createClass(SingleColorYouControlsText, [{
    key: "render",
    value: function render() {
      var displayStyle = 'block';
      if (this.props.isHidden) {
        displayStyle = 'none';
      }

      if (this.props.youOrThem.toLowerCase() == "you") {
        return React.createElement(
          "div",
          { className: "controlText", style: { display: displayStyle } },
          React.createElement(
            "span",
            { className: "middleControlText" },
            "Choose one \u2191"
          ),
          React.createElement("br", null)
        );
      } else {
        return React.createElement(
          "div",
          { className: "controlText", style: { display: displayStyle } },
          React.createElement(
            "span",
            { className: "leftControlText" },
            "\u2193 Pick"
          ),
          React.createElement(
            "span",
            { className: "rightControlText" },
            "Click \u2191"
          ),
          React.createElement("br", null)
        );
      }
    }
  }]);

  return SingleColorYouControlsText;
}(React.Component);

//props: name, interactionFrozen, reset (callback)


var ElementName = function (_React$Component14) {
  _inherits(ElementName, _React$Component14);

  function ElementName() {
    _classCallCheck(this, ElementName);

    return _possibleConstructorReturn(this, (ElementName.__proto__ || Object.getPrototypeOf(ElementName)).apply(this, arguments));
  }

  _createClass(ElementName, [{
    key: "render",
    value: function render() {
      var title = "Mandatory for chart image generation";
      var text = this.props.name + ':';
      if (this.props.optionalNotice) {
        title = "Optional for chart image generation";

        if (!this.props.interactionFrozen) {
          text = this.props.name + '* :';
        }
      }

      if (this.props.interactionFrozen) {
        title = '';
      }

      return React.createElement(
        "div",
        null,
        React.createElement(
          "label",
          { className: "elementName" },
          React.createElement(
            "span",
            { title: title },
            React.createElement(
              "b",
              null,
              text
            )
          )
        ),
        React.createElement(ResetButton, { resetType: this.props.resetType, reset: this.props.reset, interactionFrozen: this.props.interactionFrozen })
      );
    }
  }]);

  return ElementName;
}(React.Component);

//props: interactionFrozen, reset (callback)


var ResetButton = function (_React$Component15) {
  _inherits(ResetButton, _React$Component15);

  function ResetButton() {
    _classCallCheck(this, ResetButton);

    return _possibleConstructorReturn(this, (ResetButton.__proto__ || Object.getPrototypeOf(ResetButton)).apply(this, arguments));
  }

  _createClass(ResetButton, [{
    key: "render",
    value: function render() {
      var _this23 = this;

      var displayStyle = 'inline-block';
      if (this.props.interactionFrozen) {
        displayStyle = 'none';
      }

      //TODO: resetButton currently uses a bomb as its icon for 'full resets'-- will probably switch to something else
      //the standard undo symbol doesn't really fit the concept of the 'full reset', which can be interpreted as multiple undo actions
      var title;
      var iconCharacter;
      if (this.props.resetType == "undo") {
        title = "Reset";
        iconCharacter = '⟲';
      } else if (this.props.resetType == "reset") {
        title = "Reset All";
        iconCharacter = '💣';
      }

      return React.createElement(
        "button",
        { type: "button", name: "reset", className: "resetButton", style: { display: displayStyle }, onClick: function onClick() {
            _this23.props.reset();
          }, title: title },
        iconCharacter
      );
    }
  }]);

  return ResetButton;
}(React.Component);

//props: name, youOrThem, cellDimensions, top, bottom, left, right, retrieve


var SingleColorYou2DCheckboxSet = function (_React$Component16) {
  _inherits(SingleColorYou2DCheckboxSet, _React$Component16);

  function SingleColorYou2DCheckboxSet(props) {
    _classCallCheck(this, SingleColorYou2DCheckboxSet);

    var _this24 = _possibleConstructorReturn(this, (SingleColorYou2DCheckboxSet.__proto__ || Object.getPrototypeOf(SingleColorYou2DCheckboxSet)).call(this, props));

    _this24.setActiveColor = _this24.setActiveColor.bind(_this24);
    _this24.getActiveColor = _this24.getActiveColor.bind(_this24);

    _this24.reset = _this24.reset.bind(_this24);

    if (_this24.props.youOrThem.toLowerCase() == "you") {
      _this24.activeColor = 'green';
    } else {
      _this24.activeColor = 'white';
    }

    _this24.optionColors = [];
    for (var j = 0; j < _this24.props.cellDimensions; j++) {
      _this24.optionColors[j] = [];
      for (var i = 0; i < _this24.props.cellDimensions; i++) {
        _this24.optionColors[j][i] = 'white';
      }
    }

    _this24.state = {
      optionColors: _this24.optionColors
    };
    return _this24;
  }

  //TODO: should not be a dependence on 'white'


  _createClass(SingleColorYou2DCheckboxSet, [{
    key: "toJson",
    value: function toJson() {
      var colorScores = {};
      for (var j = 0; j < this.props.cellDimensions; j++) {
        for (var i = 0; i < this.props.cellDimensions; i++) {
          if (this.props.youOrThem.toLowerCase() == "them" || ColorSelectBar.scoreFromColor(this.state.optionColors[j][i]) != 'none') {
            colorScores[i + ',' + (this.props.cellDimensions - j - 1)] = ColorSelectBar.scoreFromColor(this.state.optionColors[j][i]); //need to invert rows to index from the bottom left
          }
        }
      }

      var colorScoresWithName = {};
      colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

      return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
    }
  }, {
    key: "setActiveColor",
    value: function setActiveColor(color) {
      this.activeColor = color;
    }

    //TODO: 'getActiveColor' is a bit of a misnomer, since this function also paints cells

  }, {
    key: "getActiveColor",
    value: function getActiveColor(colIndex, rowIndex) {
      if (!this.props.interactionFrozen) {
        var newOptionColors = [];
        if (this.props.youOrThem.toLowerCase() == "you") {
          for (var j = 0; j < this.props.cellDimensions; j++) {
            newOptionColors[j] = [];
            for (var i = 0; i < this.props.cellDimensions; i++) {
              if (i == colIndex && j == rowIndex) {
                newOptionColors[j][i] = 'green';
              } else {
                newOptionColors[j][i] = 'white';
              }
            }
          }
        } else {
          newOptionColors = this.state.optionColors;
          newOptionColors[rowIndex][colIndex] = this.activeColor;
        }
        this.setState({ optionColors: newOptionColors });
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      if (!this.props.interactionFrozen) {
        var newOptionColors = [];
        for (var j = 0; j < this.props.cellDimensions; j++) {
          newOptionColors[j] = [];
          for (var i = 0; i < this.props.cellDimensions; i++) {
            newOptionColors[j][i] = 'white';
          }
        }
        this.setState({ optionColors: newOptionColors });
      }
    }
  }, {
    key: "fillTableRow",
    value: function fillTableRow(rowIndex, hoverability) {
      return React.createElement(
        "tr",
        { key: rowIndex },
        this.fillTableCols(rowIndex, hoverability)
      );
    }
  }, {
    key: "fillTableCols",
    value: function fillTableCols(rowIndex, hoverability) {
      var _this25 = this;

      var rowContents = [];

      if (rowIndex === 0) {
        rowContents.push(React.createElement(
          "td",
          { key: 'left', rowSpan: this.props.cellDimensions },
          React.createElement(
            "span",
            { className: "leftVerticalText" },
            this.props.left.replace(/ /g, "\xA0")
          )
        ));
      }

      //TODO: need to add divs to the table corner cells and hide the cell borders to get rounded corners

      var _loop = function _loop(i) {
        cornerStatus = '';

        if (i === 0 && rowIndex === 0) {
          cornerStatus = 'topLeft';
        } else if (i === 0 && rowIndex === _this25.props.cellDimensions - 1) {
          cornerStatus = 'bottomLeft';
        } else if (i === _this25.props.cellDimensions - 1 && rowIndex === 0) {
          cornerStatus = 'topRight';
        } else if (i === _this25.props.cellDimensions - 1 && rowIndex === _this25.props.cellDimensions - 1) {
          cornerStatus = 'bottomRight';
        }

        rowContents.push(React.createElement(
          "td",
          { key: i },
          React.createElement(
            "div",
            { className: "visibleBorder " + _this25.state.optionColors[rowIndex][i] + ' ' + cornerStatus + ' ' + hoverability, onClick: function onClick() {
                return _this25.getActiveColor(i, rowIndex);
              } },
            "\xA0"
          )
        ));
      };

      for (var i = 0; i < this.props.cellDimensions; i++) {
        var cornerStatus;

        _loop(i);
      }

      if (rowIndex === 0) {
        rowContents.push(React.createElement(
          "td",
          { key: 'right', rowSpan: this.props.cellDimensions },
          React.createElement(
            "span",
            { className: "rightVerticalText" },
            this.props.right.replace(/ /g, "\xA0")
          )
        )); //replace spaces with non-breaking spaces
      }

      return rowContents;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {

      //if fresh loadedJson is on its way, clear the old contents and replace with the new
      if (nextProps.loadedJson['id'] != this.props.loadedJson['id']) {
        var newColors = [];
        for (var j = 0; j < this.props.cellDimensions; j++) {
          newColors[j] = [];
          for (var i = 0; i < this.props.cellDimensions; i++) {
            newColors[j][i] = 'white';
          }
        }

        for (var index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
          var trueIndices = index.split(",");
          newColors[trueIndices[0]][trueIndices[1]] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][index]);
        }

        this.setState({ optionColors: newColors });
      }
    }
  }, {
    key: "render",
    value: function render() {
      //console.log(this.props.loadedJson);
      this.props.retrieve(this.toJson());

      var hidden = false;
      if (this.props.emptyElementsHidden) {
        var json = this.toJson()[this.props.name.toLowerCase()];
        hidden = true;
        for (var index in json) {
          if (json[index] != 'none') {
            hidden = false;
            break;
          }
        }
      }

      var hoverability = 'hoverable';
      if (this.props.interactionFrozen) {
        hoverability = 'notHoverable';
      }

      var tableContentsHtml = [];

      var htmlContentsPrefix = React.createElement(
        "tr",
        { key: 'top' },
        React.createElement("td", null),
        React.createElement(
          "td",
          { colSpan: this.props.cellDimensions, className: "topText" },
          React.createElement(
            "span",
            null,
            this.props.top
          )
        ),
        React.createElement("td", null)
      );

      var htmlContentsPostfix = React.createElement(
        "tr",
        { key: 'bottom' },
        React.createElement("td", null),
        React.createElement(
          "td",
          { colSpan: this.props.cellDimensions, className: "bottomText" },
          React.createElement(
            "span",
            null,
            this.props.bottom
          )
        ),
        React.createElement("td", null)
      );

      tableContentsHtml.push(htmlContentsPrefix);
      for (var i = 0; i < this.props.cellDimensions; i++) {
        tableContentsHtml.push(this.fillTableRow(i, hoverability));
      }
      tableContentsHtml.push(htmlContentsPostfix);

      //TODO: DRY
      var contents;
      if (this.props.youOrThem.toLowerCase() == 'you') {
        contents = React.createElement(
          "div",
          { className: "multicolorCheckbox" },
          React.createElement(ElementName, { key: this.props.name + '-name', name: this.props.name, interactionFrozen: this.props.interactionFrozen, reset: this.reset, resetType: "undo" }),
          React.createElement(
            "table",
            { className: "twoDCheckbox" },
            React.createElement(
              "tbody",
              null,
              tableContentsHtml
            )
          ),
          React.createElement(SingleColorYouControlsText, { key: this.props.youOrThem + '-text', youOrThem: this.props.youOrThem, isHidden: this.props.interactionFrozen })
        );
      } else {
        contents = React.createElement(
          "div",
          { className: "multicolorCheckbox" },
          React.createElement(ElementName, { key: this.props.name + '-name', name: this.props.name, interactionFrozen: this.props.interactionFrozen, reset: this.reset, resetType: "reset" }),
          React.createElement(
            "table",
            { className: "twoDCheckbox" },
            React.createElement(
              "tbody",
              null,
              tableContentsHtml
            )
          ),
          React.createElement(SingleColorYouControlsText, { key: this.props.youOrThem + '-text', youOrThem: this.props.youOrThem, isHidden: this.props.interactionFrozen }),
          React.createElement(ColorSelectBar, { key: 'color-select-bar', onClick: this.setActiveColor, interactionFrozen: this.props.interactionFrozen })
        );
      }

      return Category.fillColumn(contents, this.props.name, hidden);
    }
  }]);

  return SingleColorYou2DCheckboxSet;
}(React.Component);

//props: name, youOrThem, possibleOptions, parentIsCategory, retrieve


var SingleColorYouCheckboxSet = function (_React$Component17) {
  _inherits(SingleColorYouCheckboxSet, _React$Component17);

  function SingleColorYouCheckboxSet(props) {
    _classCallCheck(this, SingleColorYouCheckboxSet);

    var _this26 = _possibleConstructorReturn(this, (SingleColorYouCheckboxSet.__proto__ || Object.getPrototypeOf(SingleColorYouCheckboxSet)).call(this, props));

    _this26.setActiveColor = _this26.setActiveColor.bind(_this26);
    _this26.getActiveColor = _this26.getActiveColor.bind(_this26);

    _this26.reset = _this26.reset.bind(_this26);

    if (_this26.props.youOrThem.toLowerCase() == "you") {
      _this26.activeColor = 'green';
    } else {
      _this26.activeColor = 'white';
    }

    _this26.optionColors = [];
    for (var i = 0; i < _this26.props.possibleOptions.length; i++) {
      _this26.optionColors[i] = 'white';
    }

    _this26.state = {
      optionColors: _this26.optionColors
    };
    return _this26;
  }

  _createClass(SingleColorYouCheckboxSet, [{
    key: "toDictJson",
    value: function toDictJson() {
      var colorScores = {};
      var asArray = this.toArrayJson();
      for (var index in asArray) {
        if (this.props.youOrThem.toLowerCase() == "them" || asArray[index] != 'none') {
          colorScores[this.props.possibleOptions[index].toLowerCase()] = asArray[index];
        }
      }

      var colorScoresWithName = {};
      colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

      return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
    }
  }, {
    key: "toArrayJson",
    value: function toArrayJson() {
      var colorScores = [];
      for (var i = 0; i < this.props.possibleOptions.length; i++) {
        colorScores[i] = ColorSelectBar.scoreFromColor(this.state.optionColors[i]);
      }
      return colorScores;
    }
  }, {
    key: "setActiveColor",
    value: function setActiveColor(color) {
      this.activeColor = color;
    }
  }, {
    key: "getActiveColor",
    value: function getActiveColor(optionIndex) {
      if (!this.props.interactionFrozen) {
        var newOptionColors = [];
        if (this.props.youOrThem.toLowerCase() == "you") {
          for (var i = 0; i < this.optionColors.length; i++) {
            if (i == optionIndex) {
              newOptionColors[i] = 'green';
            } else {
              newOptionColors[i] = 'white';
            }
          }
        } else {
          newOptionColors = this.state.optionColors;
          newOptionColors[optionIndex] = this.activeColor;
        }
        this.setState({ optionColors: newOptionColors });
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      var newOptionColors = [];
      for (var i = 0; i < this.optionColors.length; i++) {
        newOptionColors[i] = 'white';
      }
      this.setState({ optionColors: newOptionColors });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      //if fresh loadedJson is on its way, clear the old contents and replace with the new
      if (nextProps.loadedJson['id'] != this.props.loadedJson['id']) {
        var newColors = [];
        for (var i = 0; i < this.props.possibleOptions.length; i++) {
          newColors[i] = 'white';
        }

        if (nextProps.loadedJson[nextProps.name.toLowerCase()]) {
          if (nextProps.loadedJson[nextProps.name.toLowerCase()][0] != undefined) {
            for (var _i = 0; _i < nextProps.possibleOptions.length; _i++) {
              newColors[_i] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][_i]);
            }
          } else {
            for (var index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
              var capitalizedIndex = Chart.capitalize(index);
              if (index == "mtf" || index == "ftm") {
                //workaround for MTF and FTM
                capitalizedIndex = index.toUpperCase();
              }
              var numericalIndex = nextProps.possibleOptions.indexOf(capitalizedIndex);
              newColors[numericalIndex] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][index]);
            }
          }
        }

        this.setState({ optionColors: newColors });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.parentIsCategory) {
        this.props.retrieve(this.toDictJson()); //update parent with every state change
      } else {
        this.props.retrieve(this.toArrayJson()); //non-category parents will want to use numerical indices
      }

      var hidden = false;
      if (this.props.emptyElementsHidden) {
        var arrayJson = this.toArrayJson();
        hidden = true;
        for (var index in arrayJson) {
          if (arrayJson[index] != 'none') {
            hidden = false;
            break;
          }
        }
      }

      var resetType;
      if (this.props.youOrThem.toLowerCase() == "you") {
        resetType = "undo";
      } else {
        resetType = "reset";
      }

      var commonHtml = [];
      commonHtml.push(React.createElement(ElementName, { key: this.props.name + '-name', name: this.props.name, optionalNotice: false, interactionFrozen: this.props.interactionFrozen, reset: this.reset, resetType: resetType }));
      commonHtml.push(React.createElement(CheckboxSelectBox, { key: 'select-box', possibleOptions: this.props.possibleOptions, colors: this.state.optionColors, onClick: this.getActiveColor, interactionFrozen: this.props.interactionFrozen }));
      commonHtml.push(React.createElement(SingleColorYouControlsText, { key: this.props.youOrThem + '-text', youOrThem: this.props.youOrThem, isHidden: this.props.interactionFrozen }));

      var contents = '';
      if (this.props.youOrThem.toLowerCase() == "you") {
        contents = React.createElement(
          "div",
          { className: "multicolorCheckbox" },
          commonHtml
        );
      } else {
        contents = React.createElement(
          "div",
          { className: "multicolorCheckbox" },
          commonHtml,
          React.createElement(ColorSelectBar, { key: 'color-select-bar', onClick: this.setActiveColor, interactionFrozen: this.props.interactionFrozen })
        );
      }

      return Category.fillColumn(contents, this.props.name, hidden);
    }
  }]);

  return SingleColorYouCheckboxSet;
}(React.Component);

//props: name, youOrThem, numCells, rightmostOption, leftmostOption, retrieve


var FuzzySelectBar = function (_React$Component18) {
  _inherits(FuzzySelectBar, _React$Component18);

  function FuzzySelectBar(props) {
    _classCallCheck(this, FuzzySelectBar);

    var _this27 = _possibleConstructorReturn(this, (FuzzySelectBar.__proto__ || Object.getPrototypeOf(FuzzySelectBar)).call(this, props));

    _this27.retrieve = _this27.retrieve.bind(_this27);
    return _this27;
  }

  _createClass(FuzzySelectBar, [{
    key: "retrieve",
    value: function retrieve(childJson) {
      this.childJson = childJson;
      this.props.retrieve(this.toJson());
    }
  }, {
    key: "toJson",
    value: function toJson() {
      var colorScores = {};
      for (var i = 0; i < this.childJson.length; i++) {
        colorScores[i] = this.childJson[i]; //conversion from array to numerically-indexed object
      }

      var colorScoresWithName = {};
      colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

      return colorScoresWithName; //returns data in a dict of dicts, using the name as the key for the outer dict
    }
  }, {
    key: "render",
    value: function render() {
      var possibleOptions = [];
      for (var i = 0; i < this.props.numCells; i++) {
        if (i === 0) {
          possibleOptions[i] = this.props.leftmostOption;
        } else if (i == this.props.numCells - 1) {
          possibleOptions[i] = this.props.rightmostOption;
        } else {
          //decide how many up or down arrows are appropriate - use a dash for the center cell
          if (Math.floor(this.props.numCells / 2) > i) {
            //cells are drawn from the top of the box down
            possibleOptions[i] = '↑'.repeat(Math.floor(this.props.numCells / 2) - i);
          } else if (Math.floor(this.props.numCells / 2) < i) {
            possibleOptions[i] = '↓'.repeat(i - Math.floor(this.props.numCells / 2));
            if (this.props.numCells % 2 === 0) {
              //number of down arrows for non-middle cells depends on whether the total number is even or odd
              possibleOptions[i] += '↓';
            }
          } else {
            if (this.props.numCells % 2 === 0) {
              possibleOptions[i] = '↓';
            } else {
              //we need a special case for the middle cell when there's an odd number of cells
              possibleOptions[i] = '-';
            }
          }
        }
      }

      return React.createElement(SingleColorYouCheckboxSet, { name: this.props.name, youOrThem: this.props.youOrThem, possibleOptions: possibleOptions, retrieve: this.retrieve, parentIsCategory: false, interactionFrozen: this.props.interactionFrozen, loadedJson: this.props.loadedJson, emptyElementsHidden: this.props.emptyElementsHidden });
    }
  }]);

  return FuzzySelectBar;
}(React.Component);

//props: name, youOrThem, maxPossible, minPossible, numCells, retrieve


var NumericalSelectBar = function (_React$Component19) {
  _inherits(NumericalSelectBar, _React$Component19);

  function NumericalSelectBar(props) {
    _classCallCheck(this, NumericalSelectBar);

    var _this28 = _possibleConstructorReturn(this, (NumericalSelectBar.__proto__ || Object.getPrototypeOf(NumericalSelectBar)).call(this, props));

    _this28.retrieve = _this28.retrieve.bind(_this28);
    return _this28;
  }

  _createClass(NumericalSelectBar, [{
    key: "retrieve",
    value: function retrieve(childJson) {
      this.childJson = childJson;
      this.props.retrieve(this.toJson());
    }
  }, {
    key: "toJson",
    value: function toJson() {
      var colorScores = {};
      for (var i = 0; i < this.childJson.length; i++) {
        colorScores[i] = this.childJson[i]; //conversion from array to numerically-indexed object
      }

      var colorScoresWithName = {};
      colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

      return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
    }
  }, {
    key: "render",
    value: function render() {
      var rangePerCell = (this.props.maxPossible - this.props.minPossible + 1) / this.props.numCells;

      var possibleOptions = [];
      for (var i = 0; i < this.props.numCells; i++) {
        var minOfRange = this.props.minPossible + i * rangePerCell;
        var maxOfRange = minOfRange + rangePerCell - 1;

        if (i === 0) {
          //the user sees '<maxRange++' as the label for the first option
          maxOfRange++;
        }

        if (this.props.name == 'Height') {
          //TODO: Messy, messy, messy.
          minOfRange = Math.floor(minOfRange / 12) + '\'' + minOfRange % 12 + '\"';
          maxOfRange = Math.floor(maxOfRange / 12) + '\'' + maxOfRange % 12 + '\"';
        }

        if (i === 0) {
          possibleOptions[i] = '<' + maxOfRange;
        } else if (i == this.props.numCells - 1) {
          possibleOptions[i] = minOfRange + '+';
        } else {
          possibleOptions[i] = minOfRange + ' - ' + maxOfRange;
        }
      }

      return React.createElement(SingleColorYouCheckboxSet, { name: this.props.name, youOrThem: this.props.youOrThem, possibleOptions: possibleOptions, retrieve: this.retrieve, parentIsCategory: false, interactionFrozen: this.props.interactionFrozen, loadedJson: this.props.loadedJson, emptyElementsHidden: this.props.emptyElementsHidden });
    }
  }]);

  return NumericalSelectBar;
}(React.Component);

//props: name, youOrThem, retrieve


var BooleanSelectBar = function (_React$Component20) {
  _inherits(BooleanSelectBar, _React$Component20);

  function BooleanSelectBar(props) {
    _classCallCheck(this, BooleanSelectBar);

    var _this29 = _possibleConstructorReturn(this, (BooleanSelectBar.__proto__ || Object.getPrototypeOf(BooleanSelectBar)).call(this, props));

    _this29.retrieve = _this29.retrieve.bind(_this29);
    return _this29;
  }

  _createClass(BooleanSelectBar, [{
    key: "retrieve",
    value: function retrieve(childJson) {
      this.childJson = childJson;
      this.props.retrieve(this.toJson());
    }
  }, {
    key: "toJson",
    value: function toJson() {
      var colorScores = {};
      colorScores["no"] = this.childJson[0];
      colorScores["yes"] = this.childJson[1];

      var colorScoresWithName = {};
      colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

      return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
    }
  }, {
    key: "render",
    value: function render() {
      var possibleOptions = [];
      possibleOptions[0] = "No";
      possibleOptions[1] = "Yes";

      return React.createElement(SingleColorYouCheckboxSet, { name: this.props.name, youOrThem: this.props.youOrThem, possibleOptions: possibleOptions, retrieve: this.retrieve, parentIsCategory: false, interactionFrozen: this.props.interactionFrozen, loadedJson: this.props.loadedJson, emptyElementsHidden: this.props.emptyElementsHidden });
    }
  }]);

  return BooleanSelectBar;
}(React.Component);

//props: name, interactionFrozen, emptyElementsHidden, retrieve (callback)


var BulletList = function (_React$Component21) {
  _inherits(BulletList, _React$Component21);

  function BulletList(props) {
    _classCallCheck(this, BulletList);

    var _this30 = _possibleConstructorReturn(this, (BulletList.__proto__ || Object.getPrototypeOf(BulletList)).call(this, props));

    _this30.retrieve = _this30.retrieve.bind(_this30);
    _this30.reset = _this30.reset.bind(_this30);

    _this30.closeBullet = _this30.closeBullet.bind(_this30);
    _this30.newBullet = _this30.newBullet.bind(_this30);

    //two sets of component keys -- used for forcing re-mounts
    _this30.keysA = [];
    _this30.keysB = [];
    for (var i = 0; i < _this30.props.maxBullets; i++) {
      _this30.keysA[i] = i;
      _this30.keysB[i] = i + _this30.props.maxBullets;
    }

    _this30.currentKeySet = 'A';
    _this30.keySet = _this30.keysA;

    var bulletContents = [];
    if (_this30.props.singleBulletList) {
      bulletContents[0] = '';
    }

    //feed the parent an empty list to start off with
    var bulletListJson = {};
    bulletListJson[_this30.props.name.toLowerCase()] = [''];
    _this30.props.retrieve(bulletListJson);

    _this30.state = {
      bulletContents: bulletContents
    };
    return _this30;
  }

  _createClass(BulletList, [{
    key: "newBullet",
    value: function newBullet() {
      if (this.state.bulletContents.length < this.props.maxBullets) {
        //limit the maximum number of bullets to prevent abuse
        var tmpContents = [];
        for (var i = 0; i < this.state.bulletContents.length; i++) {
          tmpContents.push(this.state.bulletContents[i]);
        }
        tmpContents.push('');
        this.setState({ bulletContents: tmpContents });
      }
    }
  }, {
    key: "closeBullet",
    value: function closeBullet(index) {
      var tmpContents = [];
      for (var i = 0; i < this.state.bulletContents.length; i++) {
        if (i != index) {
          //console.log(i);
          tmpContents.push(this.state.bulletContents[i]);
        }
      }
      this.justClosedBullet = true; //used for forcing remount
      this.setState({ bulletContents: tmpContents });
    }
  }, {
    key: "retrieve",
    value: function retrieve(index, event) {
      var tmpContents = [];
      for (var i = 0; i < this.state.bulletContents.length; i++) {
        tmpContents.push(this.state.bulletContents[i]);
      }
      tmpContents[index] = event.target.value;

      this.setState({ bulletContents: tmpContents });

      var bulletListJson = {};
      bulletListJson[this.props.name.toLowerCase()] = tmpContents;
      this.props.retrieve(bulletListJson);
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.props.singleBulletList) {
        this.setState({ bulletContents: [''] });
      } else {
        this.setState({ bulletContents: [] });
      }
      this.justResetBullet = true; //this also requires a re-mount
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      if (this.state.bulletContents.length == 0) {
        return true;
      } else if (this.state.bulletContents.length == 1) {
        return this.state.bulletContents[0] == "";
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      //if fresh loadedJson is on its way, clear the old contents and replace with the new
      if (nextProps.loadedJson['id'] != this.props.loadedJson['id']) {
        var bulletContents = [];

        if (typeof nextProps.loadedJson[nextProps.name.toLowerCase()] === "string" || nextProps.loadedJson[nextProps.name.toLowerCase()] instanceof String) {
          bulletContents[0] = nextProps.loadedJson[nextProps.name.toLowerCase()];
        } else {
          for (var index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
            bulletContents[index] = nextProps.loadedJson[nextProps.name.toLowerCase()][index];
          }
        }

        this.setState({ bulletContents: bulletContents });
      }
    }
  }, {
    key: "render",
    value: function render() {
      //ugly hack to force remount only after closing bullet (by switching to a new set of keys)
      if (this.justClosedBullet || this.justResetBullet) {
        if (this.currentKeySet == 'A') {
          this.keySet = this.keysB;
          this.currentKeySet = 'B';
        } else {
          this.keySet = this.keysA;
          this.currentKeySet = 'A';
        }
      }
      this.justClosedBullet = false;
      this.justResetBullet = false;

      var bulletSetAndNewBulletButton = [];
      for (var i = 0; i < this.state.bulletContents.length; i++) {
        var isEmpty = false;
        if (this.state.bulletContents[i] == '') {
          isEmpty = true;
        }

        bulletSetAndNewBulletButton.push(React.createElement(Bullet, { key: this.keySet[i], preloadedContents: this.state.bulletContents[i], retrieve: this.retrieve, closeBullet: this.closeBullet, index: i, interactionFrozen: this.props.interactionFrozen, singleBulletList: this.props.singleBulletList, isEmpty: isEmpty }));
      }

      //add a little space between the bullet points and the new bullet button
      if (this.state.bulletContents.length != 0 && this.state.bulletContents.length != this.props.maxBullets) {
        bulletSetAndNewBulletButton.push(React.createElement("div", { style: { height: 7 } }));
      }

      //console.log(this.state.bulletContents.length);
      //console.log(this.props.maxBullets);
      if (this.state.bulletContents.length < this.props.maxBullets) {
        bulletSetAndNewBulletButton.push(React.createElement(NewBulletButton, { name: this.props.name, maxBullets: this.props.maxBullets, newBullet: this.newBullet, interactionFrozen: this.props.interactionFrozen }));
      }

      var hidden = false;
      if (this.props.emptyElementsHidden && this.isEmpty()) {
        hidden = true;
      }

      var resetType = "reset";
      if (this.props.singleBulletList) {
        resetType = "undo";
      }

      var contents = React.createElement(
        "div",
        { className: "multicolorCheckbox" },
        React.createElement(
          "div",
          { className: "bulletList" },
          React.createElement(ElementName, { optionalNotice: true, key: this.props.name + '-name', name: this.props.name, interactionFrozen: this.props.interactionFrozen, reset: this.reset, resetType: resetType }),
          bulletSetAndNewBulletButton
        )
      );

      return Category.fillColumn(contents, this.props.name, hidden);
    }
  }]);

  return BulletList;
}(React.Component);

//does nothing exciting at the moment


var SingleBulletList = function (_React$Component22) {
  _inherits(SingleBulletList, _React$Component22);

  function SingleBulletList(props) {
    _classCallCheck(this, SingleBulletList);

    var _this31 = _possibleConstructorReturn(this, (SingleBulletList.__proto__ || Object.getPrototypeOf(SingleBulletList)).call(this, props));

    _this31.retrieve = _this31.retrieve.bind(_this31);
    return _this31;
  }

  _createClass(SingleBulletList, [{
    key: "retrieve",
    value: function retrieve(childJson) {
      var singleBulletListJson = {};
      singleBulletListJson[this.props.name.toLowerCase()] = childJson[this.props.name.toLowerCase()][0];
      this.props.retrieve(singleBulletListJson);
    }
  }, {
    key: "render",
    value: function render() {
      //console.log(this.props.loadedJson);

      return React.createElement(BulletList, { name: this.props.name, retrieve: this.retrieve, interactionFrozen: this.props.interactionFrozen, emptyElementsHidden: this.props.emptyElementsHidden, maxBullets: 1, singleBulletList: true, loadedJson: this.props.loadedJson });
    }
  }]);

  return SingleBulletList;
}(React.Component);

//props: preloadedContents, index, closeBullet (callback), retrieve (callback)


var Bullet = function (_React$Component23) {
  _inherits(Bullet, _React$Component23);

  function Bullet() {
    _classCallCheck(this, Bullet);

    return _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).apply(this, arguments));
  }

  _createClass(Bullet, [{
    key: "render",
    value: function render() {
      var displayStyle = 'inline-block';
      if (this.props.interactionFrozen && this.props.isEmpty) {
        displayStyle = 'none';
      }

      var contents = [];
      contents.push(React.createElement(
        "span",
        null,
        "\u2022\xA0"
      ));
      contents.push(React.createElement(BulletEntryBox, { retrieve: this.props.retrieve, index: this.props.index, preloadedContents: this.props.preloadedContents, interactionFrozen: this.props.interactionFrozen, singleBulletList: this.props.singleBulletList }));

      if (!this.props.singleBulletList) {
        contents.push(React.createElement(CloseBulletButton, { closeBullet: this.props.closeBullet, index: this.props.index, interactionFrozen: this.props.interactionFrozen }));
      }

      return React.createElement(
        "div",
        { className: "bullet", style: { display: displayStyle } },
        contents
      );
    }
  }]);

  return Bullet;
}(React.Component);

var BulletEntryBox = function (_React$Component24) {
  _inherits(BulletEntryBox, _React$Component24);

  function BulletEntryBox() {
    _classCallCheck(this, BulletEntryBox);

    return _possibleConstructorReturn(this, (BulletEntryBox.__proto__ || Object.getPrototypeOf(BulletEntryBox)).apply(this, arguments));
  }

  _createClass(BulletEntryBox, [{
    key: "render",
    value: function render() {
      var _this34 = this;

      return React.createElement(
        "div",
        { className: "bulletEntry" },
        React.createElement("input", { type: "text", defaultValue: this.props.preloadedContents, disabled: this.props.interactionFrozen, onBlur: function onBlur(event) {
            _this34.props.retrieve(_this34.props.index, event);
          }, maxLength: BulletEntryBox.maxLength })
      );
    }
  }], [{
    key: "maxLength",
    get: function get() {
      return 20;
    }
  }]);

  return BulletEntryBox;
}(React.Component);

//props: index, closeBullet (callback)


var CloseBulletButton = function (_React$Component25) {
  _inherits(CloseBulletButton, _React$Component25);

  function CloseBulletButton() {
    _classCallCheck(this, CloseBulletButton);

    return _possibleConstructorReturn(this, (CloseBulletButton.__proto__ || Object.getPrototypeOf(CloseBulletButton)).apply(this, arguments));
  }

  _createClass(CloseBulletButton, [{
    key: "render",

    //closeBullet triggers a re-render at the BulletList level
    value: function render() {
      var _this36 = this;

      var displayStyle = 'block';
      if (this.props.interactionFrozen) {
        displayStyle = 'none';
      }

      return React.createElement(
        "button",
        { className: "closeBulletButton", style: { display: displayStyle }, onClick: function onClick() {
            _this36.props.closeBullet(_this36.props.index);
          } },
        "X"
      );
    }
  }]);

  return CloseBulletButton;
}(React.Component);

//props: name, maxBullets


var NewBulletButton = function (_React$Component26) {
  _inherits(NewBulletButton, _React$Component26);

  function NewBulletButton() {
    _classCallCheck(this, NewBulletButton);

    return _possibleConstructorReturn(this, (NewBulletButton.__proto__ || Object.getPrototypeOf(NewBulletButton)).apply(this, arguments));
  }

  _createClass(NewBulletButton, [{
    key: "render",
    value: function render() {
      var _this38 = this;

      var displayStyle = 'block';
      if (this.props.interactionFrozen) {
        displayStyle = 'none';
      }

      return React.createElement(
        "button",
        { className: "newBulletButton", style: { display: displayStyle }, onClick: function onClick() {
            return _this38.props.newBullet();
          } },
        ('More ' + this.props.name.toLowerCase() + ' (up to ' + this.props.maxBullets + ')').replace(/ /g, "\xA0")
      );
    }
  }]);

  return NewBulletButton;
}(React.Component);

ReactDOM.render(React.createElement(Chart, null), document.getElementById('root'));