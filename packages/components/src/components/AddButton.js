import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "./Button";

const AddButton = ({ ...props }) => (
  <Button shape="round" {...props}>
    <Icon
      name="ios-add"
      size={30}
      style={{ height: 30, width: 30, textAlign: "center" }}
      color="white"
    />
  </Button>
);

export default AddButton;
