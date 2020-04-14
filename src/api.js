import React from 'react'
import ReactDom from 'react-dom'
import './index.less'
import logo from './images/111.png'
class Search extends React.Component {
    render() {
        return <div className="title"> React <img src={ logo }></img></div>
    }
}

ReactDom.render(
    <Search />,
    document.getElementById('root')
)