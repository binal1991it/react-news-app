import React, { Component, useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import NewsResult from './NewsResult'
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Pagination from './pagination';

//below code is in class Component mode...


let PageSize = 10; //define page size for pagination...
let BackUrl = `http://127.0.0.1:8000/api/auth/`; //define backend url...
export default class Search extends Component {
  constructor(props) {
    super(props)
    const udata = localStorage.getItem('user') //Store user directly from localStorage...
    const odata = JSON.parse(udata)
    //define all used states...
    this.state = {
      user : odata.user,
      startdate: new Date(),
      sourceSelect:0,
      categorySelect:'Business',
      datePass: moment(new Date()).format("YYYY-MM-DD"),
      sources: [],
      sourcesUrl: '',
      categories: [],
      keyword:'',
      results:[],
      saveSearches:[],
      error: '',
      currentPage:1,
      totalResult:0,
      searchDetails : '',
      search_name:''
    }
    this.getCategory(); // get all details from sources, category and save searches dropdown...
    //below is used for pagiation page number define....
    const currentTableData = (() => {
        const firstPageIndex = (this.state.currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return this.state.results.slice(firstPageIndex, lastPageIndex);
      }, [this.state.currentPage]);
} 
//for save sate common function
    handleUserInput (e, cat=null) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({[name]: value});
    }
//save state for get and store save search data...
    setSaveSearches(e){
        let details = JSON.parse(e.target.value);
        this.setState({searchDetails:details});
    }
//set current page...
    setCurrentPage (page) {
        this.getData(page);
        this.setState({currentPage: page});
    }
//set start page...
    setStartDate (date) {
        const dateForm = moment(date).format("YYYY-MM-DD");
        this.setState({ startdate: date, datePass:dateForm });
    } 
//get and set all selectboxes...
    getCategory() {
        axios.get(BackUrl+'sources')
            .then((res) => {
               if(res.data.status=== 1){
               this.setState({
                  loggedIN : true
               })
               this.setState({ sources : res.data.sources, categories:res.data.categories, saveSearches:res.data.saveSearches })
               }
            }).catch((error) => {
                this.setState({ error: "Oops! Please try again.", sources:[], categories:[] });
            });
    }
//save the search data...
    letSaveSearch(){
        var date = this.state.datePass;
        let sourceVal = this.state.sourceSelect;
        let category = this.state.categorySelect;
        let keyword = this.state.keyword;
        let search_name = this.state.search_name;
        if(!sourceVal || sourceVal == 0){
            alert("Please select any one source!")
        }else if(!search_name){
            alert("Please enter search name for your reference!")
        }else{
            axios.post(BackUrl+'saveSearch', {'date':date,'source': sourceVal, 'category': category, 'keyword':keyword, 'search_name':search_name })
            .then((res) => {
                if(res){
                    alert(res.data.message)
                    window.location.reload();
                }
              }).catch((error) => {
                this.setState({ error: "Oops! Please try again.", results:[] });
             });
        }
         
    }
    resetForm(){
        this.state = {
          startdate: new Date(),
          sourceSelect:0,
          categorySelect:'Business',
          datePass: moment(new Date()).format("YYYY-MM-DD"),
          sources: [],
          sourcesUrl: '',
          categories: [],
          keyword:'',
          results:[],
          saveSearches:[],
          error: '',
          currentPage:1,
          totalResult:0,
          searchDetails : '',
          search_name:''
        }
        window.location.reload();
      }
//get the thirdparty details as per selection...
    getData(page = 1){
        let searchDetails = this.state.searchDetails;
        console.log(searchDetails.length)
        var date = (searchDetails.length != 0 ) ? searchDetails.date : this.state.datePass;
        let sourceVal = (searchDetails.length != 0 ) ? searchDetails.source : this.state.sourceSelect;
        let category = (searchDetails.length != 0 ) ? searchDetails.category : this.state.categorySelect;
        let keyword = (searchDetails.length != 0 && searchDetails.keyword) ? searchDetails.keyword : this.state.keyword;
        let Url = '';
        if(sourceVal==1){
            Url = `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&category=${category}&page=${page}&pageSize=10&from=${date}&apiKey=84ab1ce9c5064dccaa0bf5789a907420`;
        }else if(sourceVal == 4){
            Url = `https://content.guardianapis.com/search?q=${keyword}&sectionName=${category}&page=${page}&pageSize=10&from-date=${date}&show-fields=webTitle,webUrl,thumbnail&api-key=b880629c-7df3-4915-bfdf-dc3436e0cae0`;
        }else if(sourceVal == 5){
            Url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&facet_field=${category}&begin_date=${date}&page=${page}&api-key=2e98QxzEARxGuPNVxNaaDyZqmtSUglKI`;
        }else{
            Url = '';
        }
        axios.get(Url)
            .then((res) => {
                this.setState({totalResult: 0 });
                if(res){
                    let data = [];
                    let details = '';
                    if(sourceVal == 1){
                       details = res.data.articles;
                       Object.keys(details).map(i => {
                           data.push({"title":details[i].title, 'imgUrl': details[i].urlToImage, 'url' : details[i].url});
                       })
                       this.setState({totalResult: res.data.totalResults });
                    }else if(sourceVal == 4){
                       details = res.data.response.results;
                       Object.keys(details).map(i => {
                           data.push({"title":details[i].webTitle,'imgUrl': details[i].fields['thumbnail'], 'url': details[i].webUrl});
                       })
                       this.setState({totalResult: res.data.response.total });
                    }else if(sourceVal == 5){
                       details = res.data.response.docs;
                       Object.keys(details).map(i => {
                           let changeUrl = (details[i].multimedia.length != 0) ? `https://www.nytimes.com/${details[i].multimedia[0].url}`: '';
                           data.push({"title":details[i].abstract,'imgUrl': changeUrl, 'url': details[i].web_url});
                       })
                       this.setState({totalResult: (res.data.response.meta.hits) - 10 });
                    }else{
                        data = [];
                    }
                    this.setState({ results : data })
                }
            }).catch((error) => {
                this.setState({ error: "Oops! Please try again.", results:[] });
            });
    }
  render() {
      //below are all selection
    const sourceData = this.state.sources ;
    const categoryData = this.state.categories;
    const saveSearchesData = this.state.saveSearches;
    let sourceList = sourceData.length > 0
    	&& sourceData.map((item, i) => {
      return (
        <option key={i} value={item.id}>{item.source_name}</option>
      )
    }, this);
    let categoryList = categoryData.length > 0
    	&& categoryData.map((item, i) => {
      return (
        <option key={i} value={item.category_name}>{item.category_name}</option>
      )
    }, this);
    let searchList = saveSearchesData.length > 0
    	&& saveSearchesData.map((item, i) => {
      return (
        <option key={i} value={JSON.stringify(item)}>{item.search_name}</option>
      )
    }, this);
    return (
        <div>
            <div>
            <Container>
            <Row>
                <Col md={4} className="p-2">
                     <Form.Select className="form-control" name="sourceSelect" aria-label="Default select example" onChange={(event) => this.handleUserInput(event)}>
                          <option> - Please Select Source - </option>
                          {sourceList}
                     </Form.Select>
                </Col>
                <Col md={4} className="dateInput p-2"><DatePicker className="form-control" selected={this.state.startdate} placeholderText="Please select Date"  onChange={(date) => this.setStartDate(date)}/></Col>
                <Col md={4} className="dateInput p-2">
                    <Form.Select className="form-control" name="categorySelect" aria-label="Default select example" onChange={(event) => this.handleUserInput(event)}>
                          <option> - Select Category - </option>
                          {categoryList}
                     </Form.Select>
                </Col>

            </Row>
            <Row>
                <Col md={4} className="dateInput p-2">
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        placeholder="Search by keyword"
                        className="form-control"
                        onChange={(event) => this.handleUserInput(event)}
                      />
                </Col>
                <Col md={4} className="p-2">
                     <Form.Select className="form-control" name="searchSelect" aria-label="Default select example" onChange={(event) => this.setSaveSearches(event)}>
                          <option> - Please Select Old Saved Serach - </option>
                          {searchList}
                     </Form.Select>
                </Col>
                <Col md={1} className="p-2"><Button variant="primary" onClick={(event) => this.getData()}>Search</Button></Col>
                <Col md={1} className="p-2"><Button variant="primary" onClick={(event) => this.resetForm()}>Reset</Button></Col>
            </Row>
            <Row>
            <Col md={3} className="p-2">
                    <input
                        type="text"
                        id="search_name"
                        name="search_name"
                        placeholder="Enter search name and save"
                        className="form-control"
                        onChange={(event) => this.handleUserInput(event)}
                      />
                </Col>
                <Col md={2} className="p-2"><Button variant="primary" onClick={(event) => this.letSaveSearch()}>Save Search</Button></Col>
                
            </Row>
            </Container>
            <hr/>
            <NewsResult NewsResult={this.state.results} sourceVal={this.state.sourceSelect}/>
            <Pagination
                    className="pagination-bar"
                    currentPage={this.state.currentPage}
                    totalCount={this.state.totalResult}
                    pageSize={PageSize}
                    onPageChange={page => this.setCurrentPage(page)}
                  />
            </div>
        </div>
    )
  }
}
