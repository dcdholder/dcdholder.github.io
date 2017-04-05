/*jshint esversion: 6*/
/*jshint sub:true*/

class Chart extends React.Component {
  constructor (props) { //TODO: change this to a yaml parser when you're done testing out the basic UI
    super(props);

    this.tagLine = "The Ultimate QT Infograph";
    this.edition = "ENTERPRISE EDITION";
    this.siteVersion  = "V0.0";
    this.chartVersion = "Chart Version: 3";

    this.requestChartImage = this.requestChartImage.bind(this);

    //TODO: I'm planning on rolling the field format generation into the back-end, these hard-coded lists will disappear
    this.categoryMulticolorCheckboxMap = {'Emotional': {'Quirks':
      ['Adventurous','Ambitious','Analytical','Artistic','Assertive', 'Athletic', 'Confident', 'Creative',
       'Cutesy', 'Cynical', 'Easy-going', 'Empathetic', 'Energetic', 'Honest', 'Humorous', 'Hygienic',
       'Intelligent', 'Kind', 'Lazy', 'Loud', 'Materialistic', 'Messy', 'Outdoorsy', 'Passionate',
       'Reliable', 'Resourceful', 'Romantic', 'Serious', 'Sexual', 'Social', 'Talkative', 'Wise']
    }};

    this.categorySingleColorYouCheckboxMap = {'Physical': {'Gender': ['Male', 'Female', 'MTF', 'FTM'],
      'Race': ['White', 'Asian', 'Latin', 'Arab', 'Jewish', 'Black', 'Other'],
      'Body Type': ['Fit', 'Skinny', 'Thin', 'Medium', 'Chubby', 'Fat'],
      'Facial Hair': ['None','Moustache','Goatee','Stubble','Beard','Wizard'],
      'Hair Style': ['Bald', 'Short', 'Medium', 'Long', 'Very Long'],
      'Hair Color': ['Black', 'Brown', 'Gold', 'Blonde', 'Ginger', 'Other']},
      'Beliefs': {'Religion': ['Christian', 'Muslim', 'Jew', 'Pagan', 'Satanist', 'Deist', 'Polydeist', 'Agnostic', 'Atheist', 'Other']
    }};

    this.categoryBooleanBarMap = {'Physical': ['Piercings', 'Tattoos']};

    this.categoryNumericalBarMap = {'Physical': {'Age': {'min': 16, 'max': 31, 'numCells': 8}, 'Height': {'min': 57, 'max': 76, 'numCells': 10}}};

    this.categoryFuzzyBarMap = {'Emotional': {'Introverted': {'numCells': 10, 'left': 'Introverted', 'right': 'Extroverted'},
      'Theoretical': {'numCells': 10, 'left': 'Theoretical', 'right': 'Practical'},
      'Logical': {'numCells': 10, 'left': 'Logical', 'right': 'Emotional'},
      'Structured': {'numCells': 10, 'left': 'Structured', 'right': 'Spontaneous'}},
      'Beliefs': {'Religious Devotion': {'numCells': 5, 'left': 'Low', 'right': 'High'},
      'Political Views': {'numCells': 7, 'left': 'Libertarian', 'right': 'Authoritarian'},
      'Social Views': {'numCells': 7, 'left': 'Progressive', 'right': 'Conservative'}},
      'Other': {'Alchohol': {'numCells':3, 'left': 'Never', 'right': 'Frequently'},
      'Tobacco': {'numCells':3, 'left': 'Never', 'right': 'Frequently'},
      'Other Drugs': {'numCells':3, 'left': 'Never', 'right': 'Frequently'}}
    };

    this.categoryElementMap = {
      'singleColorYouCheckboxSets': this.categorySingleColorYouCheckboxMap,
      'multicolorCheckboxSets':     this.categoryMulticolorCheckboxMap,
      'booleanSelectBars':          this.categoryBooleanBarMap,
      'numericalSelectBars':        this.categoryNumericalBarMap,
      'fuzzySelectBars':            this.categoryFuzzyBarMap
    };

    this.targets = [];
    var possibleTargets = ["You","Them"];
    for (var i=0;i<possibleTargets.length;i++) {
      this.targets.push(<Target key={possibleTargets[i]} targetName={possibleTargets[i]} categoryElementMap={this.categoryElementMap} />);
    }

    this.state = {
      generateButtonText: 'Download',
      errorMessage: ''
    };
  }

