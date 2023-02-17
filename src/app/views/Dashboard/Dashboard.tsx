/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable linebreak-style */
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../SignIn/SignInSlice';

const Dashboard = () => {
  const userData = useSelector(selectUserData);
  return (
    <div>
      Welcome {userData.email}
      <br />
      Dashboard design goes here
    </div>
  );
};

export default Dashboard;
