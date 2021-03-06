import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { sampleDataForOneCourse } from '../../fixtures/sampleDataForOneCourse.js';

import Featured from '../../../client/src/components/featured.jsx';

describe ('Featured component', () => {

  const wrapper = mount(<Featured review={sampleDataForOneCourse.reviews[1]}/>);

  it ('shows the reviewer\'s initials if no avatar is present', () => {
    const value = wrapper.find('.featuredReviewerAvatar').first().props().children.props.children;
    expect(value).toBe('PP');
  });

  const reviewParts = ['reviewerName', 'reviewerCoursesTaken', 'reviewerReviews', 'reviewDate', 'reviewComment'];
  reviewParts.forEach((reviewPart) => {
    it (`has a value for ${reviewPart}`, () => {
      let value = wrapper.find(`.${reviewPart}`).first().props().children;
      expect(value).toBeDefined();
    });
  });
});