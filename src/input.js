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
  const [internalRefID] = useState(new RefID)
  const [state, setState] = useState({ dropDownopen: false })
  const [isAfterInit, setIsAfterInit] = useState(false)
  const [value, setValue] = useState(undefined)
  const [error, setError] = useState('')

  function updateDefaultVal() {
    if ((input && !isAfterInit) || internalRefID.val != refID) {
      internalRefID.val = refID

      let defaultInput = initalVal !== undefined ? initalVal : input.default
      if (defaultInput === undefined) {
        if (input.type == 'text' || input.type == 'number') {
          defaultInput = ''
        } else if (input.type == 'switch') {
          defaultInput = false;
        }
      }
      setValue(defaultInput)

      setIsAfterInit(true)
    }
  }

  useEffect(() => {
    if (typeof input.validation == 'function' && value !== undefined) {
      let error = input.validation(undefined, value)
      if (typeof error != 'string') {
        error = ''
      }
      setError(error)
    }
  }, [value])

  useEffect(() => {
    if (onChange && (value !== undefined || input.type == 'dropdown')) {
      onChange({
        error,
        value: input.type == 'number'
          ? typeof value === 'number' ? value : Number(value)
          : value,
      })
    }
  }, [value, error])

  useEffect(() => updateDefaultVal(), [])

  useEffect(() => {
    if (input.type == 'dropdown' && value !== undefined) {
      const newValue = input?.options?.find(option => option.value === value)?.value || (input?.options && input?.options[0])?.value || undefined;
      if (newValue !== value) setValue(newValue);
    }
  }, [input])

  useEffect(() => {
    updateDefaultVal()
    if (hiddenDropdown && state.dropDownopen) {
      setState(v => ({
        ...v,
        dropDownopen: false,
      }))
    }
  }, [hiddenDropdown])

  let inputEl
  if (!input) {
    return (<div className="flow-input"></div>)
  }

  const Label = () =>
    <div
      className="flow-label"
      onClick={() => inputEl ? inputEl.focus() : input.type == 'switch' ? setValue(!value) : ''}
    >
      <span>{input.title}</span>
      <ToolTip transparrent={true} tip={input.tooltip} />
    </div>

  return (
    <div className={`flow-input flow-input-type-${input.type} flow-hasErr${error ? 'True' : 'False'}`}>
      {input.type != 'switch' ? <Label /> : ''}
      <div className="flow-actualInput">
        {(value !== undefined && (input.type == 'text' || input.type == 'number')) ?
          <div className="flow-text">
            <input
              ref={el => inputEl = el}
              value={value}
              onChange={e => {
                if (input.type == 'number') {
                  setValue([...e.target.value].filter((c, idx) => /[0-9.]/.test(c) || (idx == 0 && c == '-')).join(''))
                } else {
                  setValue(e.target.value)
                }
              }}
            />
          </div>
          : (value !== undefined && input.type == 'switch') ?
            <div className="flow-switch">
              <div
                onClick={() => setValue(!value)}
                className={`flow-actualSwitch ${value ? 'flow-true' : 'flow-false'}`}
              ><div className="flow-inside"><Check /></div></div>
            </div>
            : input.type == 'dropdown' ?
              <div className="flow-dropdown">
                <div className="flow-select" onClick={() => setState(v => ({ ...v, dropDownopen: !state.dropDownopen }))}>
                  <div className="flow-optTitle">
                    {!input.options?.length
                      ? '...'
                      : input.options.find(input => input.value === value)?.title || '...'
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
                        setValue(option.value)
                        setState(v => ({
                          ...v,
                          dropDownopen: false,
                        }))
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
