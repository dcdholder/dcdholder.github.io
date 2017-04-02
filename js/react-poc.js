class Chart extends React.Component {
  constructor (props) { //TODO: change this to a yaml parser when you're done testing out the basic UI
    super(props);

    this.tagLine = "The Ultimate QT Infograph";
    this.edition = "ENTERPRISE EDITION";
    this.siteVersion  = "V0.0";
    this.chartVersion = "Chart Version: 3";

    this.requestChartImage = this.requestChartImage.bind(this)

    this.categoryMulticolorCheckboxMap = {'Emotional': {'Quirks':
      ['Adventurous','Ambitious','Analytical','Artistic','Assertive', 'Athletic', 'Confident', 'Creative',
       'Cutesy', 'Cynical', 'Easy-going', 'Empathetic', 'Energetic', 'Honest', 'Humorous', 'Hygienic',
       'Intelligent', 'Kind', 'Lazy', 'Loud', 'Materialistic', 'Messy', 'Outdoorsy', 'Passionate',
       'Reliable', 'Resourceful', 'Romantic', 'Serious', 'Sexual', 'Social', 'Talkative', 'Wise']
    }};

    this.categorySingleColorCheckboxMap = {'Physical': {'Gender': ['Male', 'Female', 'MTF', 'FTM'],
      'Race': ['White', 'Asian', 'Latin', 'Arab', 'Jewish', 'Black', 'Other'],
      'Body Type': ['Fit', 'Skinny', 'Thin', 'Medium', 'Chubby', 'Fat'],
      'Facial Hair': ['None','Moustache','Goatee','Stubble','Beard','Wizard'],
      'Hair Style': ['Bald', 'Short', 'Medium', 'Long', 'Very Long'],
      'Hair Color': ['Black', 'Brown', 'Gold', 'Blonde', 'Ginger', 'Other']},
      'Beliefs': {'Religion': ['Christian', 'Muslim', 'Jew', 'Pagan', 'Satanist', 'Deist', 'Polydeist', 'Agnostic', 'Atheist', 'Other']
    }};

    this.categoryElementMap = {'singleColorCheckboxSets': this.categorySingleColorCheckboxMap, 'multicolorCheckboxSets': this.categoryMulticolorCheckboxMap};

    this.targets = [];
    var possibleTargets = ["You","Them"]
    for (var i=0;i<possibleTargets.length;i++) {
      this.targets.push(<Target key={possibleTargets[i]} targetName={possibleTargets[i]} categoryElementMap={this.categoryElementMap['multicolorCheckboxSets']} />);
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

    console.log(fullUri);
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
    if (this.generationAnimationTimer!=null) {
      clearInterval(this.generationAnimationTimer);
    }

    console.log(this.state.generateButtonText)

    this.setState({generateButtonText: Chart.defaultGenerateButtonText})
    console.log(this.state.generateButtonText)
  }

  showEmptyFieldWarning() {
    this.setState({errorMessage: 'You have one or more empty fields.'})
  }

  showRequestErrorWarning() {
    this.setState({errorMessage: 'The server must be busy. Try again later.'})
  }

  hideProcessingErrorWarning() {
    this.setState({errorMessage: ''})
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
        console.log('Failed response.');
        that.hideGenerateWaitAnimation();
      }
    }
    httpRequest.send();
  }

  render() {
    var errorMessageDisplayMode;
    if (this.state.errorMessage=='') {
      errorMessageDisplayMode = 'none';
    } else {
      errorMessageDisplayMode = 'block';
    }

    return (
      <div className="chart">
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

    this.categories = [];

    for (var categoryName in props.categoryElementMap) {
      this.categories.push(<Category targetName={this.props.targetName} categoryName={categoryName} elementMap={props.categoryElementMap[categoryName]} />);
    }
  }

  render() {
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
        {this.categories}
      </div>
    );
  }
}

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.elements = [];

    for (var elementName in this.props.elementMap) {
      this.elements.push(<MulticolorCheckboxSet targetName={this.props.targetName} categoryName={this.props.categoryName} name={elementName} labels={this.props.elementMap[elementName]} />); //TODO: change this when MulticolorCheckboxSet becomes an Element subclass
    }
  }

  render() {
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
        {this.elements}
      </div>
    );
  }
}

class MulticolorCheckboxSet extends React.Component {
  constructor(props) {
    super(props);

    this.checkboxes     = this.getCheckboxes();
    this.gridCheckboxes = this.fillGrid(this.checkboxes);
  }

  static get numColsXSmall() {return 1;}
  static get numColsSmall()  {return 3;}
  static get numColsMedium() {return 4;}
  static get numColsLarge()  {return 6;}

  getCheckboxes() {
    this.props.labels.sort()

    var checkboxes = [];
    for (var i=0; i<this.props.labels.length; i++) {
      checkboxes.push(<MulticolorCheckbox targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.labels[i]} pickOneIfYou={false} />);
    }

