import React from 'react'
import ReactDOM from 'react-dom'

const expectRenderError = (element, expectedError) => {
  // Noop error boundary for testing.
  class TestBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { didError: false }
    }

    componentDidCatch(err) {
      this.setState({ didError: true })
    }

    render() {
      if (this.state.didError) {
        return null
      }
      return this.props.children
    }
  }

  // Record all errors.
  const topLevelErrors = []
  function handleTopLevelError(event) {
    topLevelErrors.push(event.error)
    // Prevent logging
    event.preventDefault()
  }

  const div = document.createElement('div')
  window.addEventListener('error', handleTopLevelError)
  try {
    ReactDOM.render(<TestBoundary>{element}</TestBoundary>, div)
  } finally {
    window.removeEventListener('error', handleTopLevelError)
  }

  expect(topLevelErrors.length).toBe(1)
  expect(topLevelErrors[0].message).toContain(expectedError)
}

export default expectRenderError
