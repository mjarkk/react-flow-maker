import React, { useEffect, useState, useRef } from 'react'
import Block from './block'

const GraphPart = function ({
  connectTo,
  forceUpdateParent,
  itemWidth,
  width,
  Logic,
  Tree,
  data,
  reRenderFullTree,
}) {
  const [connectionLine, setConnectionLine] = useState({
    parentLineHeight: 0,
    parentLineToTop: 0,
    type: '',
  })

  const [_, setForceUpdateState] = useState(false)
  const forceUpdate = () => setForceUpdateState(v => !v)

  const blockContainer = useRef(null)

  function getConnectionLine() {
    let parentLineHeight = 0
    let parentLineToTop = 0
    let type = ''

    if (connectTo && blockContainer.current) {
      let parent = connectTo.getBoundingClientRect()
      let child = blockContainer.current.getBoundingClientRect()
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

    return {
      parentLineHeight,
      parentLineToTop,
      type,
    }
  }

  const {
    parentLineHeight,
    parentLineToTop,
    type,
  } = getConnectionLine()

  function checkConnectionLine() {
    if (!connectTo || !blockContainer.current) return

    const {
      parentLineHeight,
      parentLineToTop,
      type,
    } = getConnectionLine()

    if (
      parentLineHeight != connectionLine.parentLineHeight
      || parentLineToTop != connectionLine.parentLineToTop
      || type != connectionLine.type
    ) {
      setConnectionLine({
        parentLineHeight,
        parentLineToTop,
        type,
      })
    }
  }

  useEffect(() => {
    const checkPositionsLoop = setInterval(() => checkConnectionLine(), 700);
    return () => clearInterval(checkPositionsLoop);
  }, [connectionLine, connectTo, blockContainer])

  useEffect(() => {
    if (connectTo) forceUpdate()
  }, [connectTo])

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
        ref={blockContainer}
        className="flow-graph"
        style={{ minWidth: itemWidth }}
      >
        <Block
          Tree={Tree}
          Logic={Logic}
          data={data}
          graphInstanceForceUpdate={forceUpdate}
          graphParrentInstanceForceUpdate={forceUpdateParent}
          reRenderFullTree={reRenderFullTree}
        />
      </div>
      <div className="flow-next">
        {data.next.map((item, i) =>
          <GraphPart
            Tree={Tree}
            Logic={Logic}
            connectTo={blockContainer.current}
            forceUpdateParent={forceUpdate}
            width={width - itemWidth}
            itemWidth={itemWidth}
            key={i}
            data={item}
            reRenderFullTree={reRenderFullTree}
          />
        )}
      </div>
    </div>
  )
}

export default GraphPart
