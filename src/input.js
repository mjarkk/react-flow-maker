import React from 'react'
import {DropDown, Check} from './icons'
import ToolTip from './tooltip'

export default class Input extends React.Component {
  constructor() {
    super()
    this.refID = ""
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
    if ((this.props.input && !this.state.isAfterInit) || this.refID != this.props.refID) {
      this.refID = this.props.refID
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
    if (this.props.hiddenDropdown && this.state.dropDownopen) {
      this.setState({
        dropDownopen: false,
      })
    }
  }
  
  render() {
    const error = this.state.error
    const input = this.props.input
    let inputEl
    if (!input) {
      return (<div className="flow-input"></div>)
    }

    const Label = () => <div className="flow-label" onClick={() => inputEl ? inputEl.focus() : input.type == 'switch' ? this.updateValue(!this.state.value) : ''}>
        <span>{input.title}</span>
        <ToolTip transparrent={true} tip={input.tooltip}/>
      </div>

    return (
      <div className={`flow-input flow-input-type-${input.type} flow-hasErr${error ? 'True' : 'False'}`}>
        {input.type != 'switch' ? <Label/> : ''}
        <div className="flow-actualInput">
          {(input.type == 'text' || input.type == 'number')?
            <div className="flow-text">
              <input ref={el => inputEl = el} type={input.type} value={this.state.value} onChange={e => this.updateValue(e.target.value)}/>
            </div>
          :input.type == 'switch'?
            <div className="flow-switch">
              <div 
                onClick={() => this.updateValue(!this.state.value)} 
                className={`flow-actualSwitch ${this.state.value ? 'flow-true' : 'flow-false'}`}
              ><div className="flow-inside"><Check/></div></div>
            </div>
          :input.type == 'dropdown'?
            <div className="flow-dropdown">
              <div className="flow-select" onClick={() => this.setState({dropDownopen: !this.state.dropDownopen})}>
                <div className="flow-optTitle">
                  {this.state.dropDownSelected == -1 || !input.options || input.options.length == 0
                    ? '...' 
                    : input.options[this.state.dropDownSelected].title
                  }
                </div>
                <div className="flow-icon">
                  {!input.options || input.options.length == 0 ? '' : <DropDown/>}
                </div>
              </div>
              <div className={`flow-options flow-open${this.state.dropDownopen ? 'True' : 'False'}`}>
                {input.options.map((option, optionID) => 
                  <div 
                    key={optionID} 
                    className="flow-option"
                    onClick={() => {
                      this.updateValue(option.value)
                      this.setState({
                        dropDownSelected: optionID,
                        dropDownopen: false,
                      })
                    }}
                  >
                    <div className="flow-optTitle">{option.title}</div>
                    <ToolTip tip={option.tooltip}/>
                  </div>
                )}
              </div>
            </div>
          :''}
        </div>
        {input.type == 'switch' ? <Label/> : ''}
        {error?
          <div className="flow-error">{error}</div>
        :''}
      </div>
    )
  }
}
