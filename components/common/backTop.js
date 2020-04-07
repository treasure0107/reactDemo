import React, { Component } from 'react'

class BackTop extends Component {
  constructor(props) {
    super(props)
    this.backToTop = this.backToTop.bind(this)
  }
  render() {
    return (
      <div className="backTop" onClick={this.backToTop}>{this.props.children}</div>
    )
  }
  backToTop() {
    const timer = setInterval(() => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      var speed = Math.floor(-scrollTop / 2)
      document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed
      if (scrollTop == 0) {
        clearInterval(timer)
      }
    }, 16)
  }
}

export default BackTop