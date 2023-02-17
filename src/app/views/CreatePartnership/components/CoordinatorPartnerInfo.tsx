/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable react/require-default-props */
/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { MenuItem, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'src/app/components/Loader';
import { getRequest } from '../../../service';
import { RenderErrorMessage, GenTextField } from '../../SalesHubSite/Form';
import { useStyles } from '../../SalesHubSite/Styles';
import PrimaryButton from '../../../components/Button/PrimaryButton';
import SecondaryButton from '../../../components/Button/SecondaryButton';
import {
  PartnerShipCoordinatorInfoLabels,
  ButtonLabels,
  errorMessageLabels,
} from '../../../../strings';
import '../createPartnership.css';
import {
  selectCreatePartnershipResponse,
  CoordinatorPartnerInfoAction,
} from '../CreatePartnerShipSlice';

interface CoordinatorPartnerInfo {
  coordinatorname: string;
  email: string;
  role: string;
  companyName: string;
}

interface Props {
  steps: string[];
  history: any;
  isUpdate: boolean;
}
interface RoleData {
  description: string;
  name: string;
  role_id: number;
}
interface companyData {
  company_information_id: number;
  company_name: string;
}

const CoordinatorPartnerInfo = ({ steps, history, isUpdate }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [roleList, setRoleList] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);
  const [role, setRole] = React.useState('');
  const [companyName, setCompany] = React.useState('');
  const queryparams = new URLSearchParams(window.location.search);
  const partnershipId: string = queryparams.get('partner_id') || '0';
  const [loading, setLoading] = React.useState(false);

  const token = localStorage.getItem('token');
  React.useEffect(() => {
    setLoading(true);
    getRequest(`partnership/coordinator/get-roles-list/`, {
      Authorization: `Token ${token}`,
    }).then((resp: any) => {
      if (resp.result === true) {
        setRoleList(resp.data);
        setRole(resp.data.length > 0 ? resp.data[0].description : '');
      }
    });
    getRequest(
      `partnership/coordinator/get-companies-list/?partnership_id=${partnershipId}`,
      {
        Authorization: `Token ${token}`,
      }
    ).then((resp: any) => {
      if (resp.result === true) {
        setCompanyList(resp.data);
        setCompany(resp.data.length > 0 ? resp.data[0].company_name : '');
      }
    });
    setLoading(false);
  }, []);
  const initialValues: CoordinatorPartnerInfo = {
    coordinatorname: '',
    email: '',
    role: '',
    companyName: '',
  };
  const CoordinatorPartnerInfoSchema = Yup.object().shape({
    coordinatorname: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters is required')
      .required(errorMessageLabels.partnerCompanyName),
    email: Yup.string()
      .trim()
      .email(errorMessageLabels.validEmail)
      .required(errorMessageLabels.email),
  });
  return (
    <div className="create-partnership-main-container">
      <Box sx={{ width: '75%' }}>
        <Stepper activeStep={3} alternativeLabel>
          {steps.map((label: string) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <div className="create-partnership-info-title">
        {PartnerShipCoordinatorInfoLabels.partnershipCoordinatorInfoTitle}{' '}
      </div>{' '}
      <Formik
        initialValues={initialValues}
        validate={() => ({})}
        validationSchema={CoordinatorPartnerInfoSchema}
        onSubmit={(values) => {
          dispatch(
            CoordinatorPartnerInfoAction(
              { ...values, role, companyName },
              history,
              partnershipId,
              () => setLoading(false)
            )
          );
        }}
      >
        {(formik) => {
          const {
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            handleBlur,
          } = formik;
          return (
            <Form
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onSubmit={handleSubmit}
            >
              <div className="create-partnership-info-form">
                <div className="create-partnership-info-field">
                  <div className="create-partnership-label">
                    {PartnerShipCoordinatorInfoLabels.coordinatorname}
                  </div>
                  <div>
                    <Field
                      type="text"
                      name="coordinatorname"
                      placeholder={
                        PartnerShipCoordinatorInfoLabels.coordinatornameLabel
                      }
                      value={values.coordinatorname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={
                        errors.coordinatorname && touched.coordinatorname
                      }
                      errorMessage={errors.coordinatorname}
                      component={GenTextField}
                      classes={classes}
                    />
                    <RenderErrorMessage name="coordinatorname" />
                  </div>
                </div>
                <div className="create-partnership-info-field">
                  <div className="create-partnership-label">
                    {PartnerShipCoordinatorInfoLabels.email}
                  </div>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder={PartnerShipCoordinatorInfoLabels.email}
                      component={GenTextField}
                      classes={classes}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={errors.email && touched.email}
                      errorMessage={errors.email}
                    />
                    <RenderErrorMessage name="email" />
                  </div>
                </div>
                <div className="create-partnership-info-field">
                  <div className="create-partnership-label">
                    {PartnerShipCoordinatorInfoLabels.role}
                  </div>
                  <div>
                    <Select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      displayEmpty
                      style={{ minWidth: '270px' }}
                      className="createPartnerShipSelect"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {roleList.map((list: RoleData) => (
                        <MenuItem value={list.description} key={list.role_id}>
                          {list.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <RenderErrorMessage name="role" />
                  </div>
                </div>
                <div className="create-partnership-info-field">
                  <div className="create-partnership-label">
                    {PartnerShipCoordinatorInfoLabels.companyName}
                  </div>
                  <div>
                    <Select
                      value={companyName}
                      onChange={(e: any) => setCompany(e.target.value)}
                      displayEmpty
                      style={{ minWidth: '270px' }}
                      className="createPartnerShipSelect"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {companyList.map((list: companyData) => (
                        <MenuItem
                          value={list.company_name}
                          key={list.company_information_id}
                        >
                          {list.company_name}
                        </MenuItem>
                      ))}
                    </Select>
                    <RenderErrorMessage name="companyName" />
                  </div>
                </div>

                <div className="create-partnership-info-button-container">
                  <SecondaryButton
                    onClick={() =>
                      history.push(
                        `/createPartnership?form=CompanyPartnerInfo&type=update&partner_id=${partnershipId}`
                      )
                    }
                    style={{ marginRight: '30px', minWidth: '160px' }}
                  >
                    {ButtonLabels.previous}
                  </SecondaryButton>
                  <PrimaryButton type="submit" style={{ minWidth: '160px' }}>
                    {ButtonLabels.previewAndSave}
                  </PrimaryButton>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      {loading === true && <Loader />}
    </div>
  );
};
export default CoordinatorPartnerInfo;
