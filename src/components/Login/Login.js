import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

// can create the reducer function outside of the component function 
// because we don't need any data created inside of the component function
const emailReducer = (state, action) => { // takes in our last state snapshot and the action that was dispatched
  if(action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.includes('@')} // the state var that React provides here is guaranteed to always be the most up to date
  }
  return {value: '', isValid: false}; // returns a new state
}; 
                              

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});

  useEffect(()=> { // if no dependencies given, useEffect will run everytime the component function re-runs
    console.log('EFFECT RUNNING - NO DEPENDENCIES GIVEN');
  });

  useEffect(()=> { // if empty array given for the dependencies parameter, useEffect will run for only the *first* time the component is rendered
    console.log('EFFECT RUNNING - EMPTY ARRAY FOR DEPENDENCIES');
  }, []);

  useEffect(()=> { // if an array containing any dependencies is given as a parameter, useEffect will run the *first* time the component is rendered AND any time the state of the specified dependency changes
    console.log('EFFECT RUNNING - DEPENDENCY FOR PASSWORD GIVEN');
  }, [enteredPassword]);

  // we are replacing the useEffect solution with a useReducer solution because it's not good practice to make changes 
  // based on prev state without first copying prev state which is not possible in this example since our changes 
  // depend on multiple states at the same time. 
  // For example, the email state may be the most up to date but the password state may not and vice versa, and because
  // our formIsValid state depends on both our other state-managed variables enteredEmail and enteredPassword we can not use our regular copy over function
  // like we normally would.
  // useReducer provides an option for these more complex scenarios

  // useEffect(() => { // use whenever you have an action that should be executed in response to some other action
  //   const identifier = setTimeout(()=> { // *debouncing* so we don't check at literally every keystroke but only after some time (5 sec) has passed
  //     console.log('Checking form validity!');
  //     setFormIsValid(
  //       enteredEmail.includes('@') && enteredPassword.trim().length > 6 // helps to eliminate repetitive code that we use in both emailChangeHandler and passwordChangeHandler
  //     );
  //   }, 500);
    
  //   return () => { // just a cleanup function that runs before useEffect executes again
  //     console.log('CLEANUP');
  //     clearTimeout(identifier); // we are essentially clearing the previous timer before we set a new one
  //   };
  // }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    setFormIsValid(
      emailState.isValid && enteredPassword.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
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
