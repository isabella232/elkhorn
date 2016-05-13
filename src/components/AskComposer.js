import preact from 'preact'
const { h, Component } = preact
import AskFieldWrapper from './AskFieldWrapper'
import Header from './Header'
import Footer from './Footer'
import FinishedScreen from './FinishedScreen'

class AskComposer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentStep: 0,
      completedSteps: [],
      finished: false,
      ...this.props
    }

    this._fieldRefs = [];
  }

  onSave(payload) {

    var pageCopy = Object.assign({}, this.state.page);
    pageCopy.children[payload.index] = Object.assign({},
      pageCopy.children[payload.index],
      payload
    );

    var nextStep = payload.moveForward ? this.state.currentStep + 1 : this.state.currentStep;
    this.setState({ page: pageCopy, currentStep: nextStep });

  }

  validate() {
    // Assume valid until proven otherwise
    let askIsValid = true;
    var fieldIsValid = true;

    this.state.page.children.map((child, index) => {
      // Type checking before calling
      if (typeof this._fieldRefs[index]._field.validate == "function") {
        // We delegate validation to the components
        fieldIsValid = this._fieldRefs[index]._field.validate(true);
        // If any of the fields is invalid, the form is invalid
        if (fieldIsValid === false) askIsValid = false;
      }
    });

    return askIsValid;
  }

  nextStep() {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  setFocus(index) {
    this.setState({ currentStep: index });
  }

  onClick(index) {
    //this.setFocus(index);
  }

  onSubmit(index) {
    this.setState({ submitted: true });
    if (this.validate()) {
      this.setState({ finished: true });
      this.send();
    }
  }

  send() {
    var payload = [], field, fieldValue;
    this.state.page.children.map((child, index) => {
      field = this._fieldRefs[index]._field;
      if (typeof field.getValue == "function") {
        fieldValue = field.getValue();
        payload.push({
          id: field.props.id,
          title: field.props.title,
          value: fieldValue
        });
      }
    });
    console.info("Payload to be sent to the server", payload);
  }

  render() {
    // field count is artificial, not the widget index
    var fieldCount = 0;
    var completedCount = 0;
    return (
      <div style={ styles.base } ref={ (composer) => this._composer = composer }>
        <Header title={ this.props.header.title } description={ this.props.header.description } />

        {
          !this.state.finished ?
            <div>
                <ul style={ styles.fieldList }>
                  {
                    this.state.page.children.map((child, index) => {

                      if (child.type == 'field') {
                        fieldCount++;
                      }
                      if (child.completed && child.isValid) completedCount++;

                      return <AskFieldWrapper
                          key={ index }
                          ref={ (widgetWrapper) => this._fieldRefs[index] = widgetWrapper }
                          index={ index }
                          fieldNumber={ fieldCount }
                          hasFocus={ this.state.currentStep == index }
                          onSave={ this.onSave.bind(this) }
                          onClick={ this.onClick.bind(this, index) }
                          settings={ this.state.settings }
                          submitted={ this.state.submitted }
                          { ...child } />;
                    })
                  }
                </ul>

                <Footer
                  completedCount={ completedCount }
                  fieldCount={ fieldCount }
                  conditions={ this.props.footer.conditions }
                  onSubmit={ this.onSubmit.bind(this) } />
            </div>
          :
            <FinishedScreen
              title={ this.state.finishedScreen.title }
              description={ this.state.finishedScreen.description }
              />
        }
      </div>
    )
  }

}

const styles = {
  base: {
    background: '#eee',
    position: 'relative'
  },
  fieldList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  }
}

export default AskComposer;
