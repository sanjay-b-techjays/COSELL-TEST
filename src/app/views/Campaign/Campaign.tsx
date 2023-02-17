import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../Login/LoginSlice';

const Campaign = () => {
  // const user = useSelector(selectUser);
  // console.log({user});
  return (
    <div>
      {/* Welcome {user.email} */}
      <br />
      Campaign design goes here
    </div>
  );
};

export default Campaign;
