import React from 'react';

const AuthContext = React.createContext({ // this object will hold program-wide states that we want to keep track of
    isLoggedIn: false
});

export default AuthContext;