  static get restServerDomain() { return 'http://hollerache.pythonanywhere.com/new'; }
  static get defaultGenerateButtonText() { return 'Download'; }
  static get generateAnimationTick() {return 250; }

  //TODO: this needs to be updated to work with multiple element types -- some of which behave differently depending on whether it's 'You' or 'Them'
  getNameValuePairs() {
    var selections = {};
    selections['emotional'] = {};
    selections['emotional']['quirks'] = {};
    selections['emotional']['quirks']['you'] = {};
    selections['emotional']['quirks']['them'] = {};
    for (var labelIndex in this.categoryMulticolorCheckboxMap['Emotional']['Quirks']) { //TODO: ditch this nasty short-term hack for a solution which covers all categories and image elements
      var label = this.categoryMulticolorCheckboxMap['Emotional']['Quirks'][labelIndex];
      for (var targetIndex in ["you","them"]) {
        var targetName = ["you","them"][targetIndex];
        try {
          selections['emotional']['quirks'][targetName][label.toLowerCase()] = document.querySelector('input[name="' + 'emotional-quirks-' + targetName + '-' + label.toLowerCase() + '"]:checked').value;
        } catch (TypeError) {
          throw "Missed a multicolored checkbox: " + label.toLowerCase();
        }
      }
    }

    return selections;
  }

  allFieldsSelected() {
    try {
      getNameValuePairs();
    } catch (error) {
      return false;
    }
    return true;
  }

  restRequestUri() {
    var nameValuePairs       = this.getNameValuePairs();
    var nameValuePairsString = encodeURIComponent(JSON.stringify(nameValuePairs));
    var paramsUri            = '?chartdata=' + nameValuePairsString;

    var fullUri = Chart.restServerDomain + paramsUri;

    return fullUri;

    //return 'http://hollerache.pythonanywhere.com/new?chartdata=%7B%22emotional%22%3A%7B%22quirks%22%3A%7B%22you%22%3A%7B%22adventurous%22%3A%221%22%2C%22ambitious%22%3A%221%22%2C%22analytical%22%3A%222%22%2C%22artistic%22%3A%223%22%2C%22assertive%22%3A%224%22%7D%2C%22them%22%3A%7B%22reliable%22%3A%220%22%2C%22Resourceful%22%3A%221%22%2C%22romantic%22%3A%222%22%2C%22serious%22%3A%223%22%2C%22sexual%22%3A%222%22%2C%22social%22%3A%225%22%7D%7D%7D%7D'
  }

  showGenerateWaitAnimation() {
    this.setState({generateButtonText: 'Generating'});

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
  }

  hideGenerateWaitAnimation() {
    if (this.generationAnimationTimer!==null) {
      clearInterval(this.generationAnimationTimer);
    }

    this.setState({generateButtonText: Chart.defaultGenerateButtonText});
  }

  showEmptyFieldWarning() {
    this.setState({errorMessage: 'You have one or more empty fields.'});
  }

  showRequestErrorWarning() {
    this.setState({errorMessage: 'The server must be busy. Try again later.'});
  }

  hideProcessingErrorWarning() {
    this.setState({errorMessage: ''});
  }

