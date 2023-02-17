import { Provider } from 'react-redux';
import store from '../app/store/index';
import Menubar from './../app/layouts/Main/components/Menubar/Menubar';
import PreviewPartnership from '../app/views/PreviewPartnership/PreviewPartnership';

export default {
  title: 'PreviewPartnership',
  component: PreviewPartnership,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = () => {
  return (
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
        <PreviewPartnership />
      </div>
    </div>
  );
};

export const Previewpartnership = Template.bind({});
