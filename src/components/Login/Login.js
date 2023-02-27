import React, { useState, useEffect } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(()=> { // if no dependencies given, useEffect will run everytime the component function re-runs
    console.log('EFFECT RUNNING - NO DEPENDENCIES GIVEN');
  });

  useEffect(()=> { // if empty array given for the dependencies parameter, useEffect will run for only the *first* time the component is rendered
    console.log('EFFECT RUNNING - EMPTY ARRAY FOR DEPENDENCIES');
  }, []);

  useEffect(()=> { // if an array containing any dependencies is given as a parameter, useEffect will run the *first* time the component is rendered AND any time the state of the specified dependency changes
    console.log('EFFECT RUNNING - DEPENDENCY FOR PASSWORD GIVEN');
  }, [enteredPassword]);

  useEffect(() => { // use whenever you have an action that should be executed in response to some other action
    const identifier = setTimeout(()=> { // *debouncing* so we don't check at literally every keystroke but only after some time (5 sec) has passed
      console.log('Checking form validity!');
      setFormIsValid(
        enteredEmail.includes('@') && enteredPassword.trim().length > 6 // helps to eliminate repetitive code that we use in both emailChangeHandler and passwordChangeHandler
      );
    }, 500);
    
    return () => { // just a cleanup function that runs before useEffect executes again
      console.log('CLEANUP');
      clearTimeout(identifier); // we are essentially clearing the previous timer before we set a new one
    };
  }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    setEmailIsValid(enteredEmail.includes('@'));
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
