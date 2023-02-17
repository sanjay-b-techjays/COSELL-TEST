/* eslint-disable linebreak-style */
import React from 'react';

import { Provider } from 'react-redux';
import ResetPassword from '../app/views/ResetPassword/ResetPassword';
import store from '../app/store/index';
import Banner from '../app/layouts/Minimal/components/Banner/Banner';

export default {
  title: 'ResetPassword',
  component: ResetPassword,
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
      <ResetPassword />
    </div>
  </div>
);

export const Resetpassword = Template.bind({});
