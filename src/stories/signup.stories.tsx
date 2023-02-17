/* eslint-disable linebreak-style */
import React from 'react';

import { Provider } from 'react-redux';
import SignUp from '../app/views/SignUp/SignUp';
import store from '../app/store/index';
import Banner from '../app/layouts/Minimal/components/Banner/Banner';

export default {
  title: 'SignUp',
  component: SignUp,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = () => (
  <div style={{ width: '100%', display: 'flex' }}>
    <div style={{ width: '50%' }}>
      <Banner />
    </div>
    <div style={{ width: '50%' }}>
      <SignUp />
    </div>
  </div>
);

export const Signup = Template.bind({});
