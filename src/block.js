import React, { useEffect, useState } from 'react'
import Input from './input'
import { Delete, Add, DropDown, DropUp, Alert } from './icons'
import ToolTip from './tooltip'

export default function Block({ Tree, Logic, data, graphInstanceForceUpdate, graphParrentInstanceForceUpdate }) {
  let [state, setState] = useState({
    hover: false,
    showAddOptions: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false)

  function remove() {
    Tree.removeComponent(data.path)
  }
  function realAdd(toAdd) {
    setState(v => ({
      ...v,
      showAddOptions: false,
    }))

    if (!toAdd) {
      return
    }

    Tree.addComponent(toAdd, data.path)
  }
  function add() {
    if (data.component.next.length == 1) {
      realAdd(data.component.next[0])
      return
    }

    setState(v => ({
      ...v,
      showAddOptions: true,
    }))
  }

  useEffect(() => {
    if (graphParrentInstanceForceUpdate) {
      graphParrentInstanceForceUpdate()
    } else if (graphInstanceForceUpdate) {
      graphInstanceForceUpdate()
    }
  }, [showAdvanced])

  if (!data) {
    return ''
  }
  const comp = data.component
  let { inputs, advancedInputs } = comp

  if (comp.getInputs) {
    const args = Tree.itemToExport(data)
    let res = comp.getInputs(args)
    if (Array.isArray(res)) {
      inputs = [];
      advancedInputs = [];
      res.map(component => {
        if (component.advanced) advancedInputs.push(component)
        else inputs.push(component)
      })
    }
  }

  return (
    <div
      className={`flow-fullBlock flow-hover${state.hover && !state.showAddOptions ? 'True' : 'False'}`}
      onMouseEnter={() => {
        if (!state.hover) {
          setState(v => ({ ...v, hover: true }))
        }
      }}
      onMouseLeave={() => {
        if (state.hover) {
          setState(v => ({ ...v, hover: false }))
        }
      }}
    >
      <div className="flow-side">
        <div className="flow-innerSide">
          <div className="flow-round" onClick={remove}>
            <Delete />
          </div>
        </div>
      </div>
      <div className="flow-middle">
        <div className="flow-title">{comp.title}<ToolTip transparrent={true} tip={comp.tooltip} /></div>
        <div className="flow-inputs">
          {
            inputs.map((input, inputID) => {
              const inputData = data.inputData[input.name]
              return (
                <Input
                  refID={data.id}
                  key={inputID}
                  input={input}
                  initalVal={inputData ? inputData.value : undefined}
                  onChange={inputData =>
                    Tree.updateInputValue(data.path, inputData, input.name)
                  }
                />
              )
            })
          }
          {advancedInputs.length > 0 ?
            (() => {
              const hasErrors = advancedInputs.filter(el => (data.inputData[el.name] && el.validation ? el.validation(undefined, data.inputData[el.name].value) : true) !== true).length > 0
              const showHasErrors = hasErrors && !showAdvanced
              return (
                <div className="flow-showAdvanced">
                  <div
                    className={`flow-button error${showHasErrors ? 'True' : 'False'}`}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >{showHasErrors ? <Alert /> : ''}Advanced {showAdvanced ? <DropUp /> : <DropDown />}</div>
                </div>
              )
            })()
            : ''}
        </div>
        <div className={`flow-inputs flow-advancedInputs flow-show${showAdvanced ? 'True' : 'False'}`}>
          {advancedInputs.map((input, inputID) => {
            const inputData = data.inputData[input.name]
            return (
              <Input
                hiddenDropdown={!showAdvanced}
                key={inputID}
                input={input}
                initalVal={inputData ? inputData.value : undefined}
                onChange={inputData => Tree.updateInputValue(data.path, inputData, input.name)}
              />
            )
          })}
        </div>
      </div>
      {comp.next.length > 0 ?
        <div className={`flow-nextOptions flow-show${state.showAddOptions ? 'True' : 'False'}`}>
          <div className="flow-closePopup" onClick={() => realAdd()}>
            <Add />
          </div>
          <div className="flow-pos">
            <div className="flow-optionsTitle">Options</div>
            {comp.next.map((componentName, key) =>
              <div
                onClick={() => realAdd({ componentName })}
                className="flow-option"
                key={key}
              >{Logic ? Logic.title(componentName) : componentName}</div>
            )}
          </div>
        </div>
        : ''}
      {comp.next.length > 0 ?
        <div className="flow-side">
          <div className="flow-innerSide">
            <div className="flow-round" onClick={() => add()}>
              <Add />
            </div>
          </div>
        </div>
        : ''}
    </div>
  )
}
