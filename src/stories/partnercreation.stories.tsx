/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React from 'react';
import { Provider } from 'react-redux';
import { CreatePartnershipStepperLabels } from '../strings';
import CreatePartnerShip from '../app/views/CreatePartnership';
import store from '../app/store/index';
import PartnerShipInfo from '../app/views/CreatePartnership/components/PartnerShipInfo';
import CompanyInfo from '../app/views/CreatePartnership/components/CompanyInfo';
import CompanyPartnerInfo from '../app/views/CreatePartnership/components/CompanyPartnerInfo';
import CoordinatorPartnerInfo from '../app/views/CreatePartnership/components/CoordinatorPartnerInfo';

export default {
  title: 'CreatePartnerShip',
  component: CreatePartnerShip,
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const steps = [
  CreatePartnershipStepperLabels.step1,
  CreatePartnershipStepperLabels.step2,
  CreatePartnershipStepperLabels.step3,
  CreatePartnershipStepperLabels.step4,
];

const PartnershipInfo = () => (
  <PartnerShipInfo history="" steps={steps} isUpdate={false} />
);

export const Partnershipinfo = PartnershipInfo.bind({});

const Companyinfo = () => (
  <CompanyInfo steps={steps} history={undefined} isUpdate={false} />
);
export const companyinfo = Companyinfo.bind({});

const Companypartnerinfo = () => (
  <CompanyPartnerInfo steps={steps} history={undefined} isUpdate={false} />
);
export const companypartnerinfo = Companypartnerinfo.bind({});

const CoordinatorPartnerinfo = () => {
  return (
    <CoordinatorPartnerInfo
      steps={steps}
      history={undefined}
      isUpdate={false}
    />
  );
};
export const coordinatorpartnerinfo = CoordinatorPartnerinfo.bind({});