  requestChartImage() {
    var restUri     = this.restRequestUri();
    var httpRequest = new XMLHttpRequest();

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
    httpRequest.open('GET', restUri, true);
    httpRequest.responseType = "blob";

    var that = this;
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
        var imageBlob = new Blob([httpRequest.response], {type: 'application/octet-stream'});
        that.hideGenerateWaitAnimation();
        saveAs(imageBlob, "chart.png");
      } else if (httpRequest.status>=400) { //something went wrong
        //console.log('Failed response.');
        that.hideGenerateWaitAnimation();
      }
    };
    httpRequest.send();
  }

  render() {
    var errorMessageDisplayMode;
    if (this.state.errorMessage==='') {
      errorMessageDisplayMode = 'none';
    } else {
      errorMessageDisplayMode = 'block';
    }

    return (
      <div className="chart" style={{'width': '98%', 'margin': 'auto'}}>
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col>
              <div className="chartName">
                <h1 style={{'textAlign': 'center'}}>{this.tagLine}</h1>
                <h4 style={{'textAlign': 'center'}}>{this.edition} <b>{this.siteVersion}</b></h4>
                <h5 style={{'textAlign': 'center'}}>{this.chartVersion}</h5>
              </div>
              {this.targets}
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col md={3}>
              <br />
              <button type="button" name="download" onClick={this.requestChartImage}>{this.state['generateButtonText']}</button>
              <br />
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
      </div>
    );
  }
}

class Target extends React.Component {
  constructor (props) {
    super(props);

    if (this.props.targetName.toLowerCase()!="you" && this.props.targetName.toLowerCase()!="them") {
      throw "Target must be either \'You\' or \'Them\', received: " + this.props.targetName;
    }
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
      categories.push(<Category targetName={this.props.targetName} categoryName={finalCategoryName} elementMap={elementMapByCategoryByType[finalCategoryName]} />);
    }

    return (
      <div className="target">
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col>
              <div className="targetName">
                <h2><b>{this.props.targetName}</b></h2>
              </div>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        {categories}
      </div>
    );
  }
}

class Category extends React.Component {
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
    var cols = [];
    for(var i=0;i<rowElements.length;i++) {
      cols.push(this.fillColumn(rowElements[i]));
    }

    return (
      <ReactBootstrap.Row>
        {cols}
      </ReactBootstrap.Row>
    );
  }

  static fillColumn(element) {
    if (typeof element!==undefined) { //TODO: figure out if this is necessary
      return (
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          {element}
        </div>
      );
    }
  }

  render() {
    //TODO: Really ugly and verbose. See if there's not a way to fix this.
    var singleColorYouElements = [];
    for (let numericalSelectBarName in this.props.elementMap['numericalSelectBars']) {
      let properties = this.props.elementMap['numericalSelectBars'][numericalSelectBarName];
      singleColorYouElements.push(<NumericalSelectBar name={numericalSelectBarName} youOrThem={this.props.targetName} maxPossible={properties.max} minPossible={properties.min} numCells={properties.numCells} />);
    }

    for (let singleColorYouCheckboxSetName in this.props.elementMap['singleColorYouCheckboxSets']) {
      let properties = this.props.elementMap['singleColorYouCheckboxSets'][singleColorYouCheckboxSetName];
      singleColorYouElements.push(<SingleColorYouCheckboxSet name={singleColorYouCheckboxSetName} youOrThem={this.props.targetName} possibleOptions={properties} />);
    }

    for (let fuzzySelectBarName in this.props.elementMap['fuzzySelectBars']) {
      let properties = this.props.elementMap['fuzzySelectBars'][fuzzySelectBarName];
      singleColorYouElements.push(<FuzzySelectBar name={fuzzySelectBarName} youOrThem={this.props.targetName} numCells={properties.numCells} leftmostOption={properties.left} rightmostOption={properties.right} />);
    }

    for (let booleanSelectBarIndex in this.props.elementMap['booleanSelectBars']) {
      singleColorYouElements.push(<BooleanSelectBar name={this.props.elementMap['booleanSelectBars'][booleanSelectBarIndex]} youOrThem={this.props.targetName} />);
    }

    var wrappedSingleColorYouElements = Category.fillGrid(singleColorYouElements);

    var multicolorYouElements = [];
    for (let multicolorCheckboxSetName in this.props.elementMap['multicolorCheckboxSets']) {
      let labels = this.props.elementMap['multicolorCheckboxSets'][multicolorCheckboxSetName];
      multicolorYouElements.push(<MulticolorCheckboxSet targetName={this.props.targetName} categoryName={this.props.categoryName} name={multicolorCheckboxSetName} labels={labels} />); //TODO: change this when MulticolorCheckboxSet becomes an Element subclass
    }

    return (
      <div className="category">
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col>
              <div className="categoryName">
                <h3><b>{this.props.categoryName}</b></h3>
              </div>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        {wrappedSingleColorYouElements}
        {multicolorYouElements}
      </div>
    );
  }
}

class MulticolorCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.checkboxes     = this.getCheckboxes();
    this.gridCheckboxes = Category.fillGrid(this.checkboxes);
  }

  static get numColsXSmall() {return 1;}
  static get numColsSmall()  {return 3;}
  static get numColsMedium() {return 4;}
  static get numColsLarge()  {return 6;}

  getCheckboxes() {
    this.props.labels.sort();

    var checkboxes = [];
    for (var i=0; i<this.props.labels.length; i++) {
      checkboxes.push(<MulticolorCheckbox targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.labels[i]} pickOneIfYou={false} />);
    }

    return checkboxes;
  }

  render() {
    return (
      <div className="multicolorCheckboxSet">
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col lg={12}>
              <label className="multicolorCheckboxSetName"><h4>{this.props.name}</h4></label>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        {this.gridCheckboxes}
      </div>
    );
  }
}

class MulticolorCheckbox extends React.Component {
  static colorNames(index) { return(['red','orange','yellow','green','blue','pink'][index]); }

  static get youMulticolorLabels()  { return ['Very Poorly', 'Poorly', 'Somewhat Accurately', 'Accurately', 'Very Accurately']; }
  static get themMulticolorLabels() { return ['Awful', 'Bad', 'Acceptable', 'Good', 'Very Good', 'Perfect']; }

  constructor(props) {
    super(props);

    this.makeSelection = this.makeSelection.bind(this); //ensure callbacks have the proper context

    var descriptors = [];
    var footerInitial;
    var footer;
    if ((this.props.targetName.toLowerCase()=='you' && !this.props.pickOneIfYou) || this.props.targetName.toLowerCase()=='them') {
      if (this.props.targetName.toLowerCase()=='you') { //present all colors except pink
        descriptors   = MulticolorCheckbox.youMulticolorLabels;
        footerInitial = 'This describes me';
        footer        = 'How well does this describe you?';
      } else { //present all colors including pink
        descriptors   = MulticolorCheckbox.themMulticolorLabels;
        footerInitial = 'I consider this';
        footer        = 'How important is this in others?';
      }
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

  makeSelection(index) {
    this.setState( {footer: this.state.footerInitial + ' ' + this.state.descriptors[index].toLowerCase() + '.'} ); //set the footer as appropriate

    var childColorsTmp = []; //reset the other checkbox choices' colors, and change the color of the new selection
    for (var i=0;i<this.state.childColors.length;i++) {
      childColorsTmp[i] = MulticolorCheckbox.colorNames(i);
    }
    childColorsTmp[index] = 'black';
    this.setState( {childColors: childColorsTmp} );
  }

  render() {
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

      choices.push(<CheckboxChoice targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.label} side={side} colorName={this.state.childColors[i]} text={text} value={i} onClick={this.makeSelection} percentWidth={percentWidth} textHidden={true} />);
    }

    //TODO: the extra line breaks here are a hideous kludge
    return (
      <div className="multicolorCheckbox">
        <label className="multicolorCheckboxLabel"><span><b>{this.props.label + ':'}</b></span></label>
        <br />
        {choices}
        <span>{this.state.footer}</span>
      </div>
    );
  }
}

class CheckboxChoice extends React.Component {
  render() {
    return ( //TODO: figure out how to add multiple optional classes
      <label className={'checkboxChoice' + ' ' + this.props.colorName + ' ' + this.props.side} style={{width: this.props.percentWidth + "%"}}><input type="radio" name={this.props.categoryName.toLowerCase() + '-' + this.props.name.toLowerCase() + '-' + this.props.targetName.toLowerCase() + '-' + this.props.label.toLowerCase()} value={this.props.value} onClick={() => this.props.onClick(this.props.value)} /><span>{this.props.text}</span></label>
    );
  }
}

