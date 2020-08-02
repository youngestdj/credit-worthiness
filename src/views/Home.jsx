/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import useScript from '../hooks/useScript';

const Home = () => {
  useScript('https://connect.withmono.com/connect.js');

  const [input, setInput] = useState({
    firstname: null,
    lastname: null,
    email: null,
    amount: null,
  });

  const [user, setUser] = useState({
    id: null,
    credits: null,
    debits: null,
    balance: null,
  });
  const { credits, debits, balance } = user;

  const [errors, setErrors] = useState(false);
  const { firstname, lastname, email, amount } = input;

  const updateInput = (event) => {
    event.preventDefault();
    setErrors(false);
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };

  const validateEnroll = () => {
    const errorMessages = [];

    if (!firstname) errorMessages.push('Please enter a firstname');
    if (!lastname) errorMessages.push('Please enter a lastname');
    const emailRules = /\S+@\S+\.\S+/;
    if (!emailRules.test(email)) {
      errorMessages.push('Please enter a valid email.');
    }
    if (!amount || isNaN(amount)) {
      errorMessages.push('Please enter a valid amount, numbers only.');
    }
    if (errorMessages.length > 0) {
      setErrors(errorMessages);
      return false;
    }
    return true;
  };

  const callApi = async (method, url, body = null) => {
    const URL = `https://api.withmono.com/${url}`;
    let data = JSON.stringify(body);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('mono-sec-key', 'test_sk_0KRqMG8NfB42shXwz1a6');

    try {
      const fetchResult = fetch(
        new Request(URL, {
          method,
          cache: 'reload',
          ...(body && { body: data }),
          headers: headers,
        })
      );
      const response = await fetchResult;
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      setErrors([err.message]);
    }
  };

  const LoanLimit = () => {
    const loanLimit = credits - debits + balance;

    return (
      <div>
        {loanLimit > amount
          ? `Congratulations ${firstname}, you are eligible to borrow ${amount} as your loan limit is ${loanLimit}`
          : `Sorry, you cannot borrow up to ${amount}, your loan limit is ${loanLimit}`}
      </div>
    );
  };

  const enrollUser = (event) => {
    event.preventDefault();
    if (validateEnroll()) {
      const options = {
        onSuccess: async (response) => {
          const { id } = await callApi('POST', 'account/auth', response);
          const credit = await callApi('GET', `accounts/${id}/credits`);
          const debit = await callApi('GET', `accounts/${id}/debits`);
          const { balance } = await callApi('GET', `accounts/${id}`);
          setUser({
            ...user,
            id,
            credits: credit.total,
            debits: debit.total,
            balance,
          });
          connect.close();
        },
        onClose: () => {
          console.log('Widget closed');
        },
      };

      const connect = new Connect('test_pk_jZKnTgzaT03sMAwYPUhD', options);
      connect.setup();
      connect.open();
    }
  };

  return (
    <>
      <div className="container">
        {errors && (
          <div className="errors">
            {errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
        {balance ? (
          <LoanLimit />
        ) : (
          <form>
            <h1>Enroll</h1>
            <input
              type="text"
              name="firstname"
              placeholder="Firstname"
              className="firstname"
              onChange={updateInput}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Lastname"
              className="lastname"
              onChange={updateInput}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={updateInput}
            />
            <input
              type="text"
              name="amount"
              placeholder="Amount needed"
              onChange={updateInput}
            />
            <input type="submit" value="Enroll" onClick={enrollUser} />
          </form>
        )}
      </div>
    </>
  );
};

export default Home;
