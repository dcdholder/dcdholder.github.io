/*jshint esversion: 6*/
/*jshint sub:true*/
/* jshint loopfunc: true */

class Chart extends React.Component {
  constructor (props) { //TODO: change this to a yaml parser when you're done testing out the basic UI
    super(props);

    this.json = {};

    this.retrieve = this.retrieve.bind(this);

    this.tagLine = "The Ultimate QT Infograph";
    this.webVersion  = "1.0";
    this.chartVersion = "3.0";

    this.requestChartImage = this.requestChartImage.bind(this);

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

    this.bulletListMap = { 'Other': {'Contact Info': {'maxBullets': 3}}}

    this.categoryElementMap = {
      'singleColorYouCheckboxSets':   this.categorySingleColorYouCheckboxMap,
      'multicolorCheckboxSets':       this.categoryMulticolorCheckboxMap,
      'booleanSelectBars':            this.categoryBooleanBarMap,
      'numericalSelectBars':          this.categoryNumericalBarMap,
      'fuzzySelectBars':              this.categoryFuzzyBarMap,
      'singleColorYou2DCheckboxSets': this.categorySingleColorYou2DCheckboxMap,
      'bulletLists':                  this.bulletListMap
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
  }

  //static get restServerDomain() { return 'http://127.0.0.1:5000/'; }
  static get restServerDomain() { return 'http://Hollerache.pythonanywhere.com/'; }
  static get defaultGenerateButtonText() { return 'Download'; }
  static get generateAnimationTick() {return 1000; }

  loadInJson(json) {
    this.setState({ loadedJson: json });
  }

  getLoadedJsonForChild(targetName) {
    if (targetName.toLowerCase() in this.state.loadedJson) {
      return this.state.loadedJson[targetName.toLowerCase()];
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
          for (let subelementName in this.json[targetName][categoryName][elementName]) {
            if (this.json[targetName][categoryName][elementName][subelementName]!='none') {
              nonNoneElementExists = true;
            } else {
              noneElementExists = true;
            }
          }

          //whether 'you' or 'them', ever MC CB in the set should be filled out
          if (this.capitalize(categoryName) in this.categoryMulticolorCheckboxMap) {
            if (this.capitalize(elementName) in this.categoryMulticolorCheckboxMap[this.capitalize(categoryName)]) {
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

  imageRequestUri() {
    return Chart.restServerDomain + 'new';
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
        this.setState({errorMessage: 'Missing field in \'' + this.capitalize(elementName) + '\' under \'' + this.capitalize(targetName) + '\' → \'' + this.capitalize(categoryName) + '\'', errorMessageDisplayMode: 'on'});
        return;
      }
    }
  }

  showFailedRequestWarning() {
    this.setState({errorMessage: 'Server error, try again later.', errorMessageDisplayMode: 'on'});
    window.scrollTo(0,document.body.scrollHeight);
  }

  capitalize(string) {
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

    if (!this.noMissingElements()) {
      this.showEmptyFieldWarning();
      return;
    }

    var httpRequest = new XMLHttpRequest();

    //console.log(this.jsonFrontend2BackendRepresentation());
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
    httpRequest.open('POST', this.imageRequestUri(), true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.responseType = "blob";

    var that = this;
    that.allowDownloadClick = false;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
        var imageBlob = new Blob([httpRequest.response], {type: 'application/octet-stream'});
        that.hideGenerateWaitAnimation();
        that.allowDownloadClick = true;
        saveAs(imageBlob, "chart.png");
      } else if (httpRequest.status>=400) { //something went wrong
        //console.log('Failed response.');
        that.showFailedRequestWarning();
        that.hideGenerateWaitAnimation();
        that.allowDownloadClick = true;
      }
    };
    httpRequest.onerror = function() {
      that.showFailedRequestWarning();
      that.hideGenerateWaitAnimation();
      that.allowDownloadClick = true;
    };
    //httpRequest.withCredentials = true;//TODO: might need this later (for when I'm using sessions)
    httpRequest.send(JSON.stringify(this.jsonFrontend2BackendRepresentation()));
  }

  render() {
    var targets = [];
    var possibleTargets = ["You","Them"];
    for (let i=0;i<possibleTargets.length;i++) {
      targets.push(<Target key={possibleTargets[i]} targetName={possibleTargets[i]} categoryElementMap={this.categoryElementMap} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(possibleTargets[i])} interactionFrozen={this.state.interactionFrozen} emptyElementsHidden={this.state.emptyElementsHidden} />);
    }

    return (
      <div className="chart fillSmallScreen">
        <ChartName webVersion={this.webVersion} chartVersion={this.chartVersion}/>
        {targets}
        <div className="chartFooter">
          <div className="footerButtons">
            <button type="button" name="download" onClick={this.requestChartImage}>{this.state['generateButtonText']}</button>
            <button type="button" name="freezeUnfreeze" onClick={() => {this.setState({interactionFrozen: !this.state.interactionFrozen})}}>Freezer</button>
            <button type="button" name="hideUnhide" onClick={() => {this.setState({emptyElementsHidden: !this.state.emptyElementsHidden})}}>Hider</button>
          </div>
          <div className={'errorMessage ' + this.state.errorMessageDisplayMode}>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
}

class ChartName extends React.Component {
  render() {
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
        <div className="versionInfo">
          <table>
            <tbody>
              <tr>
                <td className="paddingTd">&nbsp;</td>
              </tr>
              <tr>
                <td className="webVersionTd">Web Version: {this.props.webVersion}</td>
              </tr>
              <tr>
                <td className="chartVersionTd">Chart Version: {this.props.chartVersion}</td>
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
    if (categoryName.toLowerCase() in this.props.loadedJson) {
      return this.props.loadedJson[categoryName.toLowerCase()];
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
    var elementMapByCategoryByType = {'Physical': {}, 'Emotional': {}, 'Beliefs': {}, 'Other': {}}; //TODO: category names should be available globally
    for (let elementType in this.props.categoryElementMap) {
      for (let categoryName in this.props.categoryElementMap[elementType]) {
        elementMapByCategoryByType[categoryName][elementType] = this.props.categoryElementMap[elementType][categoryName];
      }
    }

    var categories = [];
    for (var finalCategoryName in elementMapByCategoryByType) {
      categories.push(<Category key={finalCategoryName} targetName={this.props.targetName} categoryName={finalCategoryName} elementMap={elementMapByCategoryByType[finalCategoryName]} retrieve={this.retrieve} loadedJson={this.getLoadedJsonForChild(finalCategoryName)} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

    return (
      <div className="target">
        <div className="targetName">
          <h2><b>{this.props.targetName}</b></h2>
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
    if (elementName.toLowerCase() in this.props.loadedJson) {
      return this.props.loadedJson[elementName.toLowerCase()];
    } else {
      return [];
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
      this.detailsOpen = this.detailsPreviouslyOpen
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
    for (let bulletListName in this.props.elementMap['bulletLists']) {
      let properties = this.props.elementMap['bulletLists'][bulletListName];
      bulletListElements.push(<BulletList name={bulletListName} retrieve={this.retrieve} interactionFrozen={this.props.interactionFrozen} emptyElementsHidden={this.props.emptyElementsHidden} />);
    }

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
          {bulletListElements}
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
    if (checkboxName.toLowerCase() in this.props.loadedJson) {
      return this.props.loadedJson[checkboxName.toLowerCase()];
    } else {
      return '';
    }
  }

  retrieve(childJson) {
    for (let firstLabel in childJson) {
      this.json[this.props.name.toLowerCase()][firstLabel] = childJson[firstLabel];
    }
    this.props.retrieve(this.json);
  }

  nothingSelected() { //returns true immediately on page load
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
    for (var i=0; i<this.state.descriptors.length; i++) {
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

      choices.push(<CheckboxChoice key={MulticolorCheckbox.colorNames(i)} targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.label} side={side} colorName={this.state.childColors[i]} text={text} value={i} onClick={this.makeSelection} percentWidth={percentWidth} textHidden={true} hoverText={this.state.descriptors[i]}  loadedJson={this.props.loadedJson[i]} interactionFrozen={this.props.interactionFrozen} />);
    }

    //TODO: the extra line breaks here are a hideous kludge
    var contents = (
      <div className="multicolorCheckbox">
        <ElementName name={this.props.label} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={"undo"} />
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
    return (
      <div>
        <label className="elementName"><span><b>{this.props.name + ':'}</b></span></label>
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
        colorScores[i + ',' + (this.props.cellDimensions-j-1)] = ColorSelectBar.scoreFromColor(this.state.optionColors[j][i]); //need to invert rows to index from the bottom left
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

  render() {
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
      colorScores[this.props.possibleOptions[index].toLowerCase()] = asArray[index];
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
    commonHtml.push(<ElementName key={this.props.name + '-name'} name={this.props.name} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={resetType} />);
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
    for (let i=0;i<BulletList.maxBullets;i++) {
      this.keysA[i] = i;
      this.keysB[i] = i+BulletList.maxBullets;
    }

    this.currentKeySet = 'A';
    this.keySet        = this.keysA;

    this.state = {
      bulletContents: []
    };
  }

  static get maxBullets() { return 3; };

  newBullet() {
    if (this.state.bulletContents.length<BulletList.maxBullets) { //limit the maximum number of bullets to prevent abuse
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
  }

  reset() {
    this.setState({bulletContents: []});
  }

  isEmpty() {
    return this.state.bulletContents==[];
  }

  render() {
    //ugly hack to force remount only after closing bullet (by switching to a new set of keys)
    if (this.justClosedBullet) {
      if (this.currentKeySet=='A') {
        this.keySet = this.keysB;
        this.currentKeySet = 'B';
      } else {
        this.keySet = this.keysA;
        this.currentKeySet = 'A';
      }
    }
    this.justClosedBullet = false;

    var bulletSetAndNewBulletButton = [];
    for (let i=0; i<this.state.bulletContents.length; i++) {
      bulletSetAndNewBulletButton.push(<Bullet key={this.keySet[i]} preloadedContents={this.state.bulletContents[i]} retrieve={this.retrieve} closeBullet={this.closeBullet} index={i} interactionFrozen={this.props.interactionFrozen} />);
    }

    //add a little space between the bullet points and the new bullet button
    if (this.state.bulletContents.length!=0 && this.state.bulletContents.length!=BulletList.maxBullets) {
      bulletSetAndNewBulletButton.push(<div style={{height: 7}}></div>);
    }

    //console.log(this.state.bulletContents.length);
    //console.log(BulletList.maxBullets);
    if (this.state.bulletContents.length<BulletList.maxBullets) {
      bulletSetAndNewBulletButton.push(<NewBulletButton name={this.props.name} maxBullets={BulletList.maxBullets} newBullet={this.newBullet} interactionFrozen={this.props.interactionFrozen} />);
    }

    var hidden = false;
    if (this.props.emptyElementsHidden && this.isEmpty()) {
      hidden = true;
    }

    var contents = (
      <div className="multicolorCheckbox">
        <div className="bulletList">
          <ElementName key={this.props.name + '-name'} name={this.props.name} interactionFrozen={this.props.interactionFrozen} reset={this.reset} resetType={"reset"} />
          {bulletSetAndNewBulletButton}
        </div>
      </div>
    );

    return Category.fillColumn(contents,this.props.name,hidden);
  }
}

//props: preloadedContents, index, closeBullet (callback), retrieve (callback)
class Bullet extends React.Component {
  render() {
    var displayStyle = 'block';
    if (this.props.interactionFrozen) {
      displayStyle = 'none';
    }

    return (
      <div className="bullet">
        <span>•&nbsp;</span>
        <BulletEntryBox retrieve={this.props.retrieve} index={this.props.index} preloadedContents={this.props.preloadedContents} interactionFrozen={this.props.interactionFrozen} />
        <CloseBulletButton closeBullet={this.props.closeBullet} index={this.props.index} interactionFrozen={this.props.interactionFrozen} />
      </div>
    );
  }
}

class BulletEntryBox extends React.Component {
  render() {
    return (
      <div className="bulletEntry">
        <input type="text" defaultValue={this.props.preloadedContents} disabled={this.props.interactionFrozen} onBlur={(event) => {this.props.retrieve(this.props.index, event)}} />
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
