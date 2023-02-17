/* eslint-disable linebreak-style */
import React from 'react';

import { Provider } from 'react-redux';
import ForgotPassword from '../app/views/ForgotPassword/ForgotPassword';
import store from '../app/store/index';
import Banner from '../app/layouts/Minimal/components/Banner/Banner';

export default {
  title: 'ForgotPassword',
  component: ForgotPassword,
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
      <ForgotPassword />
    </div>
  </div>
);

export const Forgotpassword = Template.bind({});
