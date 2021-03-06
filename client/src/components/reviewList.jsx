import React from 'react';
import Review from './review.jsx';
import { ReviewListStyle, SeeMoreReviews } from '../styles/reviewList.style.js';


const ReviewList = (props) => {
  let currentReviews;
  if (props.reviewsBySearchAndTier) {
    currentReviews = props.reviewsBySearchAndTier;
  } else if (props.reviewsBySearch && !props.reviewsByTier) {
    currentReviews = props.reviewsBySearch;
  } else if (props.reviewsByTier && !props.reviewsBySearch) {
    currentReviews = props.reviewsByTier;
  } else {
    currentReviews = props.totalReviews;
  }

  return (
    <ReviewListStyle>
      {props.displayedReviews.map((review, index) => <Review displayedReviews={props.displayedReviews} key={index} reviewNumber={index + 1} review={review} currentSearchTerm={props.currentSearchTerm} />)}
      {props.totalReviews.length > 12 &&
      props.displayedReviews.length !== currentReviews.length &&
      <SeeMoreReviews onClick={ props.showTwelveMoreReviews }>See more reviews</SeeMoreReviews>
      }
    </ReviewListStyle>
  );
};

export default ReviewList;