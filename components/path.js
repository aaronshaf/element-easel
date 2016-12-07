/** @jsx preact.h */

import preact, { Component } from 'preact'

import chunk from 'lodash/chunk'

export default class Gesture extends Component {
  // propTypes: {
  //   path: React.PropTypes.array.isRequired
  // },

  render (props) {
    const path = props.path
    const strokeWidth = props.strokeWidth // TODO: define from xml?
    const stroke = '#000000' // TODO: define from XML?

    let d
    if (props.path.length < 4) {
      return
    } else if (props.path.length < 5) {
      d = pathToLines(props.path)
    } else {
      d = pathToQuadraticCurves(props.path)
    }

    return (
      <g>
        {/* The actual gesture */}
        <path
          className='InkPath'
          fill='none'
          stroke={props.color}
          d={d}
          stroke-width={strokeWidth}
          stroke-linecap='round'
          stroke-linejoin='round'
          opacity={1}
        />

        {/* The larger hitpath for easier selection */}
        <path
          className='hitpath'
          fill='none'
          stroke={stroke}
          d={d}
          strokeWidth={12}
          strokeLinecap='round'
          strokeLinejoin='round'
          opacity={0.01}
        />
      </g>
    )
  }
}

function pathToLines (path) {
  let points = chunk(path.join(',').split(','), 2)
  const point1 = points[0].join(' ')
  let lPoints = points.slice(1)
  let lines = lPoints
    .map((pair) => pair.join(' '))
    .join(' L ')
  return `M${point1} L ${lines}`
}

function pathToQuadraticCurves (path) {
  let points = chunk(path.join(',').split(','), 2)
  const point1 = points[0].join(' ')
  let qChunks = chunk(points.slice(1), 2)
  // if insufficient points for last quadratic curve, fill it out
  if (qChunks.length && qChunks[qChunks.length - 1].length === 1) {
    // qChunks[qChunks.length - 1][1] = qChunks[qChunks.length - 1][0]
    qChunks.pop()
  }
  let quadratics = qChunks
    .map((pair) => pair.map((point) => point.join(' ')))
    .join(' Q ')
  return `M${point1} Q ${quadratics}`
}