//TODO: NEW STUFF BEGINS HERE
//props: color, position, text
class ColorSelectChoice extends React.Component {
  render() {
    return (
      <label className={'colorSelectChoice ' + this.props.color + ' ' + this.props.position}><input type='radio' onClick={() => this.props.onClick(this.props.color)} /><span>{this.props.text}</span></label>
    );
  }
}

//props: onClick
class ColorSelectBar extends React.Component {
  static get colors() {return ['red','orange','yellow','green','blue','pink'];}

  render() {
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
      colorSelectChoices.push(<ColorSelectChoice color={ColorSelectBar.colors[i]} position={position} text={text} onClick={this.props.onClick} />);
    }

    return (
      <div className="colorSelectBox">
        {colorSelectChoices}
      </div>
    );
  }
}

//props: label, color, position, onClick, index
class CheckboxSelectChoice extends React.Component {
  render() {
    return (
      <div className={'checkboxSelectChoice ' + this.props.color + ' ' + this.props.position} onClick={() => this.props.onClick(this.props.index)}><span>{this.props.label}</span></div>
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

      console.log(this.props.colors[i]);
      selectChoices.push(<CheckboxSelectChoice label={this.props.possibleOptions[i]} color={this.props.colors[i]} position={position} index={i} onClick={this.props.onClick} />);
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
    if (this.props.youOrThem.toLowerCase()=="you") {
      return (
        <div className="controlText"><span className="middleControlText">Choose one ↑</span><br /></div>
      );
    } else {
      return (
        <div className="controlText"><span className="leftControlText">↓ Pick</span><span className="rightControlText">Click ↑</span><br /></div>
      );
    }
  }
}

//props: name
class ElementName extends React.Component {
  render() {
    return (
      <label className="elementName"><span><b>{this.props.name + ':'}</b></span></label>
    );
  }
}

//props: name, youOrThem, possibleOptions
class SingleColorYouCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.setActiveColor = this.setActiveColor.bind(this);
    this.getActiveColor = this.getActiveColor.bind(this);

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

  setActiveColor(color) {
    this.activeColor = color;
  }

  getActiveColor(optionIndex) {
    console.log("Made it to getActive");
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
    console.log(newOptionColors);
    this.setState({optionColors: newOptionColors});
  }

  render() {
    var commonHtml = [];
    commonHtml.push(<ElementName name={this.props.name} />);
    commonHtml.push(<CheckboxSelectBox possibleOptions={this.props.possibleOptions} colors={this.state.optionColors} onClick={this.getActiveColor} />);
    commonHtml.push(<SingleColorYouControlsText youOrThem={this.props.youOrThem} />);

    if (this.props.youOrThem.toLowerCase()=="you") {
      return (
        <div className="multicolorCheckbox">
          {commonHtml}
        </div>
      );
    } else {
      return (
        <div className="multicolorCheckbox">
          {commonHtml}
          <ColorSelectBar onClick={this.setActiveColor} />
        </div>
      );
    }
  }
}

//props: name, youOrThem, numCells, rightmostOption, leftmostOption
class FuzzySelectBar extends React.Component {
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
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} />
    );
  }
}

//props: name, youOrThem, maxPossible, minPossible, numCells
class NumericalSelectBar extends React.Component {
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
        minOfRange = Math.floor(minOfRange / 12) + '\'' + minOfRange % 12;
        maxOfRange = Math.floor(maxOfRange / 12) + '\'' + maxOfRange % 12;
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
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} />
    );
  }
}

//props: name, youOrThem
class BooleanSelectBar extends React.Component {
  render() {
    var possibleOptions=[];
    possibleOptions[0] = "No";
    possibleOptions[1] = "Yes";

    return (
      <SingleColorYouCheckboxSet name={this.props.name} youOrThem={this.props.youOrThem} possibleOptions={possibleOptions} />
    );
  }
}

ReactDOM.render(
  <Chart />,
  document.getElementById('root')
);
