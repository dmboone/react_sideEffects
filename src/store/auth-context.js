import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({ // this object will hold program-wide states that we want to keep track of
    isLoggedIn: false,
    onLogout: () => {}, // nice to put defaults here so that vscode will autocomplete for other files in the project
    onLogin: (email, password) => {}
});

export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => { // will run this code any time the code reloads or any time one of the dependencies listed in the array is altered
        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
    
        if(storedUserLoggedInInformation ===  '1'){
          setIsLoggedIn(true);
        };
    }, []); // here is the array of dependencies the code above will depend on

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    const loginHandler = () => {
        localStorage.setItem('isLoggedIn', '1');
        setIsLoggedIn(true);
    };

    return (
        <AuthContext.Provider 
            value={{
                isLoggedIn: isLoggedIn,
                onLogout: logoutHandler,
                onLogin: loginHandler,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;