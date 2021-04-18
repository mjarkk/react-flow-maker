import React, { useEffect, useState } from 'react'
import './style.styl'
import LogicClass from './src/logic'
import TreeClass from './src/flowTree'
import AddButton from './src/addbutton'
import GraphPart from './src/graphPart'
import sha1 from 'js-sha1'

class LastLogicHash {
  constructor() {
    this.val = ''
  }
}

export default function FlowMaker({ flow, logic, onChange }) {
  const [_, setForceUpdateVal] = useState(false);
  const forceUpdate = () => setForceUpdateVal(v => !v);

  const [Logic] = useState(new LogicClass())
  const [Tree] = useState(new TreeClass(Logic, forceUpdate))

  const [lastlogicHash] = useState(new LastLogicHash)

  const [settings, setSettings] = useState(Logic.get())

  function afterMount() {
    if (typeof onChange == 'function')
      Tree.setExportFunc(onChange)
    if (typeof flow == 'object')
      Tree.import(flow)
  }

  useEffect(() => {
    const newHash = sha1(logic)
    if (newHash != lastlogicHash.val) {
      lastlogicHash.val = newHash
      setSettings(Logic.parseNewLogic(logic))
    } else {
      afterMount()
    }
  }, [])

  useEffect(() => {
    afterMount()
  }, [settings])

  return (
    <div className="flowMakerComp">
      <div className="flowMakerContainer" style={{ minWidth: `${250 + (380 * Tree.maxDepth)}px` }}>
        <div className="flow-row" style={{ minWidth: '250px' }}>
          {settings.introComponents.length > 0 ?
            <div className="flow-startPoint">
              <h3>Start here</h3>
              <AddButton
                Tree={Tree}
                Logic={Logic}
                options={settings.introComponents}
                out={componentName => Tree.startFlow(componentName)}
              />
            </div>
            : ''}
        </div>

        <div className="flow-actualGraph" style={{ width: `${380 * Tree.maxDepth}px` }}>
          {Tree.flow.map((item, i) =>
            <GraphPart
              Tree={Tree}
              Logic={Logic}
              width={380 * Tree.maxDepth}
              itemWidth={380}
              key={i}
              data={item}
            />
          )}
        </div>
      </div>
    </div>
  )
}
