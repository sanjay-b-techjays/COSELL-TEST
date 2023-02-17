import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import { RenderTextField, RenderCheckbox } from 'src/app/components/Form/index';
import { LoginLabels } from 'src/strings';

interface Values {
  email: string;
  password: string;
  rememberMe: boolean;
}
interface Props {
  onSubmit: (values: Values) => void;
}

export const LoginForm: React.FC<Props> = ({ onSubmit }) => {
  const initialValues: Values = { email: '', password: '', rememberMe: false };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={() => ({})}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form>
          <Field
            type="email"
            name="email"
            label={LoginLabels.email}
            component={RenderTextField}
          />
          <Field
            type="password"
            name="password"
            label={LoginLabels.password}
            component={RenderTextField}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
            }}
          >
            <Field
              name="rememberMe"
              component={RenderCheckbox}
              label={LoginLabels.rememberMe}
              checked={initialValues.rememberMe}
            />
            <Button href="#text-buttons" size="small">
              {LoginLabels.forgotPassword}
            </Button>
          </div>

          <Button type="submit" fullWidth variant="contained" color="primary">
            {LoginLabels.signInlabel}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};
