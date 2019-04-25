import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Keyboard,
  FlatList,
  TouchableOpacity
} from "react-native";
import { get } from "dot-prop";
import RoundCheckbox from "rn-round-checkbox";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";

import useKeyboard from "../hooks/use-keyboard";
import usePrevious from "../hooks/use-previous";
import { UserDataContext } from "../contexts/user-data";
import Scraper from "../services/scraper";
import theme from "../theme";
import Button from "./Button";

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch"
  },
  inputContainer: {
    backgroundColor: theme.palette.lightBlue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  textInput: {
    flex: 1,
    fontSize: 30,
    color: theme.palette.blue,
    fontSize: 18,
    alignItems: "center"
  },
  results: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    height: 100,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    padding: 20
  },
  webitePreview: {
    flex: 1
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold"
  },
  itemLink: {
    fontSize: 14,
    color: "lightgrey"
  },
  checkboxContainer: {
    justifyContent: "center"
  }
});

const AddNote = ({ navigation }) => {
  console.log("navigation", navigation);
  const { dispatch } = React.useContext(UserDataContext);
  const [inputState, setInputState] = React.useState({
    value: "",
    searched: false
  });
  const [results, setResults] = React.useState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState();

  const keyboard = useKeyboard();
  const prevKeyboard = usePrevious(keyboard);

  React.useEffect(() => {
    if (keyboard.isKeyboardShow && !prevKeyboard.isKeyboardShow) {
      setIsOpen(true);
    }
  }, [keyboard]);

  React.useEffect(() => {
    navigation.setParams({ tabBarVisible: !isOpen });
    if (!isOpen) {
      setSelectedItem();
      setResults();
    }
  }, [isOpen]);

  const search = React.useCallback(
    async e => {
      if (
        !inputState.value.includes("://") &&
        !inputState.value.includes("\n") &&
        !inputState.searched
      ) {
        const res = await Scraper.getItemsFromName(inputState.value);
        console.log("res", res);
        setResults(res);
        if (res.length) {
          setSelectedItem(res[0]);
        }
        setInputState({ value: inputState.value, searched: true });
        return;
      }

      const id = Date.now();
      const inputValue = inputState.value

      dispatch({
        type: "ADD_TODO",
        payload: {
          name: inputValue,
          id,
          completed: false
        }
      });

      setInputState({ value: "", searched: false });
      setIsOpen(false);
      Keyboard.dismiss();

      if (!selectedItem) {
        return;
      }

      const data = await Scraper.fetchDataFromUrl(selectedItem.link);
      console.log("data", data);

      await dispatch({
        type: "UPDATE_TODO",
        payload: {
          id,
          name: get(data, "title", inputValue),
          item: {
            image: get(data, "image")
          }
        }
      });
    },
    [inputState, selectedItem]
  );

  return (
    <>
      {isOpen && (
        <View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setIsOpen(false);
            }}
          >
            <Text>{`< Back`}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={[
          styles.container,
          isOpen && {
            height: Dimensions.get("window").height - 40
          }
        ]}
      >
        <View style={styles.inputContainer}>
          <AutoGrowingTextInput
            style={styles.textInput}
            placeholder="Take a note..."
            placeholderTextColor={theme.palette.blue}
            returnKeyType="done"
            value={inputState.value}
            onChangeText={value => {
              const needSearch =
                !value.includes("://") && !value.includes("\n");
              setInputState({ value, searched: !needSearch });
            }}
            // onSubmitEditing={search}
            autoCorrect={false}
            minHeight={32}
            maxWidth={300}
            enableScrollToCaret
          />
          {isOpen && (
            <>
              {!inputState.searched && (
                <Button style={{ marginLeft: 10 }} onPress={search}>
                  Search
                </Button>
              )}
              {inputState.searched && (
                <Button style={{ marginLeft: 10 }} onPress={search}>
                  Add
                </Button>
              )}
            </>
          )}
        </View>
        {isOpen && (
          <FlatList
            style={[styles.results]}
            data={results}
            renderItem={({ item, index }) => {
              console.log("item", item);
              return (
                <TouchableOpacity
                  style={styles.item}
                  key={index}
                  onPress={() => setSelectedItem(item)}
                >
                  <View style={styles.webitePreview}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemLink}>{item.link}</Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <RoundCheckbox
                      size={24}
                      checked={selectedItem && selectedItem.link === item.link}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </>
  );
};

export default AddNote;
