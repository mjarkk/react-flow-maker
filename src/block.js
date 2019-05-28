import React from 'react'
import Input from './input'
import {Delete, Add, DropDown, DropUp} from './icons'
import ToolTip from './tooltip'

export default class Block extends React.Component {
  constructor() {
    super()

    this.state = {
      hover: false,
      showAddOptions: false,
      showAdvanced: false,
    }

    this.remove = this.remove.bind(this)
  }
  remove() {
    this.props.graphInstance.props.Tree
    .removeComponent(this.props.graphInstance.props.data.path)
  }
  add() {

    if (this.props.graphInstance.props.data.component.next.length == 1) {
      this.realAdd(this.props.graphInstance.props.data.component.next[0])
      return
    }

    this.setState({
      showAddOptions: true,
    })
  }
  realAdd(toAdd) {
    this.setState({
      showAddOptions: false,
    })

    if (!toAdd) {
      return
    }

    this.props.Tree.addComponent(toAdd, this.props.graphInstance.props.data.path)
  }
  render() {
    const data = this.props.graphInstance.props.data
    if (!data) {
      return ''
    }
    const comp = data.component
    const inputs = comp.inputs
    const advancedInputs = comp.advancedInputs

    return (
      <div 
        className={`flow-fullBlock flow-hover${this.state.hover && !this.state.showAddOptions ? 'True' : 'False'}`}
        onMouseOver={() => {
          if (!this.state.hover) {
            this.setState({hover: true})
          }
        }}
        onMouseOut={() => {
          if (this.state.hover) {
            this.setState({hover: false})
          }
        }}
      >
        <div className="flow-side">
          <div className="flow-innerSide">
            <div className="flow-round" onClick={this.remove}>
              <Delete/>
            </div>
          </div>
        </div>
        <div className="flow-middle">
          <div className="flow-title">{comp.title}<ToolTip transparrent={true} tip={comp.tooltip}/></div>
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
                    onChange={inputData => {
                      this.props.graphInstance.props.Tree
                      .updateInputValue(data.path, inputData, inputID, false)
                    }}
                  />
                )
              })
            }
            {advancedInputs.length > 0?
              <div className="flow-showAdvanced">
                <div 
                  className="flow-button"
                  onClick={() => {
                    this.setState({showAdvanced: !this.state.showAdvanced}, () => {
                      if (this.props.graphParrentInstance) {
                        this.props.graphParrentInstance.forceUpdate()
                      } else if (this.props.graphInstance) {
                        this.props.graphInstance.forceUpdate()
                      }
                    })
                  }}
                >Advanced {this.state.showAdvanced ? <DropUp/> : <DropDown/>}</div>
              </div>
            :''}
          </div>
          <div className={`flow-inputs flow-advancedInputs flow-show${this.state.showAdvanced ? 'True' : 'False'}`}>
            {advancedInputs.map((input, inputID) => {
              const inputData = data.inputData[input.name]
              return (
                <Input
                  hiddenDropdown={!this.state.showAdvanced}
                  key={inputID}
                  input={input}
                  initalVal={inputData ? inputData.value : undefined}
                  onChange={inputData => {
                    this.props.graphInstance.props.Tree
                    .updateInputValue(data.path, inputData, inputID, true)
                  }}
                />
              )
            })}
          </div>
        </div>
        {comp.next.length > 0 ?
          <div className={`flow-nextOptions flow-show${this.state.showAddOptions ? 'True' : 'False'}`}>
            <div className="flow-closePopup" onClick={() => this.realAdd()}>
              <Add/>
            </div>
            <div className="flow-pos">
              <div className="flow-optionsTitle">Options</div>
              {comp.next.map((componentName, key) => 
                <div 
                  onClick={() => this.realAdd({componentName})} 
                  className="flow-option" 
                  key={key}
                >{this.props ? this.props.graphInstance.props.Logic.title(componentName) : componentName}</div>
              )}
            </div>
          </div>
        :''}
        {comp.next.length > 0 ?
          <div className="flow-side">
            <div className="flow-innerSide">
              <div className="flow-round" onClick={() => this.add()}>
                <Add/>
              </div>
            </div>
          </div>
        :''}
      </div>
    )
  }
}
