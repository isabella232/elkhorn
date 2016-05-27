import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

import 'react-date-picker/index.css'

import DatePicker from 'react-date-picker'

class DateField extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget

    var now = new Date();
    var dateString = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();

    this.state = Object.assign(
      this.state,
      {
        selectedDate: Date.now(),
        selectedDateString: dateString,
        dateSelected: false, // a date has manually been selected
        value: this.props.text || ''
      }
    );
  }

  // Event listeners

  onKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.validateAndSave();
      break
      default:
        this.setState({ value: e.target.value });
      break;
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  onBlur() {
    this.validateAndSave();
  }

  // Compute styles for different field states
  getStyles() {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    );
  }

  validateAndSave(options) {
    this.validate();
    this.update(options);
  }

  // Interface methods

  validate() {

    let isValid = true, isCompleted = false;

    isCompleted = !!this.state.selectedDate.length && !!this.state.dateSelected;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return { value: this.state.selectedDate.length ? this.state.selectedDate : '' };
  }

  onDatePickerChange(dateString, { dateMoment, timestamp }){
    this.setState({ selectedDate: dateString, selectedDateString: dateString, dateSelected: true });
    this.validateAndSave();
  }

  getStyles() {
    return Object.assign({},
      styles.textInput,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    );
  }

  render() {
    return (
      <div style={ styles.base }>
        <input
          type="text"
          onBlur={ this.onBlur.bind(this) }
          style={ this.getStyles() }
          value={ this.state.selectedDateString } />
        <DatePicker
          minDate='1920-01-01' // hardcoded for now
          maxDate='2050-01-01' // do we need limits?
          date={ this.state.selectedDate }
          onChange={ this.onDatePickerChange.bind(this) }
        />
      </div>
    )
  }
}

const styles = {
  base: {
    maxWidth: '600px'
  },
  textInput: {
    display: 'block',
    fontSize: '14pt',
    color: 'black',
    padding: '10px',
    width: '100%',
    outline: 'none',
    resize: 'none',
    border: '1px solid #ccc',
    transition: 'border .5s'
  },
}

export default DateField;
