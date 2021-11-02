import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    };
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    };

    constructor(props){
        super(props);
        this.state={
            articles: [],
            loading:false,
            page:1
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
    }

    capitalizeFirstLetter = (stringstr)=>{
        return stringstr.charAt(0).toUpperCase() + stringstr.slice(1);
    }

    async updateNews(){
        this.props.setProgress(10);
        this.setState({loading:true});
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json();
        this.props.setProgress(50);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading:false

        })
        this.props.setProgress(100);
    }
    fetchMoreData = async()=>{
        this.setState({page:this.state.page+1})
        this.setState({loading:true});
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            loading:false

        })
    }

    async componentDidMount(){
        this.updateNews();
    };
    handlePrevious = async()=>{
        this.setState({page:this.state.page-1})
        this.updateNews();
    }
    handleNext = async()=>{
        this.setState({page:this.state.page+1})
        this.updateNews();
    }

    render() {
        return (
            <>
                <h2 className="text-center" style={{width:'35px 0px'}}>NewsMonkey - Top Headlines from {this.capitalizeFirstLetter(this.props.category)}</h2>
                {/* {this.state.loading && <Spinner/>} */}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                >
                <div className="container">
                    <div className="row">
                        {this.state.articles.map((element)=>{
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} 
                                imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} publishedDate={element.publishedAt} source={element.source.name}/>
                            </div>
                        })}
                    </div>
                </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <=1} type="button" className="btn btn-dark" onClick={this.handlePrevious}>&laquo; Previous</button>
                    <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNext}>Next &raquo;</button>
                </div> */}
             </>
        )
    }
}

export default News
