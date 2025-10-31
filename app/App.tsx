import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { AppProvider } from "./context/AppContext";
import TabNavigator from "./navigation/TabNavigator";

export default function App() {
  return (
    <PaperProvider>
      <AppProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}
