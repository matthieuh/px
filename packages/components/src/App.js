import React from "react";
import { UserDataContextProvider } from "./contexts/user-data";
import AppNavigator from './navigation/AppNavigator';

export default () => {
  return (
    <UserDataContextProvider>
      <AppNavigator />
    </UserDataContextProvider>
  );
};
