import preact from 'preact';
const {Component, h} = preact;

import AskField from '../AskField';

class MultipleChoice extends AskField {

  constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      focused: -1,
      value: []
    }
  }

  onClick(i, e) {
    var newValue = this.state.value.slice();
    if (newValue.indexOf(i) === -1) {
      if (this.props.pickUpTo) {
        if (newValue.length < this.props.pickUpTo) {
          newValue.push(i);
        } else {
          e.preventDefault();
        }
      } else {
        newValue.push(i);
      }
    } else {
      newValue.splice(newValue.indexOf(i), 1);
    }
    var newState = { focused: i, value: newValue };
    if (this.state.value.length >= 0) {
      newState = Object.assign({}, newState, { completed: true, isValid: true });
    } else {
      newState = Object.assign({}, newState, { completed: false });
    }
    this.setState(newState);
    this.validate();
    this.update({ moveForward: false });
  }

  // Style computing

  getOptionStyle(i) {
    return Object.assign({},
      styles.option,
      i === this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground },
      this.state.value.indexOf(i) > -1 ? { // clicked
        backgroundColor: this.props.theme.selectedItemBackground,
        color: this.props.theme.selectedItemText
      } : {}
    );
  }

  getStyles() {
    return Object.assign({}, styles.base, this.props.isValid ? styles.valid : styles.error);
  }

  // Template partials

  getOptions() {
    return this.props.options.map((option, i) => {
      return <label
          //onMouseOver={ this.onHover.bind(this, i) }
          style={ this.getOptionStyle(i) }
          key={ i }
        ><input
            style={ styles.optionCheck }
            onClick={ this.onClick.bind(this, i) }
            tabindex="0"
            type="checkbox"
            key={ i }
          />{ option.title }</label>});
  }

  // Interface Methods

  validate(validateRequired = false) {

    let isValid = true, isCompleted = false;

    isCompleted = !!this.state.value.length;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ? isValid && isCompleted : isValid;

  }

  getValue() {
    var selectedOptions = [], optionTitle;
    this.state.value.map((index) => {
      optionTitle = this.props.options[index].title;
      selectedOptions.push({
        index: index,
        title: optionTitle
      });
    });
    return { options: selectedOptions };
  }

  render() {
    return (
      <div>
        <fieldset
          style={ styles.base }>
          <legend style={ styles.accesibleLegend }>{ this.props.title }</legend>
          { this.getOptions() }
        </fieldset>
        {
          !!this.props.pickUpTo ?
            <div style={ styles.bottomLegend }>{ this.state.value.length } of { this.props.pickUpTo } selected.</div>
          :
            null
        }
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    color: '#888',
    width: '90%',
    outline: 'none',
    border: 'none',
    minHeight: '100px',
    padding: '0'
  },
  accesibleLegend: {
    position: 'fixed',
    left: '-5000px'
  },
  option: {
    display: 'inline-block',
    fontSize: '14pt',
    cursor: 'pointer',
    color: '#777',
    lineHeight: '50px',
    transition: 'background .2s',
    background: 'white',
    border: '1px solid #ccc',
    padding: '0px 20px 0px 50px',
    outline: 'none',
    margin: '0 10px 10px 0',
    textAlign: 'left',
    position: 'relative',
    fontWeight: 'bold'
  },
  clicked: {
    background: '#222',
    color: 'white',
  },
  focused: {
    border: '1px solid #47a',
  },
  optionTitle: {
    fontSize: '15pt',
    margin: '0',
    padding: '0',
    lineHeight: '1'
  },
  optionDescription: {
    margin: '0',
    padding: '0',
    lineHeight: '1'
  },
  optionCheck: {
    position: 'absolute',
    top: '18px',
    left: '20px'
  },
  bottomLegend: {
    color: '#999',
    fontSize: '10pt',
    padding: '0px',
    textAlign: 'right',
    width: '100%',
    marginTop: '5px',
  }
}

export default MultipleChoice;