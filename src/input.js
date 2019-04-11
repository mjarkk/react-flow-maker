import React from 'react'
import {DropDown, Check} from './icons'
import ToolTip from './tooltip'

export default class Input extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      error: '',
      dropDownSelected: -1,
      isAfterInit: false,
      dropDownopen: false,
    }
  }

  tellParent() {
    if (this.props.onChange) {
      this.props.onChange({
        error: this.state.error,
        value: this.state.value,
      })
    }
  }

  updateDefaultVal() {
    if (this.props.input && !this.state.isAfterInit) {
      const defaultInput = typeof this.props.initalVal != 'undefined' ? this.props.initalVal : this.props.input.default

      this.setState({
        value: defaultInput,
        isAfterInit: true,
      }, () => {
        this.validate(defaultInput, () => {
          if (this.props.input.type == 'dropdown' && this.state.dropDownSelected == -1) {
            let dropDownSelected = 0
            this.props.input.options.map((option, id) => {
              if (option.value == defaultInput) {
                dropDownSelected = id
              }
            })
            this.setState({
              dropDownSelected
            })
          }
          this.tellParent()
        })
      })
    }
  }

  validate(newVal, cb) {
    if (typeof this.props.input.validation == 'function') {
      let error = this.props.input.validation(undefined, newVal)
      if (typeof error != 'string') {
        error = ''
      }
      this.setState({
        error
      }, cb)
    }
    if (typeof cb == 'function') {
      cb()
    }
  }

  updateValue(newVal) {
    this.setState({value: newVal}, () => {
      this.validate(newVal, () => {
        this.tellParent()
      })
    })
  }

  componentDidMount() {
    this.updateDefaultVal()
  }

  componentDidUpdate() {
    this.updateDefaultVal()
  }
  
  render() {
    const error = this.state.error
    const input = this.props.input
    if (!input) {
      return (<div className="input"></div>)
    }

    return (
      <div className={`input hasErr${error ? 'True' : 'False'}`}>
        <div className="label"><span>{input.title}</span><ToolTip transparrent={true} tip={input.tooltip}/></div>
        <div className="actualInput">
          {(input.type == 'text' || input.type == 'number')?
            <div className="text">
              <input type={input.type} value={this.state.value} onChange={e => this.updateValue(e.target.value)}/>
            </div>
          :input.type == 'switch'?
            <div className="switch">
              <div 
                onClick={() => this.updateValue(!this.state.value)} 
                className={`actualSwitch ${this.state.value ? 'true' : 'false'}`}
              ><div className="inside"><Check/></div></div>
            </div>
          :input.type == 'dropdown'?
            <div className="dropdown">
              <div className="select" onClick={() => this.setState({dropDownopen: !this.state.dropDownopen})}>
                <div className="optTitle">{this.state.dropDownSelected == -1 ? '...' : input.options[this.state.dropDownSelected].title}</div>
                <div className="icon">
                  <DropDown/>
                </div>
              </div>
              <div className={`options open${this.state.dropDownopen ? 'True' : 'False'}`}>
                {input.options.map((option, optionID) => 
                  <div 
                    key={optionID} 
                    className="option"
                    onClick={() => {
                      console.log('dropdown: start:', option.value)
                      this.updateValue(option.value)
                      this.setState({
                        dropDownSelected: optionID,
                        dropDownopen: false,
                      })
                    }}
                  >
                    <div className="optTitle">{option.title}</div>
                    <ToolTip tip={option.tooltip}/>
                  </div>
                )}
              </div>
            </div>
          :''}
        </div>
        {error?
          <div className="error">{error}</div>
        :''}
      </div>
    )
  }
}
