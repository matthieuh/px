import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image
} from "react-native";
import Storage from "react-native-storage";
import AsyncStorage from '@callstack/async-storage';
import { get } from "dot-prop";
import { UserDataContext } from "../contexts/user-data";
import Navbar from "../components/Navbar";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  header: {
    justifyContent: "center"
  },
  title: {
    fontSize: 40
  },
  inputContainer: {
    alignSelf: 'stretch',
    flexDirection: "row",
    backgroundColor: "lightgrey",
    alignSelf: 'stretch',
  },
  textInput: {
    flex: 1,
    fontSize: 30,
    color: "white",
    padding: 20
  },
  addButton: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonText: {
    fontSize: 30
  },
  todoList: {
    alignSelf: 'stretch',
    flex: 1
  },
  todo: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    padding: 20
  },
  todoInfos: {
    flex: 1
  },
  todoName: {
    fontSize: 22,
    fontWeight: "bold"
  },
  todoImage: {
    height: 80,
    width: 80,
    borderRadius: 10,
    marginRight: 10
  }
});

const getUrlFromName = async name => {
  const response = await fetch(
    `https://api.likewiseapp.net/api/elf/url/search?secret=acf6f606-3230-40d0-a95d-a11f9d6a0de8&name=${name}`
  );
  const result = await response.json();
  return get(result, "data.0.link");
};

const fetchDataFromUrl = async url => {
  const response = await fetch(
    `https://api.likewiseapp.net/api/elf/ogs?secret=acf6f606-3230-40d0-a95d-a11f9d6a0de8&url=${url}`
  );
  return response.json();
};

let storageInstance
const getStorage = () => storageInstance ? storageInstance : new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
  sync: {}
})

export default () => {
  const { state, dispatch } = React.useContext(UserDataContext);
  const [isInit, setIsInit] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(async () => {
    const storage = getStorage();
    const state = await storage.load({ key: "state" });

    console.log('state', state)

    if (storage && state) {
      dispatch({
        type: "INIT_STATE",
        payload: state
      });
      setIsInit(true)
    }
  }, []);

  React.useEffect(() => {
    const storage = getStorage();
    if (storage && isInit) {
      console.log('save state', state)
      storage.save({ key: "state", data: state });
    }
  }, [state]);

  const addTodo = React.useCallback(async e => {
    setInputValue("");

    const id = Date.now();
    dispatch({
      type: "ADD_TODO",
      payload: {
        name: inputValue,
        id,
        completed: false
      }
    });

    let url = inputValue;
    if (!inputValue.includes("://")) {
      url = await getUrlFromName(inputValue);
    }

    console.log("url", url);
    const data = await fetchDataFromUrl(url);
    console.log("data", data);

    await dispatch({
      type: "UPDATE_TODO",
      payload: {
        id,
        name: get(data, "ograph.ogTitle"),
        item: {
          image: get(data, "ograph.ogImage.originalImage")
        }
      }
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.todoList}>
        {state.todos.map(todo => (
          <TouchableOpacity style={styles.todo} key={todo.id}>
            {!!(todo.item && todo.item.image) && (
              <Image
                style={styles.todoImage}
                resizeMethod="scale"
                source={{
                  uri: todo.item.image
                }}
              />
            )}
            <Text style={styles.todoName}>{todo.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <KeyboardAvoidingView behavior="padding" enabled style={{ alignSelf: 'stretch' }}>
        <View style={styles.inputContainer} behavior="padding" enabled>
          <TextInput
            style={styles.textInput}
            placeholder="Take a note..."
            placeholderTextColor="white"
            returnKeyType="done"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={addTodo}
          />
        </View>
      </KeyboardAvoidingView>
      <Navbar />
    </SafeAreaView>
  );
};
