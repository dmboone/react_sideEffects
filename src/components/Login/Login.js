import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

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

const passwordReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.trim().length > 6};
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6} // the state var that React provides here is guaranteed to always be the most up to date
  }
  return {value: '', isValid: false}; // returns a new state
};                            

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: null});

  const ctx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(()=> { // if no dependencies given, useEffect will run everytime the component function re-runs
    console.log('EFFECT RUNNING - NO DEPENDENCIES GIVEN');
  });

  useEffect(()=> { // if empty array given for the dependencies parameter, useEffect will run for only the *first* time the component is rendered
    console.log('EFFECT RUNNING - EMPTY ARRAY FOR DEPENDENCIES');
  }, []);

  useEffect(()=> { // if an array containing any dependencies is given as a parameter, useEffect will run the *first* time the component is rendered AND any time the state of the specified dependency changes
    console.log('EFFECT RUNNING - DEPENDENCY FOR PASSWORD GIVEN');
  }, [passwordState.value]);

  const {isValid: emailIsValid } = emailState; // pulling out the isValid property from the emailState using destructuring; we store it in an emailIsValid var
  const {isValid: passwordIsValid } = passwordState; // pulling out the isValid property from the passwordState using destructuring; we store it in a passwordIsValid var

  useEffect(() => { // use whenever you have an action that should be executed in response to some other action
    const identifier = setTimeout(()=> { // *debouncing* so we don't check at literally every keystroke but only after some time (5 sec) has passed
      console.log('Checking form validity!');
      setFormIsValid(
        emailIsValid && passwordIsValid // better to check form validity here because useEffect will rerun any time our listed dependencies are updated
      ); // could also have just put emailState.isValid and passwordState.isValid and the same thing would be achieved
    }, 500);
    
    return () => { // just a cleanup function that runs before useEffect executes again
      console.log('CLEANUP');
      clearTimeout(identifier); // we are essentially clearing the previous timer before we set a new one
    };
  }, [emailIsValid, passwordIsValid]); // using just the isValid property from our email and password better optimizes useEffect 
  // so that we are only rerunning this function if the VALIDITY of either of those variables changes, not if the states are altered at all
  // could also have just put emailState.isValid and passwordState.isValid and the same thing would be achieved

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // this part is still not optimal because we are assessing form validity based on multiple different states that may not be the most up-to date
    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value});

    // this part is still not optimal because we are assessing form validity based on multiple different states that may not be the most up-to date
    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
      ctx.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailIsValid){
      emailInputRef.current.focus();
    }
    else{
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        >
        </Input>
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        >
        </Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
