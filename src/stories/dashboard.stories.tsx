/* eslint-disable linebreak-style */
import { Provider } from 'react-redux';
import store from '../app/store/index';
import Menubar from '../app/layouts/Main/components/Menubar/Menubar';
import Dashboard from '../app/views/Dashboard';

export default {
  title: 'Dashboard',
  component: Dashboard,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = () => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      background: 'rgba(144, 160, 183, 0.1)',
    }}
  >
    <div style={{ width: '20%' }}>
      <Menubar />
    </div>
    <div style={{ width: '80%' }}>
      <Dashboard />
    </div>
  </div>
);

export const Default = Template.bind({});
