import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SimpleVScrollbar from './lib';


/**
 * Application
 */
class App extends Component {
  /**
   * constructor
   */
  constructor() {
    super();
    this.changeText = this.changeText.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      change: true,
      top: 0,
    };
  }

  /**
   * change text
   * @param {event} e
   */
  changeText(e) {
    const top = e.target.value;

    this.setState({
      change: this.state.reset,
      top: Number(top),
    });
  }

  /**
   * scroll top
   */
  scrollTop() {
    this.setState({
      change: true,
      top: this.state.top,
    });
  }

  /**
   * reset scroll top props
   */
  reset() {
    this.setState({
      change: false,
      top: this.state.top,
    });
  }

  /**
   * render
   * @return {*}
   */
  render() {
    const addAttributes = {};
    if (this.state.change) {
      addAttributes.top = this.state.top;
    }

    return (
      <div>
        <input onChange={this.changeText} type="number" />
        <button onClick={this.scrollTop}>scroll top</button>
        <SimpleVScrollbar
          width={400}
          height={400}
          className="svs"
          autoHide={false}
          scrollTop={this.reset}
          {...addAttributes}
        >
          <div>
            <div style={{
              width: '100%',
              height: '100vh',
              backgroundColor: 'red',
              opacity: '.5',
            }} />
            <div style={{
              width: '100%',
              height: '100vh',
              backgroundColor: 'orange',
              opacity: '.5',
            }} />
            <div style={{
              width: '100%',
              height: '100vh',
              backgroundColor: 'yellow',
              opacity: '.5',
            }} />
            <div style={{
              width: '100%',
              height: '100vh',
              backgroundColor: 'green',
              opacity: '.5',
            }} />
            <div style={{
              width: '100%',
              height: '100vh',
              backgroundColor: 'blue',
              opacity: '.5',
            }} />
          </div>
        </SimpleVScrollbar>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
