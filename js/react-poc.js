/*jshint esversion: 6*/
/*jshint sub:true*/
/* jshint loopfunc: true */

class Chart extends React.Component {
  constructor (props) { //TODO: change this to a yaml parser when you're done testing out the basic UI
    super(props);

    this.developmentMode = false;

    this.json = {};

    this.retrieve = this.retrieve.bind(this);

    this.tagLine = "The Ultimate QT Infograph";
    this.webVersion  = "2.0 Alpha";
    this.chartVersion = "3.0";

    this.contactInfo = 'qtprime@qtchart.com';

    this.requestChartImage = this.requestChartImage.bind(this);

    this.pageLoadHandler                     = this.pageLoadHandler.bind(this);
    this.loginConfirmationHandler            = this.loginConfirmationHandler.bind(this);
    this.pageLoadAndLoginConfirmationHandler = this.pageLoadAndLoginConfirmationHandler.bind(this);

    this.createPage = this.createPage.bind(this);
    this.login      = this.login.bind(this);
    this.logout     = this.logout.bind(this);

    //TODO: I'm planning on rolling the field format generation into the back-end, these hard-coded lists will disappear
    this.categoryMulticolorCheckboxMap = {'Emotional': {'Quirks':
      ['Adventurous','Ambitious','Analytical','Artistic','Assertive', 'Athletic', 'Confident', 'Creative',
       'Cutesy', 'Cynical', 'Easy-going', 'Empathetic', 'Energetic', 'Honest', 'Humorous', 'Hygienic',
       'Intelligent', 'Kind', 'Lazy', 'Loud', 'Materialistic', 'Messy', 'Outdoorsy', 'Passionate',
       'Reliable', 'Resourceful', 'Romantic', 'Serious', 'Sexual', 'Social', 'Talkative', 'Wise']
    }};

    this.categorySingleColorYouCheckboxMap = {'Physical': {'Gender': ['Male', 'Female', 'MTF', 'FTM'],
      'Race': ['White', 'Asian', 'Latin', 'Arab', 'Black', 'Other'],
      'Body Type': ['Fit', 'Skinny', 'Thin', 'Medium', 'Chubby', 'Fat'],
      'Facial Hair': ['None','Moustache','Goatee','Stubble','Beard','Wizard'],
      'Hair Style': ['Bald', 'Short', 'Medium', 'Long', 'Very Long'],
      'Hair Color': ['Black', 'Brown', 'Gold', 'Blonde', 'Ginger', 'Other']},
      'Beliefs': {'Religion': ['Christian', 'Muslim', 'Jewish', 'Pagan', 'Satanist', 'Deist', 'Polydeist', 'Agnostic', 'Atheist', 'Other']
    }};

    this.categoryBooleanBarMap = {'Physical': ['Piercings', 'Tattoos']};

    this.categoryNumericalBarMap = {'Physical': {'Age': {'min': 16, 'max': 31, 'numCells': 8}, 'Height': {'min': 57, 'max': 76, 'numCells': 10}}};

    this.categoryFuzzyBarMap = {'Emotional': {'Extroversion': {'numCells': 10, 'left': 'Introverted', 'right': 'Extroverted'},
      'Practicality': {'numCells': 10, 'left': 'Theoretical', 'right': 'Practical'},
      'Emotional': {'numCells': 10, 'left': 'Logical', 'right': 'Emotional'},
      'Spontaneity': {'numCells': 10, 'left': 'Structured', 'right': 'Spontaneous'}},
      'Beliefs': {'Religious Devotion': {'numCells': 5, 'left': 'Low', 'right': 'High'},
      'Political Views': {'numCells': 7, 'left': 'Libertarian', 'right': 'Authoritarian'},
      'Social Views': {'numCells': 7, 'left': 'Progressive', 'right': 'Conservative'}},
      'Other': {'Alcohol': {'numCells':3, 'left': 'Never', 'right': 'Frequently'},
      'Tobacco': {'numCells':3, 'left': 'Never', 'right': 'Frequently'},
      'Other Drugs': {'numCells':3, 'left': 'Never', 'right': 'Frequently'}}
    };

    this.categorySingleColorYou2DCheckboxMap = {'Beliefs': {'Economic Views': {'top': 'Capitalist', 'bottom': 'Socialist', 'left': 'Free Market', 'right': 'Regulated Market', 'cellDimensions': 5}}};

    this.bulletListMap = { 'More Information': {'Contact Info': {'maxBullets': 3}, 'Sites/Boards': {'maxBullets': 3}, 'Sports': {'maxBullets': 3}, 'Music': {'maxBullets': 3}, 'Literature': {'maxBullets': 3}, 'Games': {'maxBullets': 3}, 'Movies/TV': {'maxBullets': 3}, 'Mutual Activities': {'maxBullets': 7}, 'Other Interests': {'maxBullets': 6}, 'Other Information': {'maxBullets': 10}}};

    this.singleBulletListMap = { 'Other': ['Location', 'Occupation']};

    this.categoryElementMap = {
      'singleColorYouCheckboxSets':   this.categorySingleColorYouCheckboxMap,
      'multicolorCheckboxSets':       this.categoryMulticolorCheckboxMap,
      'booleanSelectBars':            this.categoryBooleanBarMap,
      'numericalSelectBars':          this.categoryNumericalBarMap,
      'fuzzySelectBars':              this.categoryFuzzyBarMap,
      'singleColorYou2DCheckboxSets': this.categorySingleColorYou2DCheckboxMap,
      'bulletLists':                  this.bulletListMap,
      'singleBulletLists':            this.singleBulletListMap
    };

    this.allowDownloadClick = true; //prevent the backend from being POST-spammed through the frontend by download-button mashing

    this.state = {
      generateButtonText: 'Download',
      errorMessage: '',
      errorMessageDisplayMode: 'off',
      loadedJson: {},
      interactionFrozen: false,
      emptyElementsHidden: false
    };

    this.jsonLoadId = '';

    this.state.loggedIn = false;

    let restParams = new URLSearchParams(window.location.search.slice(1));

    this.state.username = '';
    if (restParams.has("user")) {
      let username = restParams.get("user");

      this.userDataFromUsername(username,this.pageLoadHandler);
      this.userDataFromSessionCookie(this.loginConfirmationHandler);
      this.state.viewerType = "visitor";
    } else {
      this.userDataFromSessionCookie(this.pageLoadAndLoginConfirmationHandler);
      this.state.viewerType = "owner";
    }

    if (this.state.viewerType=="visitor") {
      this.state.interactionFrozen   = true;
      this.state.emptyElementsHidden = true;
    }
  }

  //static get restServerDomain() { return 'http://127.0.0.1:5000/'; }
  static get webApiDomain()   { return 'http://web-api.qtchart.com';   }
  static get imageApiDomain() { return 'http://image-api.qtchart.com'; }

  static get imageRequestUri() { return Chart.imageApiDomain + '/new'; }

  static get userDataRequestUri()       { return Chart.webApiDomain + '/user/read';     }
  static get userCreationRequestUri()   { return Chart.webApiDomain + '/user/create';   }
  static get userDataUpdateRequestUri() { return Chart.webApiDomain + '/user/update';   }
  static get userLoginRequestUri()      { return Chart.webApiDomain + '/user/login';    }
  static get userLogoutRequestUri()     { return Chart.webApiDomain + '/user/logout';   }
  static get userUsernameRequestUri()   { return Chart.webApiDomain + '/user/username'; }
  static get userDeleteRequestUri()     { return Chart.webApiDomain + '/user/delete';   }

  static get defaultGenerateButtonText() { return 'Download'; }
  static get generateAnimationTick() {return 1000; }

