import React, { useEffect, useState } from 'react'
import { DropDown, Check } from './icons'
import ToolTip from './tooltip'

class RefID {
  constructor() {
    this.val = ''
  }
}

export default function Input({
  onChange,
  hiddenDropdown,
  input,
  refID,
  initalVal,
}) {
  let [internalRefID] = useState(new RefID)
  let [state, setState] = useState({
    value: '',
    error: '',
    dropDownSelected: -1,
    isAfterInit: false,
    dropDownopen: false,
  })

  function tellParent() {
    if (onChange) {
      onChange({
        error: state.error,
        value: state.value,
      })
    }
  }

  function validate(newVal, cb) {
    if (typeof input.validation == 'function') {
      let error = input.validation(undefined, newVal)
      if (typeof error != 'string') {
        error = ''
      }
      setState({
        error
      }, cb)
    }
    if (typeof cb == 'function') {
      cb()
    }
  }

  function updateDefaultVal() {
    if ((input && !state.isAfterInit) || internalRefID.val != refID) {
      internalRefID.val = refID
      const defaultInput = typeof initalVal != 'undefined' ? initalVal : input.default

      setState({
        value: defaultInput,
        isAfterInit: true,
      }, () => {
        validate(defaultInput, () => {
          if (input.type == 'dropdown' && state.dropDownSelected == -1) {
            let dropDownSelected = 0
            input.options.map((option, id) => {
              if (option.value == defaultInput) {
                dropDownSelected = id
              }
            })
            setState({
              dropDownSelected
            })
          }
          tellParent()
        })
      })
    }
  }

  function updateValue(newVal) {
    setState({ value: newVal }, () => {
      validate(newVal, () => {
        tellParent()
      })
    })
  }

  useEffect(() => updateDefaultVal(), [])

  useEffect(() => {
    updateDefaultVal()
    if (hiddenDropdown && state.dropDownopen) {
      setState({
        dropDownopen: false,
      })
    }
  }, [hiddenDropdown])

  const error = state.error
  let inputEl
  if (!input) {
    return (<div className="flow-input"></div>)
  }

  const Label = () => <div className="flow-label" onClick={() => inputEl ? inputEl.focus() : input.type == 'switch' ? updateValue(!state.value) : ''}>
    <span>{input.title}</span>
    <ToolTip transparrent={true} tip={input.tooltip} />
  </div>

  return (
    <div className={`flow-input flow-input-type-${input.type} flow-hasErr${error ? 'True' : 'False'}`}>
      {input.type != 'switch' ? <Label /> : ''}
      <div className="flow-actualInput">
        {(input.type == 'text' || input.type == 'number') ?
          <div className="flow-text">
            <input ref={el => inputEl = el} type={input.type} value={state.value} onChange={e => updateValue(e.target.value)} />
          </div>
          : input.type == 'switch' ?
            <div className="flow-switch">
              <div
                onClick={() => updateValue(!state.value)}
                className={`flow-actualSwitch ${state.value ? 'flow-true' : 'flow-false'}`}
              ><div className="flow-inside"><Check /></div></div>
            </div>
            : input.type == 'dropdown' ?
              <div className="flow-dropdown">
                <div className="flow-select" onClick={() => setState({ dropDownopen: !state.dropDownopen })}>
                  <div className="flow-optTitle">
                    {state.dropDownSelected == -1 || !input.options || input.options.length == 0
                      ? '...'
                      : input.options[state.dropDownSelected].title
                    }
                  </div>
                  <div className="flow-icon">
                    {!input.options || input.options.length == 0 ? '' : <DropDown />}
                  </div>
                </div>
                <div className={`flow-options flow-open${state.dropDownopen ? 'True' : 'False'}`}>
                  {input.options.map((option, optionID) =>
                    <div
                      key={optionID}
                      className="flow-option"
                      onClick={() => {
                        updateValue(option.value)
                        setState({
                          dropDownSelected: optionID,
                          dropDownopen: false,
                        })
                      }}
                    >
                      <div className="flow-optTitle">{option.title}</div>
                      <ToolTip tip={option.tooltip} />
                    </div>
                  )}
                </div>
              </div>
              : ''}
      </div>
      {input.type == 'switch' ? <Label /> : ''}
      {error ?
        <div className="flow-error">{error}</div>
        : ''}
    </div>
  )
}
