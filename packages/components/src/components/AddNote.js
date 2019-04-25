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
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import useDebouncedCallback from "use-debounce/lib/callback";

import useKeyboard from "../hooks/use-keyboard";
import usePrevious from "../hooks/use-previous";
import { UserDataContext } from "../contexts/user-data";
import Scraper from "../services/scraper";
import theme from "../theme";
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
      setInputState({ value: "", searched: false });
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const [debouncedSearch] = useDebouncedCallback(
    async () => {
      console.log('search', inputState)
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
  )

  const add = React.useCallback(
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

              if (needSearch) {
                debouncedSearch()
              }

              if (!value || value === "") {
                setInputState({ value: "", searched: false });
                setResults();
              }
            }}
            // onSubmitEditing={search}
            autoCorrect={false}
            minHeight={32}
            maxWidth={300}
            enableScrollToCaret
          />
          {isOpen && !!inputState.value && <AddButton style={{ marginLeft: 10 }} />}
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
                    <AddButton
                      onPress={() => {
                        setSelectedItem(item);
                        // debouncedSearch();
                      }}
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
