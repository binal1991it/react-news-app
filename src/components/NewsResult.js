import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NewsResult extends Component {
    constructor(props) {
        super(props)
        const udata = localStorage.getItem('user')
        const odata = JSON.parse(udata)
        this.state = {
          user : odata.user,
        }
    }
  render() {
     const results = (this.props.NewsResult.length != 0) ? this.props.NewsResult : 0;
     const sourceVal = (this.props.sourceVal != 0) ? this.props.sourceVal : 0;
     
     let test = (results != 0) ? Object.keys(results).map(i => {
        if(results[i].title){
            return <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" key={i}>
                   <div class="card-flyer">
                       <div class="text-box">
                           <div class="image-box">
                              <img src={(results[i].imgUrl) ? results[i].imgUrl : 'logo512.png' } alt="NewsImage" onerror="this.src='logo512.png';"/>
                           </div>
                           <div class="text-container">
                           <a href={(results[i].url) ? results[i].url : '#'} target="_blank">
                           <h6 style={{height:"130px"}}>{(results[i].title) ? (results[i].title).substring(0, 100).concat('...'): ''}</h6>
                           </a>
                       </div>
                    </div>
                </div>
            </div>; 
        }
     }) : <div>Oops! No News Found!</div>;
    return (
      <div>
        <div id="cards_landscape_wrap-2">
          <div class="container">
                <div class="row">
                      {test}
                </div>
            </div>
        </div>
      </div>
    )
  }
}
