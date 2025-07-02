// navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import BottomTabs from "./BottomTabs";
import EventDetails from "../screens/EventDetails";
import Favorites from "../screens/Favorites";
import Profile from "../screens/Profile";
import CreateEvent from "../screens/CreateEvent";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import ResetPassword from "../screens/ResetPassword";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? "MainTabs" : "Login"}
    >
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="CreateEvent" component={CreateEvent} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}
