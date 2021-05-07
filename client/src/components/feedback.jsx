import React from 'react';

class Feedback extends React.Component {
  constructor(props) {
    // console.log('Props in Feedback:', props);
    super(props);
    this.filterByTier = this.filterByTier.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      currentTier: null
    };
  }

  getPercentage(tier1 = 0, tier2 = 0) {
    let percentage = (tier1 + tier2) / this.props.ratings.totalRatings * 100;
    if (0 < percentage && percentage < 1) {
      return '< 1%';
    }
    return Math.round(percentage) + '%';
  }

  handleClick(tier) {
    this.filterByTier(tier);
    document.getElementById('select').value = tier.toString();
  }

  handleSelect(e) {
    this.filterByTier(Number(e.target.value));
  }

  filterByTier(tier) {
    if (!this.props.reviewsBySearch) {
      this.props.setReviewsFilteredByTier(tier);
    } else {
      this.props.setReviewsFilteredBySearchAndTier(null, tier);
    }
    this.setState({currentTier: tier});
  }

  removeFilter() {
    this.props.setReviewsFilteredByTier(0);
    this.setState({currentTier: null});
    document.getElementById('select').value = '0';
  }



  // if a percentage is 0%, render it gray
  render() {
    if (this.props.ratings.totalRatings === 0) {
      return (
        <div>
          <h2>Student feedback</h2>
          <div>This course does not have any ratings yet.</div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Student feedback</h2>
          <div>{this.props.ratings.overallRating.toFixed(1)} Course Rating</div>

          <div onClick={() => this.handleClick(5)}>
            5 stars: {this.getPercentage(this.props.ratings['5'])}</div>
          {this.state.currentTier === 5 ? <button onClick={this.removeFilter}>X</button> : null}

          <div onClick={() => this.handleClick(4)}>
            4 stars: {this.getPercentage(this.props.ratings['4 1/2'], this.props.ratings['4'])}</div>
          {this.state.currentTier === 4 ? <button onClick={this.removeFilter}>X</button> : null}

          <div onClick={() => this.handleClick(3)}>
            3 stars: {this.getPercentage(this.props.ratings['3 1/2'], this.props.ratings['3'])}</div>
          {this.state.currentTier === 3 ? <button onClick={this.removeFilter}>X</button> : null}

          <div onClick={() => this.handleClick(2)}>
            2 stars: {this.getPercentage(this.props.ratings['2 1/2'], this.props.ratings['2'])}</div>
          {this.state.currentTier === 2 ? <button onClick={this.removeFilter}>X</button> : null}

          <div onClick={() => this.handleClick(1)}>
            1 star: {this.getPercentage(this.props.ratings['1 1/2'], this.props.ratings['1'])}</div>
          {this.state.currentTier === 1 ? <button onClick={this.removeFilter}>X</button> : null}

          <select id="select" onChange={this.handleSelect}>
            <option value="0">All ratings</option>
            <option value="5">Five stars</option>
            <option value="4">Four stars</option>
            <option value="3">Three stars</option>
            <option value="2">Two stars</option>
            <option value="1">One star</option>
          </select>
        </div>
      );
    }
  }
}



export default Feedback;