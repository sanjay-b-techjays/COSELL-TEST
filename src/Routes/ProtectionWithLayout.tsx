/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';

const ProtectionWithLayout = (props: any) => {
    const { layout: Layout, component: Component, session, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(matchProps) => {
                return (!!localStorage.getItem("token")) ?
                    <Layout>
                        <Component {...matchProps} />
                    </Layout>
                    : <Redirect to="/" />
            }
            }
        />
    );
};

export default ProtectionWithLayout;