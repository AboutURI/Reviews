import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { sampleDataForOneCourse } from '../../fixtures/sampleDataForOneCourse.js';

import ReviewList from '../../../client/src/components/reviewList.jsx';
import ReviewService from '../../../client/src/reviewService.jsx';
import Review from '../../../client/src/components/review.jsx';

describe ('ReviewList component', () => {
  const reviewServiceWrapper = mount(<ReviewService courseId={9}/>);
  const instance = reviewServiceWrapper.instance();

  reviewServiceWrapper.setState({
    totalReviews: sampleDataForOneCourse.reviews,
    currentSearchTerm: 'quas',
    reviewsBySearch: [sampleDataForOneCourse.reviews[0], sampleDataForOneCourse.reviews[1], sampleDataForOneCourse.reviews[4]],
    displayedReviews: [sampleDataForOneCourse.reviews[0], sampleDataForOneCourse.reviews[1], sampleDataForOneCourse.reviews[4]]
  });

  const wrapper = mount(<ReviewList totalReviews={instance.state.totalReviews} reviewsBySearch={instance.state.reviewsBySearch} currentSearchTerm={instance.state.currentSearchTerm} displayedReviews={instance.state.displayedReviews}/>);

  it ('only renders reviews if some are passed down from ReviewService', () => {
    expect(wrapper.containsMatchingElement(<Review/>)).toBe(true);
  });

});