import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native"

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignSelf: 'stretch',
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

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navbarItem}>
        <Text style={styles.navbarItemText}>My Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarItem}>
        <Text style={styles.navbarItemText}>My Lists</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
