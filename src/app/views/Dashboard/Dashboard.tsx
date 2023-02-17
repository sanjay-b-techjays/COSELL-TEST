import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../Login/LoginSlice';

const Dashboard = () => {
  const user = useSelector(selectUser);
  console.log({ user });
  return (
    <div>
      Welcome {user.email}
      <br />
      Dashboard design goes here
    </div>
  );
};

export default Dashboard;
