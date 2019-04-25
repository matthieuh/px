import React from "react";
import { NavigationActions } from "react-navigation";
import Notes from "../components/Notes";

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const tabBarVisible = navigation.getParam('tabBarVisible') === false ? false : true;
    console.log('tabBarVisible', tabBarVisible)
    return {
      header: null,
      tabBarVisible,
      animationEnabled: true
    };
  };

  render() {
    console.log("this.props.navigation", this.props.navigation);
    return <Notes navigation={this.props.navigation} />;
  }
}

export default HomeScreen;
