import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { withNavigation } from "react-navigation";

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignSelf: "stretch",
    height: 80,
    borderTopColor: "lightgrey",
    borderTopWidth: 1
  },
  navbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  navbarItemText: {
    fontSize: 22
  }
});

const Navbar = ({ navigation }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navbarItem}
        onPress={() => navigation.navigate("Notes")}
      >
        <Text style={styles.navbarItemText}>My Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarItem} onPress={() => navigation.navigate("Lists")}>
        <Text style={styles.navbarItemText}>My Lists</Text>
      </TouchableOpacity>
    </View>
  );
};

export default withNavigation(Navbar);
