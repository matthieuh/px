import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.blue,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17
  },
  text: {
    color: theme.palette.lightBlue,
    fontSize: 16
  },
  round: {
    height: 34,
    width: 34,
    paddingHorizontal: null
  }
});

const Button = ({ style, shape, textStyle, children, ...props }) => {
  return (
    <TouchableOpacity style={[styles.container, styles[shape], style]} {...props}>
      {typeof children === "string" && (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      )}
      {typeof children !== "string" && children}
    </TouchableOpacity>
  );
};

export default Button;
