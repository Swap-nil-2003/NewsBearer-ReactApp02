import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
//import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps={
      country:'in',
      pageSize:8,
      category: 'general'
    }
    static propTypes={
      country: PropTypes.string,
      pageSize:PropTypes.number,
      category : PropTypes.string
    }

    constructor(props){
        super(props);
        this.state={
            articles: [],
            loading: false,
            page:1,
            totalResults:0
        }
    }
    async updateNews(){
      this.props.setProgress(10);
      let url=`https:newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}`
        this.setState({loading:true});
        let data= await fetch(url);
        this.props.setProgress(30);
        let parsedData= await data.json();
        this.props.setProgress(70);
        this.setState({articles: parsedData.articles, totalResults:parsedData.totalResults,loading:false
      });
      this.props.setProgress(100);
    }

    async componentDidMount(){
        this.updateNews();
    }

    handlePrevClick= async ()=>{
      let url=`https:newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page-1}&pageSize=${this.props.pageSize}`
      this.setState({loading:true});
      let data= await fetch(url);
      let parsedData= await data.json();

      this.setState({
        page:this.state.page-1,
        articles: parsedData.articles,
        loading:false
      })
    }
    handleNextClick= async ()=>{
      if(!(this.state.page+1>Math.ceil(this.state.totalResults/(this.props.pageSize))))
      {
        let url=`https:newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
      let data= await fetch(url);
      let parsedData= await data.json();

      this.setState({
        page:this.state.page+1,
        articles: parsedData.articles,
        loading:false
      })
      }
    }
    CapitalizeFirstLetter=(string)=>{
        return string.charAt(0).toUpperCase()+string.slice(1);
    }
    /*fetchMoreData = async() => {
      this.setState({page: this.state.page+1});
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data= await fetch(url);
        let parsedData= await data.json();
        this.setState({articles: this.state.articles.concat(parsedData.articles), totalResults:parsedData.totalResults,loading:false
      })
    };*/

  render() {
    return (
      <>
        <h2 className="text-center" style={{margin: '35px 0px',marginTop:'90px'}}>NewsBearer - Top News Headlines from {this.CapitalizeFirstLetter(this.props.category)}</h2>
         {this.state.loading&&<Spinner/>} 

        {/* <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        > */}
          <div className="container">
        <div className="row px-2">
            {this.state.articles.map((element)=>{
                return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title?element.title:""} description={element.description?element.description.slice(0,75):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
            })}
        </div>
        </div>
        {/* </></InfiniteScroll> */}
         <div className="container d-flex justify-content-between my-2">
        <button disabled={this.state.page<=1} type="button" className="btn btn-secondary" onClick={this.handlePrevClick}>&larr;Previous</button>
        <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)}type="button" className="btn btn-secondary" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> 
      </>
    )
  }
}

export default News
