import React, { useEffect, useState } from 'react'
import Block from './block'

const GraphPart = function ({
  connectTo,
  connectToInstance,
  itemWidth,
  width,
  Logic,
  Tree,
  data,
}) {
  const [state, setState] = useState({
    element: undefined,
    lastParentPosition: 0,
  })

  const [_, forceUpdate] = useState(false)

  let mounted = false

  function watchParent() {
    if (mounted) {
      let parentEl = connectTo
      let parent = undefined
      if (parentEl) {
        parent = parentEl.getBoundingClientRect()
        if (parent.top != state.lastParentPosition) {
          setState({
            lastParentPosition: parent.top
          })
        }
      }
      setTimeout(() => {
        watchParent()
      }, 800)
    }
  }

  useEffect(() => {
    mounted = true
    watchParent()
    return () => mounted = false
  }, [])

  let parentLineHeight = 0
  let parentLineToTop = 0
  let type = ''

  if (connectTo && state.element) {
    let parent = connectTo.getBoundingClientRect()
    let child = state.element.getBoundingClientRect()
    let spaceBetween = (parent.y + (parent.height / 2)) - (child.y + (child.height / 2))

    if (spaceBetween == 0) {
      parentLineHeight = 20
      parentLineToTop = 10
      type = 'straight'
    } else if (spaceBetween < 0) {
      parentLineHeight = ((-spaceBetween) + 20)
      parentLineToTop = parentLineHeight - 10
      type = 'bottomToTop'
    } else {
      parentLineHeight = spaceBetween + 20
      parentLineToTop = 10
      type = 'topToBottom'
    }
  }
  return (
    <div className="flow-graphPart" style={{ width }}>
      {parentLineHeight && parentLineToTop && type ?
        <div className="flow-lineToParrent" style={{ bottom: `${parentLineToTop}px` }}>
          <svg viewBox={`0 0 80 ${parentLineHeight}`} height={`${parentLineHeight}px`} style={{ minHeight: `${parentLineHeight}px` }} xmlns="http://www.w3.org/2000/svg">
            {type == 'bottomToTop' ?
              <path
                strokeWidth="7"
                stroke="#ccc"
                strokeLinecap="round"
                fill="none"
                d={`M0,10 C70,10 30,${parentLineHeight - 10} 80,${parentLineHeight - 10}`}
              />
              : type == 'topToBottom' ?
                <path
                  strokeWidth="7"
                  stroke="#ccc"
                  strokeLinecap="round"
                  fill="none"
                  d={`M0,${parentLineHeight - 10} C70,${parentLineHeight - 10} 30,10 80,10`}
                />
                :
                <path
                  strokeWidth="7"
                  stroke="#ccc"
                  strokeLinecap="round"
                  fill="none"
                  d="M0,10 C70,10 30,10 80,10"
                />
            }
          </svg>
        </div>
        : ''}
      <div
        ref={element => {
          let parentEl = connectTo
          let parent = undefined
          if (parentEl) {
            parent = parentEl.getBoundingClientRect()
          }

          if (typeof state.element == 'object') {
            if (!parent || parent.top == state.lastParentPosition) {
              return
            }
          }

          let toUpdate = {
            element,
          }

          if (parent) {
            toUpdate.lastParentPosition = parent.top
          }

          setState(toUpdate)
        }}
        className="flow-graph"
        style={{ minWidth: itemWidth }}
      >
        <Block
          Tree={Tree}
          Logic={Logic}
          data={data}
          graphInstanceForceUpdate={forceUpdate(v => !v)}
          graphParrentInstance={connectToInstance}
        />
      </div>
      <div className="flow-next">
        {data.next.map((item, i) =>
          <GraphPart
            Tree={Tree}
            Logic={Logic}
            connectTo={state.element}
            connectToInstance={this}
            width={width - itemWidth}
            itemWidth={itemWidth}
            key={i}
            data={item}
          />
        )}
      </div>
    </div>
  )
}

export default GraphPart
