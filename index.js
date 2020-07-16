import React from './react';
import ReactDom from './react-dom';

const ele = (
  <div className='active' title='123'>
    hello,<span>react</span>
  </div>
)
// function Home() {
//   return (
//     <div className='active' title='123'>
//     hello,<span>react</span>
//   </div>
//   )
// }

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentWillReceiveProps(props) {
    console.log('props')
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }
  
  handleClick() {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div className='active' title='123'>
        {this.state.num}
        hello,<span>react</span>
        <button onClick={this.handleClick.bind(this)}>点击</button>
      </div>
    )
  }
}

ReactDom.render(ele, document.getElementById('root'))