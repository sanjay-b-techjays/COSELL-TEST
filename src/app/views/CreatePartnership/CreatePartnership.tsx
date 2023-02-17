/* eslint-disable linebreak-style */
/* eslint-disable prefer-const */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { CreatePartnershipStepperLabels } from '../../../strings';
import PartnerShipInfo from './components/PartnerShipInfo';
import CompanyInfo from './components/CompanyInfo';
import CompanyPartnerInfo from './components/CompanyPartnerInfo';
import CoordinatorPartnerInfo from './components/CoordinatorPartnerInfo';
import './createPartnership.css';

const CreatePartnership = () => {
  let queryparams = new URLSearchParams(window.location.search);
  const form = queryparams.get('form');
  const isUpdate = queryparams.get('type') === 'update';
  const history = useHistory();

  const steps = [
    CreatePartnershipStepperLabels.step1,
    CreatePartnershipStepperLabels.step2,
    CreatePartnershipStepperLabels.step3,
    // CreatePartnershipStepperLabels.step4,
  ];

  switch (form) {
    case 'PartnerShipInfo':
      return (
        <PartnerShipInfo steps={steps} history={history} isUpdate={isUpdate} />
      );
    case 'CompanyInfo':
      return (
        <CompanyInfo steps={steps} history={history} isUpdate={isUpdate} />
      );
    case 'CompanyPartnerInfo':
      return (
        <CompanyPartnerInfo
          steps={steps}
          history={history}
          isUpdate={isUpdate}
        />
      );
    // case 'CoordinatorPartnerInfo':
    //   return (
    //     <CoordinatorPartnerInfo
    //       steps={steps}
    //       history={history}
    //       isUpdate={isUpdate}
    //     />
    //   );

    default:
      return (
        <PartnerShipInfo isUpdate={isUpdate} steps={steps} history={history} />
      );
      break;
  }
};

export default CreatePartnership;