    return checkboxes;
  }

  fillGrid(elements) {
    var row = this.fillRow(elements);
    /*
    for (var i=0;i<Math.ceil(elements.length/numColsDesktop);i++) {
      rows.push(this.fillRow(numColsDesktop,elements)); //still works when there's only a few elements left for the last row
    }
    */

    return (
      <div className="multicolorCheckboxes">
        <ReactBootstrap.Grid fluid={true}>
          {row}
        </ReactBootstrap.Grid>
      </div>
    );
  }

  fillRow(rowElements) {
    /*
    if(rowElements.length>numColsDesktop) {
      throw "Cannot fit more elements into a row than there are columns."
    }
    */

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

  fillColumn(element) {
    if (typeof element!==undefined) { //TODO: figure out if this is necessary
      return (
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          {element}
        </div>
      );
    }
  }

  render() { //the grid is wrapped in another div by fillGrid
    return (
      <div className="multicolorCheckboxSet">
        <ReactBootstrap.Grid fluid={true}>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col lg={12}>
              <label class="multicolorCheckboxSetName"><h4>{this.props.name}</h4></label>
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
        footerInitial = 'Describes me';
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
      if (i==0) {
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
        <label class="multicolorCheckboxLabel"><span><b>{this.props.label + ': '}</b></span></label>
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

/*
class SingleColorCheckboxSet extends React.Component {
  render() {
    choices = [];
    for (var i=0; i<this.props.descriptors.length) {
      if (i==0) {
        side = 'left';
      } else if (i==this.props.descriptors.length-1) {
        side = 'right';
      }

      text = this.props.descriptors[i];
      choices.push(<CheckboxChoice targetName={this.props.targetName} categoryName={this.props.categoryName} name={this.props.name} label={this.props.name} side={side} colorName={'default'} text={text} value={text} onClick={this.makeSelection} percentWidth={percentWidth} />)
    }

    return (
      <div className="singleColorCheckboxSet">
        <label class="singleColorCheckboxLabel"><span><b>{this.props.name + ': '}</b></span></label>
        <br />
        {choices}
        <br />
        <br />
      </div>
    );
  }
}
*/

ReactDOM.render(
  <Chart />,
  document.getElementById('root')
);

/*
class Category extends React.Component {

}

class SelectOneFuzzyRangeBar extends React.Component {
  render() {
    var cells;
    for (var i=0; i<this.props.numCells; i++) {
      cells.push(<BinaryColorChoice label={this.props.name} score={i} />);
    }

    return (
      <div className="selectOneFuzzyBar">
        <label class="groupLabel"><span>{this.props.name}</span></label>
        <div className="binaryColorChoices">
          {cells}
        </div>
      </div>
    );
  }
}

class SelectAllFuzzyRangeBar extends React.Component {
  render() {
    var choices;

    for (var i=0;i<this.props.numChoices;i++) {
      var extraClasses = [];
      var text = '';
      if (i==0) {
        extraClasses.push('leftmostChoice');
        text = this.props.leftText;
      } else if {
        extraClasses.push('rightmostChoice');
        text = this.props.rightText;
      }

      choices.push(<DropdownColorChoice displayText=text />);
    }

    return (
      <div className="selectAllFuzzyBar">
  			<label class="elementLabel"><span>Extroversion:</span></label>
  			<div class="selectAllFuzzyBarChoices">
          {choices}
        </div>
      </div>
    );
  }
}

class BinaryColorChoice extends React.Component {
  render() {
    return (
      <label class="selectOneCell"><input type="radio" name={this.props.label} value={this.props.score}><span>{this.props.text}</span></label>
    );
  }
}

class DropdownColorChoice extends React.Component {
  var colorNames = ['red',     'orange',  'yellow',  'green',   'blue',    'pink'];
  var colorCodes = ['#ff0000', '#ff7200', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];

  var textLabels = ['Perfect', 'Very Good', 'Good', 'Acceptable', 'Bad', 'Awful'];

  render() {
    var options;
    for (var i=0; i<colorNames.length; i++) {
      options.push(<option class={colorNames[i]} value={colorCodes[i]}><span>{textlabels[i]}</span></option>);
    }

    return (
      <select>
        {options}
      </select>
    );
  }
}

//gender, body type, race etc.
class SelectOneCheckboxSet extends React.Component {
  var selectedColor   = 'green'
  var unselectedColor = 'red'

  render() {
    var checkboxChoices;

    this.props.labels.sort();
    for (var i=0; i<labels.length; i++) {
      choices.push(<CheckboxChoice label=this.props.name color=unselectedColor colorScore=this.props.labels[i] text=this.props.labels[i] textHidden=false />);
    }

    return (
      <div className="selectOneCheckboxSet">
        <label class="selectOneCheckboxSetName"><span>{this.props.name}</span></label>
        {checkboxChoices}
      </div>
    );
  }
}

*/
