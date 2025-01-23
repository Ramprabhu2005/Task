import React, { useState } from 'react';
import Contact from './Contact';

const Home = () => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => setCounter(counter - 1);

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the Home Page!</p>
      <div>
        <h3>Counter: {counter}</h3>
        <button onClick={incrementCounter}>Increment</button>
        <button onClick={decrementCounter} disabled={counter === 0}>
          Decrement
        </button>
      </div>
      <Contact message="We are here to assist you with any queries!" />
    </div>
  );
};

export default Home;
