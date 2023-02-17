/* eslint-disable linebreak-style */
import React from 'react';

import { Provider } from 'react-redux';
import VerifyEmail from '../app/views/VerifyEmail/VerifyEmail';
import store from '../app/store/index';
import Banner from '../app/layouts/Minimal/components/Banner/Banner';

export default {
  title: 'VerifyEmail',
  component: VerifyEmail,
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
      <VerifyEmail />
    </div>
  </div>
);

export const Verifymail = Template.bind({});