  getLoadedJsonForChild(targetName) {
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

  freezeInteraction() {
    this.setState({ interactionFrozen: true });
  }

  unfreezeInteraction() {
    this.setState({ interactionFrozen: false });
  }

  retrieve(childJson) {
    for (let firstName in childJson) {
      this.json[firstName] = childJson[firstName];
    }
  }

  //the backend uses a different image element tree configuration than the frontend -- backend starts with a category, frontend with a target
  jsonFrontend2BackendRepresentation() {
    var backendJson = {};

    //TODO: there HAS to be a better way to initialize the first two dimensions without introducing more global state
    for (let targetName in this.json) {
      for (let categoryName in this.json[targetName]) {
        backendJson[categoryName] = {};
        for (let elementName in this.json[targetName][categoryName]) {
          backendJson[categoryName][elementName] = {};
        }
      }
      break; //only does one iteration
    }

    for (let targetName in this.json) {
      for (let categoryName in this.json[targetName]) {
        for (let elementName in this.json[targetName][categoryName]) {
          backendJson[categoryName][elementName][targetName] = this.json[targetName][categoryName][elementName];
        }
      }
    }

    return backendJson;
  }

  missingElements() {
    var missingElements = {};
    for (let targetName in this.json) {
      missingElements[targetName] = {};
      for (let categoryName in this.json[targetName]) {
        missingElements[targetName][categoryName] = [];
        for (let elementName in this.json[targetName][categoryName]) {
          let nonNoneElementExists = false;
          let noneElementExists    = false;

          if ((typeof this.json[targetName][categoryName][elementName])!='string') {
            for (let subelementName in this.json[targetName][categoryName][elementName]) {
              if (this.json[targetName][categoryName][elementName][subelementName]!='none') {
                nonNoneElementExists = true;
              } else {
                noneElementExists = true;
              }
            }
          } else {
            if (this.json[targetName][categoryName][elementName]!='none') {
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

          if (targetName.toLowerCase()=='you') {
            if (!nonNoneElementExists) {
              missingElements[targetName][categoryName].push(elementName);
              continue;
            }
          }

          if (targetName.toLowerCase()=='them') {
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

  firstMissingElement() {
    var missingElements = this.missingElements();
    for (let targetName in missingElements) {
      for (let categoryName in missingElements[targetName]) {
        if (missingElements[targetName][categoryName].length>0) {
          let singleMissingElementHash = {};
          singleMissingElementHash[targetName] = {};
          singleMissingElementHash[targetName][categoryName] = missingElements[targetName][categoryName][0];

          return singleMissingElementHash; //returns a multilevel hash of a single element indexed by its target and category
        }
      }
    }

    throw "There were no missing elements to return.";
  }

  noMissingElements() {
    var missingElements = this.missingElements();
    for (let targetName in missingElements) {
      for (let categoryName in missingElements[targetName]) {
        if (missingElements[targetName][categoryName].length!==0) {
          return false;
        }
      }
    }

    return true;
  }

  pageLoadHandler(username,initialData) {
    this.jsonLoadId = Math.random();
    this.setState({username: username, loadedJson: initialData});
  }

  //basically ignores the user data, just confirms that the user is logged in
  //TODO: new request function which just returns whether your session is valid
  loginConfirmationHandler(username,initialData) {
    this.setState({loggedIn: true});
  }

  pageLoadAndLoginConfirmationHandler(username,initialData) {
    this.pageLoadHandler(username,initialData);
    this.loginConfirmationHandler(username,initialData);
  }

  createPage(username,password,successHandler,failureHandler) {
    this.createPageServerSide(username,password,this.json,successHandler,failureHandler);
  }

  deleteUser(username,password) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('DELETE', Chart.userDeleteRequestUri, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "text";
    httpRequest.send(JSON.stringify({"username": username, "password": password}));
  }

  userDataFromSessionCookie(handler) { //returns nothing and deletes session cookie on error
    var sessionId;
    var username;
    var initialData = {};

    var httpRequest = new XMLHttpRequest();

    if (localStorage.getItem("sessionId") !== null) {
      httpRequest.open('POST', Chart.userUsernameRequestUri, true); //need the username before we can do anything else
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      //httpRequest.responseType = "text";

      //console.log(JSON.stringify({"sessionId": localStorage.getItem("sessionId")}));

      let that = this;
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
          username    = httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,"");
          that.userDataFromUsername(username,handler);
        } else if (httpRequest.status>=400) {
          localStorage.removeItem("sessionId");
        }
      };
      httpRequest.onerror = function() {
        localStorage.removeItem("sessionId");
      };
      //httpRequest.send(JSON.stringify({"username": "username"}));
      httpRequest.send(JSON.stringify({"sessionId": localStorage.getItem("sessionId")}));
    }
  }

  userDataFromUsername(username,handler) {
    var initialData = '';

    var httpRequest = new XMLHttpRequest();

    httpRequest.open('POST', Chart.userDataRequestUri, true); //need the data before we can load components
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "json";

    let that = this;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
        initialData = JSON.parse(httpRequest.response);
        handler(username,initialData);
      } else if (httpRequest.status>=400) {
        localStorage.removeItem("sessionId");
      }
    };
    httpRequest.onerror = function() {
      localStorage.removeItem("sessionId");
    };
    httpRequest.send(JSON.stringify({'username': username}));
  }

  createPageServerSide(username,password,userData,successHandler,failureHandler) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('POST', Chart.userCreationRequestUri, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "text";

    let that = this;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 201) {
        localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
        successHandler();
      } else if (httpRequest.status>=400) {
        failureHandler(httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
      }
    };
    httpRequest.onerror = function() {
      failureHandler('Unidentified failure.');
    };
    httpRequest.send(JSON.stringify({"username": username, "password": password, "userData": userData}));
  }

  logout() {
    this.setLoginStatusAndViewerType(false,'owner');

    localStorage.removeItem('sessionId');

    var httpRequest = new XMLHttpRequest();

    httpRequest.open('DELETE', Chart.userLogoutRequestUri, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "text";
    httpRequest.send(JSON.stringify({"sessionId": localStorage.getItem('sessionId')}));
  }

  login(username,password,pageLoadHandler,successHandler,failureHandler) {
    localStorage.removeItem('sessionId');

    var httpRequest = new XMLHttpRequest();

    httpRequest.open('POST', Chart.userLoginRequestUri, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "text";

    //grab our session from the login response
    let that = this;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 201) {
        localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
        successHandler();
        that.userDataFromSessionCookie(pageLoadHandler);
        that.setLoginStatusAndViewerType(true,'owner');
      } else if (httpRequest.status>=400) {
        failureHandler(httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
      }
    };
    httpRequest.onerror = function() {
      failureHandler('Unidentified failure.');
    };
    httpRequest.send(JSON.stringify({"username": username, "password": password}));
  }

  setLoginStatusAndViewerType(loggedIn,viewerType) {
    var loadedJson = this.state.loadedJson;
    var username   = this.state.username;
    if (!loggedIn) {
      this.jsonLoadId = Math.random();
      loadedJson = {};

      if (viewerType==="owner") {
        username = '';
      }
    }

    if (viewerType==="visitor") {
      this.setState({
        loggedIn: loggedIn,
        viewerType: viewerType,
        loadedJson: loadedJson,
        username: username,
        interactionFrozen:   true,
        emptyElementsHidden: true
      });
    } else if(viewerType==="owner") {
      this.setState({
        loggedIn: loggedIn,
        viewerType: viewerType,
        loadedJson: loadedJson,
        username: username,
        interactionFrozen:   false,
        emptyElementsHidden: false
      });
    }
  }

  updatePageServerSide() {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open('POST', Chart.userDataUpdateRequestUri, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "text";

    let that = this;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
        localStorage.setItem("sessionId", httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
      } else if (httpRequest.status>=400) {
        that.showFailedRequestWarning(httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
      }
    };
    httpRequest.onerror = function() {
      that.showFailedRequestWarning(httpRequest.responseText.replace(/(\n)/gm,"").replace(/(\")/gm,""));
    };
    httpRequest.send(JSON.stringify({"sessionId": localStorage.getItem("sessionId"), "userData": this.json}));
  }

  showGenerateWaitAnimation() {
    this.setState({generateButtonText: 'Generating'});

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

  hideGenerateWaitAnimation() {
    if (this.generationAnimationTimer!==null) {
      clearInterval(this.generationAnimationTimer);
    }

    this.setState({generateButtonText: Chart.defaultGenerateButtonText});
  }

  showEmptyFieldWarning() {
    var missingElement = this.firstMissingElement();
    for (let targetName in missingElement) {
      for (let categoryName in missingElement[targetName]) {
        let elementName = missingElement[targetName][categoryName];
        this.setState({errorMessage: 'Missing field in \'' + Chart.capitalize(elementName) + '\' under \'' + Chart.capitalize(targetName) + '\' → \'' + Chart.capitalize(categoryName) + '\'', errorMessageDisplayMode: 'on'});
        return;
      }
    }
  }

  showFailedRequestWarning(errorMessage) {
    this.setState({errorMessage: errorMessage, errorMessageDisplayMode: 'on'});
    window.scrollTo(0,document.body.scrollHeight);
  }

  static capitalize(string) {
    var words = string.toLowerCase().split(' ');
    for (let i=0;i<words.length;i++) {
      let letters = words[i].split('');
      letters[0] = letters[0].toUpperCase();
      words[i] = letters.join('');
    }

    return words.join(' ');
  }

  hideProcessingErrorWarning() {
    this.setState({errorMessage: '', errorMessageDisplayMode: 'off'});
  }

  requestChartImage() {
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
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
        var imageBlob = new Blob([httpRequest.response], {type: 'application/octet-stream'});
        that.hideGenerateWaitAnimation();
        that.allowDownloadClick = true;
        saveAs(imageBlob, "chart.jpg");
      } else if (httpRequest.status>=400) { //something went wrong
        //console.log('Failed response.');
        that.showFailedRequestWarning('Could not contact image generation server -- try again.');
        that.hideGenerateWaitAnimation();
        that.allowDownloadClick = true;
      }
    };
    httpRequest.onerror = function() {
      that.showFailedRequestWarning('Could not contact image generation server -- try again.');
      that.hideGenerateWaitAnimation();
      that.allowDownloadClick = true;
    };
    //httpRequest.withCredentials = true;//TODO: might need this later (for when I'm using sessions)
    httpRequest.send(JSON.stringify(this.jsonFrontend2BackendRepresentation()));
  }

  openLoginPrompt() {
    $('#loginModal').modal('show');
  }

  openRegisterPrompt() {
    $('#registerModal').modal('show');
  }

  render() {
    var targets = [];
    var possibleTargets = ["You","Them"];
    for (let i=0;i<possibleTargets.length;i++) {
      targets.push(<Target key={possibleTargets[i]} targetName={possibleTargets[i]} username={this.state.username} categoryElementMap={this.categoryElementMap} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(possibleTargets[i])} interactionFrozen={this.state.interactionFrozen} emptyElementsHidden={this.state.emptyElementsHidden} />);
    }

    var footerButtons = [];
    footerButtons.push(<button type="button" name="download" onClick={this.requestChartImage}>{this.state['generateButtonText']}</button>);

    footerButtons.push(<div className="buttonSpacingDiv"></div>);

    if (this.state.viewerType=="owner") {
      if (this.state.loggedIn) {
        footerButtons.push(<button type="button" name="Update" onClick={() => {this.updatePageServerSide()}}>Update</button>);
      } else {
        footerButtons.push(<button type="button" name="registerModalButton" onClick={() => {this.openRegisterPrompt()}}>Save Page</button>);
      }
    }

    if (this.developmentMode) {
      footerButtons.push(<button type="button" name="Logout" onClick={() => {this.logout()}}>Logout</button>);
      footerButtons.push(<button type="button" name="loginModalButton" onClick={() => {this.openLoginPrompt()}}>Log Modal</button>);
      footerButtons.push(<button type="button" name="freezeUnfreeze" onClick={() => {this.setState({interactionFrozen: !this.state.interactionFrozen})}}>Freezer</button>);
      footerButtons.push(<button type="button" name="hideUnhide" onClick={() => {this.setState({emptyElementsHidden: !this.state.emptyElementsHidden})}}>Hider</button>);
      footerButtons.push(<button type="button" name="deleteUserA" onClick={() => this.deleteUser("testusera","password")}>DeleteUserA</button>);
      footerButtons.push(<button type="button" name="deleteUserB" onClick={() => this.deleteUser("testuserb","password")}>DeleteUserB</button>);
    }

    return (
      <div className="chart fillSmallScreen">
        <ChartName webVersion={this.webVersion} contactInfo={this.contactInfo} viewerType={this.state.viewerType} loggedIn={this.state.loggedIn} logout={this.logout} openLoginPrompt={this.openLoginPrompt} />
        {targets}
        <div className="chartFooter">
          <LoginRegisterModal modalType={'login'} loginOrRegister={this.login} pageLoadHandler={this.pageLoadHandler} />
          <LoginRegisterModal modalType={'register'} loginOrRegister={this.createPage} pageLoadHandler={this.pageLoadHandler} />
          <div className="footerButtons">
            {footerButtons}
          </div>
          <div className={'errorMessage ' + this.state.errorMessageDisplayMode}>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
}

//TODO: the modal needs to define its own handler for login / registration (so that it can display the right messages)
//props: modalType, loginOrRegister (handler)
class LoginRegisterModal extends React.Component {
  constructor(props) {
    super(props);

    this.username = '';
    this.password = '';

    this.loginRegistrationFailureHandler = this.loginRegistrationFailureHandler.bind(this);
    this.loginRegistrationSuccessHandler = this.loginRegistrationSuccessHandler.bind(this);

    this.state = {
      warningMessage: ''
    };
  }

  usernameChangeHandler(event) {
    this.username = event.target.value;
  }

  passwordChangeHandler(event) {
    this.password = event.target.value;
  }

  loginRegistrationFailureHandler(responseText) {
    this.setState({warningMessage: 'Can\'t ' + this.props.modalType + ' - ' + responseText});
  }

  loginRegistrationSuccessHandler() {
    this.setState({warningMessage: ''});
    this.close();
  }

  close() {
    $('#' + this.props.modalType + "Modal").modal('toggle');
  }

  render() {
    var requestButtonJsx;
    if(this.props.modalType=="login") {
      requestButtonJsx = <button name={this.props.modalType} onClick={() => {this.props.loginOrRegister(this.username, this.password, this.props.pageLoadHandler, this.loginRegistrationSuccessHandler,this.loginRegistrationFailureHandler)}}>{Chart.capitalize(this.props.modalType)}</button>
    } else if (this.props.modalType=="register") {
      requestButtonJsx = <button name={this.props.modalType} onClick={() => {this.props.loginOrRegister(this.username, this.password, this.loginRegistrationSuccessHandler,this.loginRegistrationFailureHandler)}}>{Chart.capitalize(this.props.modalType)}</button>
    }

    return (
      <div className="modal fade" id={this.props.modalType + "Modal"} tabindex="-1" role="dialog" aria-labelledby={this.props.modalType + "ModalAria"} aria-hidden="true">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id={this.props.modalType + "ModalAria"}>{Chart.capitalize(this.props.modalType)}</h4>
            </div>

            <div className="modal-body">
              <div>
                <label>Username: <input type="text" name="username" onChange={(event) => {this.usernameChangeHandler(event)}} /></label>
              </div>
              <div>
                <label>Password: <input type="text" name="password" onChange={(event) => {this.passwordChangeHandler(event)}} /></label>
              </div>
            </div>

            <div className="modal-footer">
              <div>
                <button name="close" onClick={() => this.close()}>Close</button>
                <div className="buttonSpacingDiv"></div>
                {requestButtonJsx}
              </div>
              <div>
                {this.state.warningMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//props: webVersion, contactInfo, baseUrl, viewerType, loggedIn, logout(), openLoginPrompt()
class ChartName extends React.Component {
  render() {
    var buttonA;
    var buttonB;

    if (this.props.viewerType=="visitor") {
      if (this.props.loggedIn) {
        buttonA = ''
        buttonB = <button onClick={() => {window.location.href = window.location.protocol + '//' + window.location.host;}}>Your&nbsp;Page</button>
      } else {
        buttonA = <button onClick={() => {window.location.href = window.location.protocol + '//' + window.location.host;}}>New&nbsp;Chart</button>
        buttonB = <button onClick={() => {this.props.openLoginPrompt()}}>Login</button>
      }
    } else if(this.props.viewerType=="owner") {
      if (this.props.loggedIn) {
        buttonB = <button onClick={() => {this.props.logout()}}>Logout</button>
      } else {
        buttonB = <button onClick={() => {this.props.openLoginPrompt()}}>Login</button>
      }
      buttonA = ''
    }

    var buttons = [];
    if (buttonA!='') {
      buttons.push(buttonA);
    }
    if (buttonA!='' && buttonB!='') {
      buttons.push(<div className="buttonSpacingDiv"></div>)
    }
    if (buttonB!='') {
      buttons.push(buttonB);
    }

    return (
      <div className="chartName">
        <div className="titleText">
          <table>
            <tbody>
              <tr>
                <td rowSpan="2" className="theTd"><h1>The</h1></td>
                <td className="ultimateTd"><h2>Ultimate</h2></td>
              </tr>
              <tr>
                <td className="infographTd"><h2>QT Infograph</h2></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="otherInfo">
          <table>
            <tbody>
              <tr>
                <td className="webVersionTd">Site Version:&nbsp;</td>
                <td className="versionNumber">{this.props.webVersion}</td>
              </tr>
              <tr>
                <td className="contactInfoTd">Contact:&nbsp;</td>
                <td className="contactInfo">{this.props.contactInfo}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div style={{height: 5}}>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="buttonTd" colSpan={2}>
                  <div className="cornerButtons">
                    {buttons}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class Target extends React.Component {
  constructor (props) {
    super(props);

    this.json = {};
    this.json[this.props.targetName.toLowerCase()] = {};

    this.retrieve = this.retrieve.bind(this);

    if (this.props.targetName.toLowerCase()!="you" && this.props.targetName.toLowerCase()!="them") {
      throw "Target must be either \'You\' or \'Them\', received: " + this.props.targetName;
    }
  }

  getLoadedJsonForChild(categoryName) {
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

  retrieve(childJson) {
    for (let firstName in childJson) {
      this.json[this.props.targetName.toLowerCase()][firstName] = childJson[firstName];
    }
    this.props.retrieve(this.json);
  }

  render() {
    var onlyInYouCategory = ['More Information'];
    var unfilteredElementMapByCategoryByType = {'Physical': {}, 'Emotional': {}, 'Beliefs': {}, 'Other': {},  'More Information' : {}}; //TODO: category names should be available globally

    //filter out categories not applicable to this target
    var elementMapByCategoryByType = {};
    for (let categoryNameTmp in unfilteredElementMapByCategoryByType) {
      if (this.props.targetName.toLowerCase()=="you" || !(onlyInYouCategory.includes(categoryNameTmp))) {
        elementMapByCategoryByType[categoryNameTmp] = {};
      }
    }

    for (let elementType in this.props.categoryElementMap) {
      for (let categoryName in this.props.categoryElementMap[elementType]) {
        if (this.props.targetName.toLowerCase()=="you" || !(onlyInYouCategory.includes(categoryName))) {
          elementMapByCategoryByType[categoryName][elementType] = this.props.categoryElementMap[elementType][categoryName];
        }
      }
    }

    var categories = [];
    for (var finalCategoryName in elementMapByCategoryByType) {
      categories.push(<Category key={finalCategoryName} targetName={this.props.targetName} categoryName={finalCategoryName} elementMap={elementMapByCategoryByType[finalCategoryName]} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(finalCategoryName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    var targetTitle = <h2><b>{this.props.targetName}</b></h2>
    if (this.props.targetName.toLowerCase()=="you" && this.props.username!='') {
      targetTitle = <h2><b>{this.props.targetName + ': '}</b>{'(' + this.props.username + ')'}</h2>
    }

    return (
      <div className="target">
        <div className="targetName">
          {targetTitle}
        </div>
        <div className="targetBody">
          {categories}
        </div>
      </div>
    );
  }
}

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.json = {};
    this.json[this.props.categoryName.toLowerCase()] = {};

    this.retrieve = this.retrieve.bind(this);

    this.detailsOpen                = true;
    this.categoryDetailsManipulable = true;
  }

  getLoadedJsonForChild(elementName) {
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

  retrieve(childJson) {
    for (let firstName in childJson) {
      this.json[this.props.categoryName.toLowerCase()][firstName] = childJson[firstName];
    }
    this.props.retrieve(this.json);
  }

  static fillGrid(elements) {
    var row = this.fillRow(elements);

    return (
      <div className="multicolorCheckboxes">
        <ReactBootstrap.Grid fluid={true}>
          {row}
        </ReactBootstrap.Grid>
      </div>
    );
  }

  static fillRow(rowElements) {
    return (
      <ReactBootstrap.Row>
        {rowElements}
      </ReactBootstrap.Row>
    );
  }

  static fillColumn(element,identifier,hidden) {
    var displayStyle = 'inline-block';
    if (hidden) {
      displayStyle = 'none';
    }

    if (typeof element!==undefined) { //TODO: figure out if this is necessary
      return (
        <div key={'element-' + identifier} className="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" style={{display: displayStyle}}>
          {element}
        </div>
      );
    }
  }

  nothingSelected() { //returns true immediately on page load
    if (this.loadedJson=={}) {
      for (let categoryName in this.json) {
        for (let elementName in this.json[categoryName]) {
          for (let subelementName in this.json[categoryName][elementName]) {
            if (this.json[categoryName][elementName][subelementName]!='none') {
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

  handleCategoryDetailsOpen(event) {
    if (this.categoryDetailsManipulable) {
      return true;
    } else {
      event.preventDefault();
    }
  }

  render() {
    if (this.props.emptyElementsHidden && this.nothingSelected()) {
      this.categoryDetailsManipulable = false;
      this.detailsOpen                = false;

      //TODO: VERY ugly hack PLS FIX. React refuses to close details tags otherwise.
      var details = Array.from(document.querySelectorAll("details"));
      for (let detailIndex in details) {
        if (details[detailIndex].name==this.props.categoryName.toLowerCase()) {
          details[onlyDetailIndex].removeAttribute("open");
        }
      }
    } else {
      this.categoryDetailsManipulable = true;
      this.detailsOpen                = true; //TODO: should depend on whether the details was previously open
    }

    //TODO: Really ugly and verbose. See if there's not a way to fix this.
    var singleColorYouElements = [];
    for (let numericalSelectBarName in this.props.elementMap['numericalSelectBars']) {
      let properties = this.props.elementMap['numericalSelectBars'][numericalSelectBarName];
      singleColorYouElements.push(<NumericalSelectBar key={numericalSelectBarName} name={numericalSelectBarName} youOrThem={this.props.targetName} maxPossible={properties.max} minPossible={properties.min} numCells={properties.numCells} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(numericalSelectBarName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    for (let singleColorYouCheckboxSetName in this.props.elementMap['singleColorYouCheckboxSets']) {
      let properties = this.props.elementMap['singleColorYouCheckboxSets'][singleColorYouCheckboxSetName];
      singleColorYouElements.push(<SingleColorYouCheckboxSet key={singleColorYouCheckboxSetName} name={singleColorYouCheckboxSetName} youOrThem={this.props.targetName} possibleOptions={properties} parentIsCategory={true} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(singleColorYouCheckboxSetName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    for (let fuzzySelectBarName in this.props.elementMap['fuzzySelectBars']) {
      let properties = this.props.elementMap['fuzzySelectBars'][fuzzySelectBarName];
      singleColorYouElements.push(<FuzzySelectBar key={fuzzySelectBarName} name={fuzzySelectBarName} youOrThem={this.props.targetName} numCells={properties.numCells} leftmostOption={properties.left} rightmostOption={properties.right} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(fuzzySelectBarName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    for (let booleanSelectBarIndex in this.props.elementMap['booleanSelectBars']) {
      singleColorYouElements.push(<BooleanSelectBar key={booleanSelectBarIndex} name={this.props.elementMap['booleanSelectBars'][booleanSelectBarIndex]} youOrThem={this.props.targetName} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(this.props.elementMap['booleanSelectBars'][booleanSelectBarIndex])} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    for (let singleColorYou2DCheckboxSetName in this.props.elementMap['singleColorYou2DCheckboxSets']) {
      let properties = this.props.elementMap['singleColorYou2DCheckboxSets'][singleColorYou2DCheckboxSetName];
      singleColorYouElements.push(<SingleColorYou2DCheckboxSet key={singleColorYou2DCheckboxSetName} name={singleColorYou2DCheckboxSetName} youOrThem={this.props.targetName} cellDimensions={properties.cellDimensions} top={properties.top} bottom={properties.bottom} left={properties.left} right={properties.right} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(singleColorYou2DCheckboxSetName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    var wrappedSingleColorYouElements = Category.fillGrid(singleColorYouElements);

    var bulletListElements = [];
    for (let singleBulletListIndex in this.props.elementMap['singleBulletLists']) {
      let name = this.props.elementMap['singleBulletLists'][singleBulletListIndex];
      bulletListElements.push(<SingleBulletList name={name} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(name)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    for (let bulletListName in this.props.elementMap['bulletLists']) {
      let properties = this.props.elementMap['bulletLists'][bulletListName];
      bulletListElements.push(<BulletList name={bulletListName} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(bulletListName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} maxBullets={properties['maxBullets']} singleBulletList={false} />);
    }

    var wrappedBulletListElements = Category.fillGrid(bulletListElements);

    var multicolorYouElements = [];
    for (let multicolorCheckboxSetName in this.props.elementMap['multicolorCheckboxSets']) {
      let labels = this.props.elementMap['multicolorCheckboxSets'][multicolorCheckboxSetName];
      multicolorYouElements.push(<MulticolorCheckboxSet key={multicolorCheckboxSetName} targetName={this.props.targetName} categoryName={this.props.categoryName} name={multicolorCheckboxSetName} labels={labels} retrieve={this.retrieve}  loadedJson={this.getLoadedJsonForChild(multicolorCheckboxSetName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />); //TODO: change this when MulticolorCheckboxSet becomes an Element subclass
    }

    var nameContents = (
        <summary className="categoryName">
          {this.props.categoryName}
        </summary>
    );

    var bodyContents = (
        <div className="categoryBody">
          {wrappedBulletListElements}
          {wrappedSingleColorYouElements}
          {multicolorYouElements}
        </div>
    );

    return (
      <details className="category" open={this.detailsOpen} onClick={(event) => {this.handleCategoryDetailsOpen(event);}} name={this.props.categoryName.toLowerCase()} >
        {nameContents}
        {bodyContents}
      </details>
    );
  }
}

class MulticolorCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.json = {};
    this.json[this.props.name.toLowerCase()] = {};

    this.retrieve = this.retrieve.bind(this);
  }

  static get numColsXSmall() {return 1;}
  static get numColsSmall()  {return 3;}
  static get numColsMedium() {return 4;}
  static get numColsLarge()  {return 6;}

  getLoadedJsonForChild(checkboxName) {
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

  retrieve(childJson) {
    for (let firstLabel in childJson) {
      this.json[this.props.name.toLowerCase()][firstLabel] = childJson[firstLabel];
    }
    this.props.retrieve(this.json);
  }

  nothingSelected() { //returns true immediately on page load
    //console.log(this.json);
    for (let setName in this.json) {
      for (let checkboxName in this.json[setName]) {
        if (this.json[setName][checkboxName]!='none') {
          return false;
        }
      }
    }

    return true;
  }

  getCheckboxes() {
    this.props.labels.sort();

    var checkboxes = [];
    for (var i=0; i<this.props.labels.length; i++) {
      checkboxes.push(<MulticolorCheckbox key={this.props.labels[i]} targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.labels[i]} pickOneIfYou={false} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(this.props.labels[i])} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    return checkboxes;
  }

  render() {
    var checkboxes     = this.getCheckboxes();
    var gridCheckboxes = Category.fillGrid(checkboxes);

    var displayStyle = 'block';
    if (this.props.emptyElementsHidden && this.nothingSelected()) {
      displayStyle = 'none';
    }

    return (
      <div className="multicolorCheckboxSet">
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col lg={12}>
              <label className="multicolorCheckboxSetName" style={{display: displayStyle}}>{this.props.name}</label>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        {gridCheckboxes}
      </div>
    );
  }
}

class MulticolorCheckbox extends React.Component {
  static colorNames(index) { return(['red','orange','yellow','green','blue','pink'][index]); }

  static get youMulticolorLabels()  { return ['Very Poorly', 'Poorly', 'Fairly Well', 'Accurately', 'Very Accurately']; }
  static get themMulticolorLabels() { return ['Awful', 'Bad', 'Acceptable', 'Good', 'Very Good', 'Perfect']; }

  constructor(props) {
    super(props);

    this.makeSelection = this.makeSelection.bind(this); //ensure callbacks have the proper context
    this.reset         = this.reset.bind(this);

    var descriptors = [];
    var footerInitial;
    var footer;
    if ((this.props.targetName.toLowerCase()=='you' && !this.props.pickOneIfYou) || this.props.targetName.toLowerCase()=='them') {
      if (this.props.targetName.toLowerCase()=='you') { //present all colors except pink
        this.defaultFooter = 'How well does this describe you?';
        descriptors   = MulticolorCheckbox.youMulticolorLabels;
        footerInitial = 'This describes me';
      } else { //present all colors including pink
        this.defaultFooter = 'How important is this in others?';
        descriptors   = MulticolorCheckbox.themMulticolorLabels;
        footerInitial = 'I consider this';
      }
      footer = this.defaultFooter;
    } else {
      throw "Multicolor checkboxes cannot be \'pick one\'.";
    }

    var childColors = [];
    for (var i=0; i<descriptors.length; i++) {
      childColors[i] = MulticolorCheckbox.colorNames(i);
    }

    this.loadedJsonKey = '';

    this.state = {
      footerInitial: footerInitial,
      footer: footer,
      descriptors: descriptors,
      childColors: childColors
    };
  }

  //TODO: should not be dependent on the color of the selected cell; add state
  toJson() { //search childcolors for the black cell
    var colorScoreWithLabel = {};
    for (let i=0;i<this.state.childColors.length;i++) {
      if (this.state.childColors[i]=='black') {
        colorScoreWithLabel[this.props.label.toLowerCase()] = i;
        return colorScoreWithLabel;
      }
    }
    colorScoreWithLabel[this.props.label.toLowerCase()] = 'none';
    return colorScoreWithLabel;
  }

  makeSelection(index) {
    if (!this.props.interactionFrozen) {
      var childColorsTmp = []; //reset the other checkbox choices' colors, and change the color of the new selection
      for (var i=0;i<this.state.childColors.length;i++) {
        childColorsTmp[i] = MulticolorCheckbox.colorNames(i);
      }
      childColorsTmp[index] = 'black';
      this.setState( {footer: this.state.footerInitial + ' ' + this.state.descriptors[index].toLowerCase() + '.', childColors: childColorsTmp} );
    }
  }

  reset() {
    if (!this.props.interactionFroze) {
      var childColorsTmp = [];
      for (var i=0;i<this.state.childColors.length;i++) {
        childColorsTmp[i] = MulticolorCheckbox.colorNames(i);
      }
      this.setState( {footer: this.defaultFooter, childColors: childColorsTmp});
    }
  }

  getCheckboxChoiceColor(index) {
    if (this.props.loadedJson==='none' || this.props.loadedJson==='') {
      return MulticolorCheckbox.colorNames(index);
    } else {
      return MulticolorCheckbox.colorNames(this.props.loadedJson);
    }
  }

  componentWillReceiveProps(nextProps) {

    //if fresh loadedJson is on its way, clear the old contents and replace with the new
    if (nextProps.loadedJson['id']!=this.props.loadedJson['id']) {
      var newColors = [];
      for (var i=0; i<this.state.childColors.length; i++) {
        newColors[i] = MulticolorCheckbox.colorNames(i);
      }

      if (nextProps.loadedJson[nextProps.label.toLowerCase()]!='none') {
        newColors[nextProps.loadedJson[nextProps.label.toLowerCase()]]='black';
      }

      //console.log(nextProps.label.toLowerCase());
      //console.log(newColors);

      this.setState({childColors: newColors});
    }
  }

  render() {
    this.props.retrieve(this.toJson());

    var hidden = false;
    if (this.props.emptyElementsHidden && this.toJson()[Object.keys(this.toJson())[0]]=='none') {
      hidden = true;
    }

    var footerDisplayStyle = 'block';
    if (this.props.interactionFrozen && this.toJson()[Object.keys(this.toJson())[0]]=='none') { //retain flavor text if a selection has been made
      footerDisplayStyle = 'none';
    }

    var choices = [];
    var percentWidth = 100 / this.state.descriptors.length;
    for (let i=0; i<this.state.descriptors.length; i++) {
      var side;
      var text;
      if (i===0) {
        side = 'left';
        text = '-';
      } else if (i==this.state.descriptors.length-1) {
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
      if (this.props.loadedJson['id']!=this.loadedJsonKey) {
        if (this.props.loadedJson[this.props.label.toLowerCase()]==i) {
          color = 'black';
          this.loadedJsonKey=this.props.loadedJson['id'];
        }
      }

      choices.push(<CheckboxChoice key={MulticolorCheckbox.colorNames(i)} targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.label} side={side} colorName={color} text={text} value={i} onClick={this.makeSelection} percentWidth={percentWidth} textHidden={true} hoverText={this.state.descriptors[i]}  interactionFrozen={this.props.interactionFrozen} />);
    }

    //TODO: the extra line breaks here are a hideous kludge
    var contents = (
      <div className="multicolorCheckbox">
        <ElementName name={this.props.label} optionalNotice={false} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={"undo"} />
        {choices}
        <span className="multicolorCheckboxFooter" style={{display: footerDisplayStyle}}>{this.state.footer}</span>
      </div>
    );

    return Category.fillColumn(contents,this.props.label,hidden);
  }
}

class CheckboxChoice extends React.Component {
  render() {
    var extraClasses = 'hoverable';
    if (this.props.interactionFrozen) {
      extraClasses = 'notHoverable';
    }

    return ( //TODO: figure out how to add multiple optional classes
      <label className={'checkboxChoice' + ' ' + this.props.colorName + ' ' + this.props.side + ' ' + extraClasses} style={{width: this.props.percentWidth + "%"}} title={this.props.hoverText}><input type="radio" value={this.props.value} onClick={() => this.props.onClick(this.props.value)} /><span>{this.props.text}</span></label>
    );
  }
}

//props: color, position, text
class ColorSelectChoice extends React.Component {
  render() {
    var activeBorder = '';
    if (this.props.activeBorder) {
      activeBorder = 'activeBorder';
    }

    return (
      <label className={'colorSelectChoice ' + this.props.color + ' ' + this.props.position + ' ' + activeBorder} title={this.props.hoverText}><input type='radio' onClick={() => {this.props.onClick[0](this.props.color); this.props.onClick[1](this.props.color);}} /><span>{this.props.text}</span></label>
    );
  }
}

//props: onClick
class ColorSelectBar extends React.Component {
  static get colors() {return ['red','orange','yellow','green','blue','pink'];}
  static get themLabels() {return ['Awful', 'Bad', 'Acceptable', 'Good', 'Very Good', 'Perfect'];}

  static scoreFromColor(color) {
    for (let i=0;i<ColorSelectBar.colors.length;i++) {
      if (color==ColorSelectBar.colors[i]) {
        return i;
      }
    }

    return 'none';
  }

  static colorFromScore(score) {
    if (score=="none") {
      return "white";
    } else {
      return ColorSelectBar.colors[score];
    }
  }

  constructor(props) {
    super(props);

    this.frameColorSelection = this.frameColorSelection.bind(this);

    this.state = {
      selectedColor: 'none'
    };
  }

  frameColorSelection(color) {
    if (!this.props.interactionFrozen) {
      this.setState({selectedColor: color});
    }
  }

  render() {
    var displayStyle = 'block';
    if (this.props.interactionFrozen) {
      displayStyle = 'none';
    }

    var hasActiveBorder;
    var colorSelectChoices = [];
    for (var i=0;i<ColorSelectBar.colors.length;i++) {
      let position;
      let text;

      if (i===0) {
        position = 'left';
        text = '-';
      } else if (i==ColorSelectBar.colors.length-1) {
        position = 'right';
        text = '+';
      } else {
        position = 'middle';
        text = '';
      }

      if (ColorSelectBar.colors[i]==this.state.selectedColor) {
        hasActiveBorder = true;
      } else {
        hasActiveBorder = false;
      }

      colorSelectChoices.push(<ColorSelectChoice key={ColorSelectBar.colors[i]} color={ColorSelectBar.colors[i]} activeBorder={hasActiveBorder} position={position} text={text} hoverText={ColorSelectBar.themLabels[i]} onClick={[this.props.onClick, this.frameColorSelection]} />);
    }

    return (
      <div className="colorSelectBox" style={{display: displayStyle}}>
        {colorSelectChoices}
      </div>
    );
  }
}

//props: label, color, position, onClick, index
class CheckboxSelectChoice extends React.Component {
  render() {
    var extraClasses = 'hoverable';
    if (this.props.interactionFrozen) {
      extraClasses = 'notHoverable';
    }

    return (
      <div className={'checkboxSelectChoice ' + this.props.color + ' ' + this.props.position + ' ' + extraClasses} onClick={() => this.props.onClick(this.props.index)}><span>{this.props.label}</span></div>
    );
  }
}

//props: possibleOptions, colors
class CheckboxSelectBox extends React.Component {
  render() {
    var selectChoices = [];
    var position;
    for (var i=0;i<this.props.possibleOptions.length;i++) {
      if (i===0) {
        position = 'top';
      } else if (i==this.props.possibleOptions.length-1) {
        position = 'bottom';
      } else {
        position = 'middle';
      }

      selectChoices.push(<CheckboxSelectChoice key={this.props.possibleOptions[i]} label={this.props.possibleOptions[i]} color={this.props.colors[i]} position={position} index={i} onClick={this.props.onClick} interactionFrozen={this.props.interactionFrozen} />);
    }

    return (
      <div className="checkboxSelectBox">
        {selectChoices}
      </div>
    );
  }
}

//props: youOrThem
class SingleColorYouControlsText extends React.Component {
  render() {
    var displayStyle = 'block';
    if (this.props.isHidden) {
      displayStyle = 'none';
    }

    if (this.props.youOrThem.toLowerCase()=="you") {
      return (
        <div className="controlText" style={{display: displayStyle}}><span className="middleControlText">Choose one ↑</span><br /></div>
      );
    } else {
      return (
        <div className="controlText" style={{display: displayStyle}}><span className="leftControlText">↓ Pick</span><span className="rightControlText">Click ↑</span><br /></div>
      );
    }
  }
}

//props: name, interactionFrozen, reset (callback)
class ElementName extends React.Component {
  render() {
    var title = "Mandatory for chart image generation";
    var text  = this.props.name + ':';
    if (this.props.optionalNotice) {
      title = "Optional for chart image generation";

      if (!this.props.interactionFrozen) {
        text  = this.props.name + '* :';
      }
    }

    if (this.props.interactionFrozen) {
      title = '';
    }

    return (
      <div>
        <label className="elementName"><span title={title}><b>{text}</b></span></label>
        <ResetButton resetType={this.props.resetType} reset={this.props.reset} interactionFrozen={this.props.interactionFrozen} />
      </div>
    );
  }
}

//props: interactionFrozen, reset (callback)
class ResetButton extends React.Component {
  render() {
    var displayStyle = 'inline-block';
    if (this.props.interactionFrozen) {
      displayStyle = 'none';
    }

    //TODO: resetButton currently uses a bomb as its icon for 'full resets'-- will probably switch to something else
    //the standard undo symbol doesn't really fit the concept of the 'full reset', which can be interpreted as multiple undo actions
    var title;
    var iconCharacter;
    if (this.props.resetType=="undo") {
      title         = "Reset";
      iconCharacter = '⟲';
    } else if (this.props.resetType=="reset") {
      title         = "Reset All";
      iconCharacter = '💣';
    }

    return (
      <button type="button" name="reset" className="resetButton" style={{display: displayStyle}} onClick={() => {this.props.reset()}} title={title}>{iconCharacter}</button>
    );
  }
}

//props: name, youOrThem, cellDimensions, top, bottom, left, right, retrieve
class SingleColorYou2DCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveColor = this.setActiveColor.bind(this);
    this.getActiveColor = this.getActiveColor.bind(this);

    this.reset = this.reset.bind(this);

    if (this.props.youOrThem.toLowerCase()=="you") {
      this.activeColor = 'green';
    } else {
      this.activeColor = 'white';
    }

    this.optionColors = [];
    for (let j=0; j<this.props.cellDimensions; j++) {
      this.optionColors[j] = [];
      for (let i=0; i<this.props.cellDimensions; i++) {
        this.optionColors[j][i] = 'white';
      }
    }

    this.state = {
      optionColors: this.optionColors
    };
  }

  //TODO: should not be a dependence on 'white'
  toJson() {
    var colorScores = {};
    for (let j=0;j<this.props.cellDimensions;j++) {
      for (let i=0;i<this.props.cellDimensions;i++) {
        if (this.props.youOrThem.toLowerCase()=="them" || ColorSelectBar.scoreFromColor(this.state.optionColors[j][i])!='none') {
          colorScores[i + ',' + (this.props.cellDimensions-j-1)] = ColorSelectBar.scoreFromColor(this.state.optionColors[j][i]); //need to invert rows to index from the bottom left
        }
      }
    }

    var colorScoresWithName = {};
    colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

    return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
  }

  setActiveColor(color) {
    this.activeColor = color;
  }

  //TODO: 'getActiveColor' is a bit of a misnomer, since this function also paints cells
  getActiveColor(colIndex, rowIndex) {
    if (!this.props.interactionFrozen) {
      var newOptionColors = [];
      if (this.props.youOrThem.toLowerCase()=="you") {
        for(let j=0; j<this.props.cellDimensions; j++) {
          newOptionColors[j] = [];
          for(let i=0; i<this.props.cellDimensions; i++) {
            if (i==colIndex && j==rowIndex) {
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
      this.setState({optionColors: newOptionColors});
    }
  }

  reset() {
    if (!this.props.interactionFrozen) {
      var newOptionColors = [];
      for (let j=0; j<this.props.cellDimensions; j++) {
        newOptionColors[j] = [];
        for (let i=0; i<this.props.cellDimensions; i++) {
          newOptionColors[j][i] = 'white';
        }
      }
      this.setState({optionColors: newOptionColors});
    }
  }

  fillTableRow(rowIndex,hoverability) {
    return (
      <tr key={rowIndex}>
        {this.fillTableCols(rowIndex,hoverability)}
      </tr>
    );
  }

  fillTableCols(rowIndex,hoverability) {
    var rowContents = [];

    if (rowIndex===0) {
      rowContents.push(<td key={'left'} rowSpan={this.props.cellDimensions}><span className="leftVerticalText">{this.props.left.replace(/ /g, "\u00a0")}</span></td>);
    }

    //TODO: need to add divs to the table corner cells and hide the cell borders to get rounded corners
    for (let i=0;i<this.props.cellDimensions;i++) {
      var cornerStatus = '';
      if (i===0 && rowIndex===0) {
        cornerStatus = 'topLeft';
      } else if (i===0 && rowIndex===this.props.cellDimensions-1) {
        cornerStatus = 'bottomLeft';
      } else if (i===this.props.cellDimensions-1 && rowIndex===0) {
        cornerStatus = 'topRight';
      } else if (i===this.props.cellDimensions-1 && rowIndex===this.props.cellDimensions-1) {
        cornerStatus = 'bottomRight';
      }

      rowContents.push(
        <td key={i}>
          <div className={"visibleBorder " + this.state.optionColors[rowIndex][i] + ' ' + cornerStatus + ' ' + hoverability} onClick={() => this.getActiveColor(i,rowIndex)}>
            &nbsp;
          </div>
        </td>);
    }

    if (rowIndex===0) {
      rowContents.push(<td key={'right'} rowSpan={this.props.cellDimensions}><span className="rightVerticalText">{this.props.right.replace(/ /g, "\u00a0")}</span></td>); //replace spaces with non-breaking spaces
    }

    return rowContents;
  }

  componentWillReceiveProps(nextProps) {

    //if fresh loadedJson is on its way, clear the old contents and replace with the new
    if (nextProps.loadedJson['id']!=this.props.loadedJson['id']) {
      var newColors = [];
      for (let j=0;j<this.props.cellDimensions;j++) {
        newColors[j] = [];
        for (let i=0;i<this.props.cellDimensions;i++) {
          newColors[j][i] = 'white';
        }
      }

      for (let index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
        let trueIndices = index.split(",");
        newColors[trueIndices[0]][trueIndices[1]] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][index]);
      }

      this.setState({optionColors: newColors});
    }
  }

  render() {
    //console.log(this.props.loadedJson);
    this.props.retrieve(this.toJson());

    var hidden = false;
    if (this.props.emptyElementsHidden) {
      var json = this.toJson()[this.props.name.toLowerCase()];
      hidden = true;
      for (let index in json) {
        if (json[index]!='none') {
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

    var htmlContentsPrefix = (
      <tr key={'top'}>
        <td></td>
        <td colSpan={this.props.cellDimensions} className="topText"><span>{this.props.top}</span></td>
        <td></td>
      </tr>
    );

    var htmlContentsPostfix = (
      <tr key={'bottom'}>
        <td></td>
        <td colSpan={this.props.cellDimensions} className="bottomText"><span>{this.props.bottom}</span></td>
        <td></td>
      </tr>
    );

    tableContentsHtml.push(htmlContentsPrefix);
    for (let i=0;i<this.props.cellDimensions;i++) {
      tableContentsHtml.push(this.fillTableRow(i,hoverability));
    }
    tableContentsHtml.push(htmlContentsPostfix);

    //TODO: DRY
    var contents;
    if (this.props.youOrThem.toLowerCase()=='you') {
      contents = (
        <div className="multicolorCheckbox">
          <ElementName key={this.props.name + '-name'} name={this.props.name} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={"undo"} />
          <table className="twoDCheckbox">
            <tbody>
              {tableContentsHtml}
            </tbody>
          </table>
          <SingleColorYouControlsText key={this.props.youOrThem + '-text'} youOrThem={this.props.youOrThem} isHidden={this.props.interactionFrozen} />
        </div>
      );
    } else {
      contents = (
        <div className="multicolorCheckbox">
          <ElementName key={this.props.name + '-name'} name={this.props.name} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={"reset"} />
          <table className="twoDCheckbox">
            <tbody>
              {tableContentsHtml}
            </tbody>
          </table>
          <SingleColorYouControlsText key={this.props.youOrThem + '-text'} youOrThem={this.props.youOrThem} isHidden={this.props.interactionFrozen} />
          <ColorSelectBar key={'color-select-bar'} onClick={this.setActiveColor} interactionFrozen={this.props.interactionFrozen} />
        </div>
      );
    }

    return Category.fillColumn(contents,this.props.name,hidden);
  }
}

//props: name, youOrThem, possibleOptions, parentIsCategory, retrieve
class SingleColorYouCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveColor = this.setActiveColor.bind(this);
    this.getActiveColor = this.getActiveColor.bind(this);

    this.reset = this.reset.bind(this);

    if (this.props.youOrThem.toLowerCase()=="you") {
      this.activeColor = 'green';
    } else {
      this.activeColor = 'white';
    }

    this.optionColors = [];
    for (let i=0; i<this.props.possibleOptions.length; i++) {
      this.optionColors[i] = 'white';
    }

    this.state = {
      optionColors: this.optionColors
    };
  }

  toDictJson() {
    var colorScores = {};
    var asArray = this.toArrayJson();
    for (let index in asArray) {
      if (this.props.youOrThem.toLowerCase()=="them" || asArray[index]!='none') {
        colorScores[this.props.possibleOptions[index].toLowerCase()] = asArray[index];
      }
    }

    var colorScoresWithName = {};
    colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

    return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
  }

  toArrayJson() {
    var colorScores = [];
    for (let i=0;i<this.props.possibleOptions.length;i++) {
      colorScores[i] = ColorSelectBar.scoreFromColor(this.state.optionColors[i]);
    }
    return colorScores;
  }

  setActiveColor(color) {
    this.activeColor = color;
  }

  getActiveColor(optionIndex) {
    if (!this.props.interactionFrozen) {
      var newOptionColors = [];
      if (this.props.youOrThem.toLowerCase()=="you") {
        for(let i=0; i<this.optionColors.length; i++) {
          if (i==optionIndex) {
            newOptionColors[i] = 'green';
          } else {
            newOptionColors[i] = 'white';
          }
        }
      } else {
        newOptionColors = this.state.optionColors;
        newOptionColors[optionIndex] = this.activeColor;
      }
      this.setState({optionColors: newOptionColors});
    }
  }

  reset() {
    var newOptionColors = [];
    for (let i=0; i<this.optionColors.length; i++) {
      newOptionColors[i] = 'white';
    }
    this.setState({optionColors: newOptionColors});
  }

  componentWillReceiveProps(nextProps) {
    //if fresh loadedJson is on its way, clear the old contents and replace with the new
    if (nextProps.loadedJson['id']!=this.props.loadedJson['id']) {
      var newColors = [];
      for (let i=0;i<this.props.possibleOptions.length;i++) {
        newColors[i] = 'white';
      }

      if (nextProps.loadedJson[nextProps.name.toLowerCase()]) {
        if (nextProps.loadedJson[nextProps.name.toLowerCase()][0]!=undefined) {
          for (let i=0; i<nextProps.possibleOptions.length; i++) {
            newColors[i] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][i]);
          }
        } else {
          for (let index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
            let capitalizedIndex = Chart.capitalize(index);
            if (index=="mtf" || index=="ftm") { //workaround for MTF and FTM
              capitalizedIndex = index.toUpperCase();
            }
            let numericalIndex = nextProps.possibleOptions.indexOf(capitalizedIndex);
            newColors[numericalIndex] = ColorSelectBar.colorFromScore(nextProps.loadedJson[nextProps.name.toLowerCase()][index]);
          }
        }
      }

      this.setState({optionColors: newColors});
    }
  }

  render() {
    if (this.props.parentIsCategory) {
      this.props.retrieve(this.toDictJson()); //update parent with every state change
    } else {
      this.props.retrieve(this.toArrayJson()); //non-category parents will want to use numerical indices
    }

    var hidden = false;
    if (this.props.emptyElementsHidden) {
      var arrayJson = this.toArrayJson();
      hidden = true;
      for (let index in arrayJson) {
        if (arrayJson[index]!='none') {
          hidden = false;
          break;
        }
      }
    }

    var resetType;
    if (this.props.youOrThem.toLowerCase()=="you") {
      resetType = "undo";
    } else {
      resetType = "reset";
    }

    var commonHtml = [];
    commonHtml.push(<ElementName key={this.props.name + '-name'} name={this.props.name} optionalNotice={false} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={resetType} />);
    commonHtml.push(<CheckboxSelectBox key={'select-box'} possibleOptions={this.props.possibleOptions} colors={this.state.optionColors} onClick={this.getActiveColor} interactionFrozen={this.props.interactionFrozen} />);
    commonHtml.push(<SingleColorYouControlsText key={this.props.youOrThem + '-text'} youOrThem={this.props.youOrThem} isHidden={this.props.interactionFrozen} />);

    var contents = '';
    if (this.props.youOrThem.toLowerCase()=="you") {
      contents = (
        <div className="multicolorCheckbox">
          {commonHtml}
        </div>
      );
    } else {
      contents = (
        <div className="multicolorCheckbox">
          {commonHtml}
          <ColorSelectBar key={'color-select-bar'} onClick={this.setActiveColor} interactionFrozen={this.props.interactionFrozen} />
        </div>
      );
    }

    return Category.fillColumn(contents,this.props.name,hidden);
  }
}

//props: name, youOrThem, numCells, rightmostOption, leftmostOption, retrieve
class FuzzySelectBar extends React.Component {
  constructor(props) {
    super(props);

    this.retrieve = this.retrieve.bind(this);
  }

  retrieve(childJson) {
    this.childJson = childJson;
    this.props.retrieve(this.toJson());
  }

  toJson() {
    var colorScores = {};
    for (let i=0;i<this.childJson.length;i++) {
      colorScores[i] = this.childJson[i]; //conversion from array to numerically-indexed object
    }

    var colorScoresWithName = {};
    colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

    return colorScoresWithName; //returns data in a dict of dicts, using the name as the key for the outer dict
  }

  render() {
    var possibleOptions=[];
    for (var i=0; i<this.props.numCells; i++) {
      if (i===0) {
        possibleOptions[i] = this.props.leftmostOption;
      } else if (i==this.props.numCells-1) {
        possibleOptions[i] = this.props.rightmostOption;
      } else { //decide how many up or down arrows are appropriate - use a dash for the center cell
        if (Math.floor(this.props.numCells / 2) > i) { //cells are drawn from the top of the box down
          possibleOptions[i] = '↑'.repeat(Math.floor(this.props.numCells/2)-i);
        } else if (Math.floor(this.props.numCells / 2) < i) {
          possibleOptions[i] = '↓'.repeat(i-Math.floor(this.props.numCells/2));
          if (this.props.numCells % 2 === 0) { //number of down arrows for non-middle cells depends on whether the total number is even or odd
            possibleOptions[i] += '↓';
          }
        } else {
          if (this.props.numCells % 2 === 0) {
            possibleOptions[i] = '↓';
          } else { //we need a special case for the middle cell when there's an odd number of cells
            possibleOptions[i] = '-';
          }
        }
      }
    }

    return (
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} retrieve={this.retrieve} parentIsCategory={false} interactionFrozen={this.props.interactionFrozen} loadedJson={this.props.loadedJson} emptyElementsHidden={this.props.emptyElementsHidden} />
    );
  }
}

//props: name, youOrThem, maxPossible, minPossible, numCells, retrieve
class NumericalSelectBar extends React.Component {
  constructor(props) {
    super(props);

    this.retrieve = this.retrieve.bind(this);
  }

  retrieve(childJson) {
    this.childJson = childJson;
    this.props.retrieve(this.toJson());
  }

  toJson() {
    var colorScores = {};
    for (let i=0;i<this.childJson.length;i++) {
      colorScores[i] = this.childJson[i]; //conversion from array to numerically-indexed object
    }

    var colorScoresWithName = {};
    colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

    return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
  }

  render() {
    var rangePerCell = (this.props.maxPossible-this.props.minPossible+1) / this.props.numCells;

    var possibleOptions=[];
    for (var i=0; i<this.props.numCells;i++) {
      let minOfRange = this.props.minPossible + i * rangePerCell;
      let maxOfRange = minOfRange + rangePerCell - 1;

      if (i===0) { //the user sees '<maxRange++' as the label for the first option
        maxOfRange++;
      }

      if (this.props.name=='Height') { //TODO: Messy, messy, messy.
        minOfRange = Math.floor(minOfRange / 12) + '\'' + minOfRange % 12 + '\"';
        maxOfRange = Math.floor(maxOfRange / 12) + '\'' + maxOfRange % 12 + '\"';
      }

      if (i===0) {
        possibleOptions[i] = '<' + maxOfRange;
      } else if (i==this.props.numCells-1) {
        possibleOptions[i] = minOfRange + '+';
      } else {
        possibleOptions[i] = minOfRange + ' - ' + maxOfRange;
      }
    }

    return (
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} retrieve={this.retrieve} parentIsCategory={false} interactionFrozen={this.props.interactionFrozen} loadedJson={this.props.loadedJson} emptyElementsHidden={this.props.emptyElementsHidden} />
    );
  }
}

//props: name, youOrThem, retrieve
class BooleanSelectBar extends React.Component {
  constructor(props) {
    super(props);

    this.retrieve = this.retrieve.bind(this);
  }

  retrieve(childJson) {
    this.childJson = childJson;
    this.props.retrieve(this.toJson());
  }

  toJson() {
    var colorScores    = {};
    colorScores["no"]  = this.childJson[0];
    colorScores["yes"] = this.childJson[1];

    var colorScoresWithName = {};
    colorScoresWithName[this.props.name.toLowerCase()] = colorScores;

    return colorScoresWithName; //returns data in a dict of dicts, using the name as the only key for the outer dict
  }

  render() {
    var possibleOptions=[];
    possibleOptions[0] = "No";
    possibleOptions[1] = "Yes";

    return (
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} retrieve={this.retrieve} parentIsCategory={false} interactionFrozen={this.props.interactionFrozen} loadedJson={this.props.loadedJson} emptyElementsHidden={this.props.emptyElementsHidden} />
    );
  }
}

//props: name, interactionFrozen, emptyElementsHidden, retrieve (callback)
class BulletList extends React.Component {
  constructor(props) {
    super(props);

    this.retrieve = this.retrieve.bind(this);
    this.reset    = this.reset.bind(this);

    this.closeBullet = this.closeBullet.bind(this);
    this.newBullet   = this.newBullet.bind(this);

    //two sets of component keys -- used for forcing re-mounts
    this.keysA = [];
    this.keysB = [];
    for (let i=0;i<this.props.maxBullets;i++) {
      this.keysA[i] = i;
      this.keysB[i] = i+this.props.maxBullets;
    }

    this.currentKeySet = 'A';
    this.keySet        = this.keysA;

    var bulletContents = [];
    if (this.props.singleBulletList) {
      bulletContents[0] = '';
    }

    //feed the parent an empty list to start off with
    var bulletListJson = {};
    bulletListJson[this.props.name.toLowerCase()] = [''];
    this.props.retrieve(bulletListJson);

    this.state = {
      bulletContents: bulletContents
    };
  }

  newBullet() {
    if (this.state.bulletContents.length<this.props.maxBullets) { //limit the maximum number of bullets to prevent abuse
      var tmpContents = [];
      for (let i=0;i<this.state.bulletContents.length;i++) {
        tmpContents.push(this.state.bulletContents[i]);
      }
      tmpContents.push('');
      this.setState({bulletContents: tmpContents});
    }
  }

  closeBullet(index) {
    var tmpContents = [];
    for (let i=0;i<this.state.bulletContents.length;i++) {
      if (i!=index) {
        //console.log(i);
        tmpContents.push(this.state.bulletContents[i]);
      }
    }
    this.justClosedBullet = true; //used for forcing remount
    this.setState({bulletContents: tmpContents});
  }

  retrieve(index,event) {
    var tmpContents = [];
    for (let i=0;i<this.state.bulletContents.length;i++) {
      tmpContents.push(this.state.bulletContents[i]);
    }
    tmpContents[index] = event.target.value;

    this.setState({bulletContents: tmpContents});

    var bulletListJson = {};
    bulletListJson[this.props.name.toLowerCase()] = tmpContents;
    this.props.retrieve(bulletListJson);
  }

  reset() {
    if (this.props.singleBulletList) {
      this.setState({bulletContents: ['']});
    } else {
      this.setState({bulletContents: []});
    }
    this.justResetBullet = true; //this also requires a re-mount
  }

  isEmpty() {
    if (this.state.bulletContents.length==0) {
      return true;
    } else if (this.state.bulletContents.length==1) {
      return this.state.bulletContents[0]=="";
    }
  }

  componentWillReceiveProps(nextProps) {
    //if fresh loadedJson is on its way, clear the old contents and replace with the new
    if (nextProps.loadedJson['id']!=this.props.loadedJson['id']) {
      var bulletContents = [];

      if (typeof nextProps.loadedJson[nextProps.name.toLowerCase()] === "string" || nextProps.loadedJson[nextProps.name.toLowerCase()] instanceof String) {
        bulletContents[0] = nextProps.loadedJson[nextProps.name.toLowerCase()];
      } else {
        for (let index in nextProps.loadedJson[nextProps.name.toLowerCase()]) {
          bulletContents[index] = nextProps.loadedJson[nextProps.name.toLowerCase()][index];
        }
      }

      this.setState({bulletContents: bulletContents});
    }
  }

  render() {
    //ugly hack to force remount only after closing bullet (by switching to a new set of keys)
    if (this.justClosedBullet || this.justResetBullet) {
      if (this.currentKeySet=='A') {
        this.keySet = this.keysB;
        this.currentKeySet = 'B';
      } else {
        this.keySet = this.keysA;
        this.currentKeySet = 'A';
      }
    }
    this.justClosedBullet = false;
    this.justResetBullet  = false;

    var bulletSetAndNewBulletButton = [];
    for (let i=0; i<this.state.bulletContents.length; i++) {
      var isEmpty = false;
      if (this.state.bulletContents[i]=='') {
        isEmpty = true;
      }

      bulletSetAndNewBulletButton.push(<Bullet key={this.keySet[i]} preloadedContents={this.state.bulletContents[i]} retrieve={this.retrieve} closeBullet={this.closeBullet} index={i} interactionFrozen={this.props.interactionFrozen} singleBulletList={this.props.singleBulletList} isEmpty={isEmpty} />);
    }

    //add a little space between the bullet points and the new bullet button
    if (this.state.bulletContents.length!=0 && this.state.bulletContents.length!=this.props.maxBullets) {
      bulletSetAndNewBulletButton.push(<div style={{height: 7}}></div>);
    }

    //console.log(this.state.bulletContents.length);
    //console.log(this.props.maxBullets);
    if (this.state.bulletContents.length<this.props.maxBullets) {
      bulletSetAndNewBulletButton.push(<NewBulletButton name={this.props.name} maxBullets={this.props.maxBullets} newBullet={this.newBullet} interactionFrozen={this.props.interactionFrozen} />);
    }

    var hidden = false;
    if (this.props.emptyElementsHidden && this.isEmpty()) {
      hidden = true;
    }

    var resetType = "reset";
    if (this.props.singleBulletList) {
      resetType = "undo";
    }

    var contents = (
      <div className="multicolorCheckbox">
        <div className="bulletList">
          <ElementName optionalNotice={true} key={this.props.name + '-name'} name={this.props.name} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={resetType} />
          {bulletSetAndNewBulletButton}
        </div>
      </div>
    );

    return Category.fillColumn(contents,this.props.name,hidden);
  }
}

//does nothing exciting at the moment
class SingleBulletList extends React.Component {
  constructor(props) {
    super(props);

    this.retrieve = this.retrieve.bind(this);
  }

  retrieve(childJson) {
    var singleBulletListJson = {};
    singleBulletListJson[this.props.name.toLowerCase()] = childJson[this.props.name.toLowerCase()][0];
    this.props.retrieve(singleBulletListJson);
  }

  render() {
    //console.log(this.props.loadedJson);

    return (
      <BulletList name={this.props.name} retrieve={this.retrieve} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} maxBullets={1} singleBulletList={true} loadedJson={this.props.loadedJson} />
    );
  }
}

//props: preloadedContents, index, closeBullet (callback), retrieve (callback)
class Bullet extends React.Component {
  render() {
    var displayStyle = 'inline-block';
    if (this.props.interactionFrozen && this.props.isEmpty) {
      displayStyle = 'none';
    }

    var contents = [];
    contents.push(<span>•&nbsp;</span>);
    contents.push(<BulletEntryBox retrieve={this.props.retrieve} index={this.props.index} preloadedContents={this.props.preloadedContents} interactionFrozen={this.props.interactionFrozen} singleBulletList={this.props.singleBulletList} />);

    if (!this.props.singleBulletList) {
      contents.push(<CloseBulletButton closeBullet={this.props.closeBullet} index={this.props.index} interactionFrozen={this.props.interactionFrozen} />);
    }

    return (
      <div className="bullet" style={{display: displayStyle}}>
        {contents}
      </div>
    );
  }
}

class BulletEntryBox extends React.Component {
  static get maxLength() { return 20; }

  render() {
    return (
      <div className="bulletEntry">
        <input type="text" defaultValue={this.props.preloadedContents} disabled={this.props.interactionFrozen} onBlur={(event) => {this.props.retrieve(this.props.index, event)}} maxLength={BulletEntryBox.maxLength} />
      </div>
    );
  }
}

//props: index, closeBullet (callback)
class CloseBulletButton extends React.Component {
  //closeBullet triggers a re-render at the BulletList level
  render() {
    var displayStyle = 'block';
    if (this.props.interactionFrozen) {
      displayStyle = 'none';
    }

    return (
      <button className="closeBulletButton" style={{display: displayStyle}} onClick={() => {this.props.closeBullet(this.props.index)}} >X</button>
    );
  }
}

//props: name, maxBullets
class NewBulletButton extends React.Component {
  render() {
    var displayStyle = 'block';
    if (this.props.interactionFrozen) {
      displayStyle = 'none';
    }

    return (
      <button className="newBulletButton" style={{display: displayStyle}} onClick={() => this.props.newBullet()}>{('More ' + this.props.name.toLowerCase() + ' (up to ' + this.props.maxBullets + ')').replace(/ /g, "\u00a0")}</button>
    );
  }
}

ReactDOM.render(
  <Chart />,
  document.getElementById('root')
);
