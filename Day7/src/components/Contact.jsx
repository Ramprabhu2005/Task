import React from 'react';

const Contact = ({ message }) => {
  return (
    <div>
      <h2>Contact Page</h2>
      <p>Contact us at contact@example.com.</p>
      <p>{message}</p>
    </div>
  );
};

export default Contact;
