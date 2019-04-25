import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.blue,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20
  },
  text: {
    color: theme.palette.lightBlue,
    fontSize: 16
  }
});

const Button = ({ style, textStyle, children, ...props }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      {typeof children === 'string' && (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      )}
      {typeof children === 'function' && children()}
    </TouchableOpacity>
  );
};

export default Button;
