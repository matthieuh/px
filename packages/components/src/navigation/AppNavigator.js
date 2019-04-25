console.log("react-navigation");
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Routes, { options } from "./routes";

const AppNavigator = createBottomTabNavigator(Routes, options);

export default createAppContainer(AppNavigator);
