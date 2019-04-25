import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Keyboard,
  FlatList,
  TouchableOpacity
} from "react-native";
import { get } from "dot-prop";
import RoundCheckbox from "rn-round-checkbox";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import useDebouncedCallback from "use-debounce/lib/callback";
import Icon from "react-native-vector-icons/Ionicons";

import useKeyboard from "../hooks/use-keyboard";
import usePrevious from "../hooks/use-previous";
import { UserDataContext } from "../contexts/user-data";
import Scraper from "../services/scraper";
import theme from "../theme";
import Button from "./Button";
import AddButton from "./AddButton";

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch"
  },
  inputContainer: {
    backgroundColor: theme.palette.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  textInput: {
    flex: 1,
    fontSize: 30,
    color: theme.palette.blue,
    fontSize: 18
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
    padding: 14
  },
  webitePreview: {
    flex: 1
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
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
      setInputState({ value: "", searched: false });
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const [debouncedSearch] = useDebouncedCallback(
    async () => {
      console.log("search", inputState);
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
      }
    },
    1000,
    [inputState]
  );

  const search = React.useCallback(
    async (opts = {}) => {
      if (
        !inputState.value.includes("://") &&
        !inputState.value.includes("\n") &&
        !inputState.searched &&
        !opts.directAdd
      ) {
        Keyboard.dismiss();
        const res = await Scraper.getItemsFromName(inputState.value);
        setResults(res);
        if (res.length) {
          setSelectedItem(res[0]);
        }
        setInputState({ value: inputState.value, searched: true });
        return;
      }

      const id = Date.now();
      const inputValue = inputState.value;

      dispatch({
        type: "ADD_TODO",
        payload: {
          name: inputValue,
          id,
          completed: false
        }
      });

      setIsOpen(false);

      if (!selectedItem) {
        return;
      }

      const data = await Scraper.fetchDataFromUrl(selectedItem.link);

      await dispatch({
        type: "UPDATE_TODO",
        payload: {
          id,
          name: get(data, "title", inputValue),
          item: {
            image: get(data, "image"),
            description: get(data, "description")
          }
        }
      });
    },
    [inputState, selectedItem]
  );

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={{ alignSelf: "stretch" }}
          onPress={() => setIsOpen(false)}
        >
          <Text
            style={{
              textAlign: "center",
              color: theme.palette.blue,
              fontSize: 16,
              fontWeight: "bold",
              paddingVertical: 20
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.container,
          isOpen && {
            height: Dimensions.get("window").height - 60
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

              if (!needSearch) {
                setResults();
              }

              if (!value || value === "") {
                setIsOpen(false)
              }
            }}
            autoCorrect={false}
            minHeight={32}
            maxWidth={300}
            enableScrollToCaret
          />
          {isOpen && (
            <>
              {!inputState.searched && (
                <AddButton onPress={() => search({ directAdd: true })} />
              )}
              {!inputState.searched && (
                <Button
                  shape="round"
                  style={{ marginLeft: 10 }}
                  onPress={search}
                >
                  <Icon
                    name="ios-search"
                    size={22}
                    style={{ height: 22, width: 22, textAlign: "center" }}
                    color="white"
                  />
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
            ListHeaderComponent={() => {
              return results && results.length ? (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingVertical: 20,
                    backgroundColor: "#eaeaea"
                  }}
                >
                  Is your note linked to one of this items?
                </Text>
              ) : null;
            }}
            renderItem={({ item, index }) => {
              console.log("item", item);
              const isSelected =
                selectedItem && selectedItem.link === item.link;
              return (
                <TouchableOpacity
                  style={styles.item}
                  key={index}
                  onPress={() =>
                    isSelected ? setSelectedItem() : setSelectedItem(item)
                  }
                >
                  <View style={styles.webitePreview}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemLink} numberOfLines={2}>
                      {item.link}
                    </Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <RoundCheckbox
                      size={24}
                      checked={isSelected}
                      onValueChange={isChecked =>
                        isChecked ? setSelectedItem(item) : setSelectedItem()
                      }
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
