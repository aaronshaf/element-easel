/** @jsx preact.h */

import preact, { Component } from 'preact'

import chunk from 'lodash/chunk'

export default class Gesture extends Component {
  // propTypes: {
  //   path: React.PropTypes.array.isRequired
  // },

  render (props) {
    const path = props.path
    const stroke = '#000000' // TODO: define from XML?

    let lines
    if (props.path.length < 2) {
      return
    } else if (props.path.length < 5) {
      lines = pathToLines(props.path, props.strokeColor)
    } else {
      lines = pathToCurves(props.path, props.strokeColor)
    }

    // console.log({lines})

    return (
      <g>
        {/* The actual gesture */}
        {lines}
      </g>
    )
  }
}

function pathToLines (path, strokeColor) {
  const pairs = path.reduce((prev, next) => {
    if (!prev) { return [[null, next]] }
    return prev.concat([[
      prev[prev.length - 1][1],
      next
    ]])
  }, null).slice(1)

  return pairs.map((pair) => {
    const d = `M ${pair[0].x} ${pair[0].y} L ${pair[1].x} ${pair[1].y}`
    return (
      <Path
        d={d}
        strokeColor={strokeColor}
        width={pair[1].width}
      />
    )
  })
}

function pathToCurves (path, strokeColor) {
  let points = path
  let overlappingSets = []
  for (let i = 0; i < path.length - 2; i += 3) {
    const slice = path.slice(i, i + 4)
    if (slice.length === 4) {
      overlappingSets.push(path.slice(i, i + 4))
    }
  }

  return overlappingSets.map((points) => {
    const M = `${points[0].x} ${points[0].y}`
    const C = `${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y}`
    const d = `M ${M} C ${C}`
    return (
      <Path
        d={d}
        strokeColor={strokeColor}
        strokeWidth={points[1].width}
      />
    )
  })
}

function pointToString (point) {
  return `${point.x} ${point.y}`
}

class Path extends Component {
  render (props) {
    return (
      <path
        className='InkPath'
        fill='none'
        stroke={props.strokeColor || 'red'}
        d={props.d}
        stroke-width={props.strokeWidth || '1px'}
        stroke-linecap='round'
        stroke-linejoin='round'
        opacity={1}
      />
    )
  }
}
