/** @jsx preact.h */
import preact from 'preact'
import Draw from './components'
import createElementClass from 'create-element-class'

const DrawElement = createElementClass({
  connectedCallback() {
    Object.defineProperties(this.style, {
      display: {value: 'inline-block'},
      position: {value: 'relative'}
    })
    this.updateRendering()
  },

  updateRendering() {
    this.div = preact.render(<Draw
      height={this.clientHeight}
      width={this.clientWidth}
      color={this.getAttribute('color')}
      strokeWidth={this.getAttribute('stroke-width')}
    />, this, this.lastChild)
    Object.defineProperties(this.div.style, {
      position: {value: 'absolute'},
      left: {value: 0},
      top: {value: 0}
    })
    this.rendered = true
  },

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.rendered) { this.updateRendering() }
  }
})
DrawElement.observedAttributes = ['for', 'color', 'stroke-width']

export default DrawElement
