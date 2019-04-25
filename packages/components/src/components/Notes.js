import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Image
} from "react-native";
import Storage from "react-native-storage";
import AsyncStorage from "@callstack/async-storage";
import { UserDataContext } from "../contexts/user-data";
import Navbar from "./Navbar";
import AddNote from "./AddNote";

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
  todoList: {
    alignSelf: "stretch",
    flex: 1
  },
  todo: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    padding: 14
  },
  itemInfos: {
    flex: 1
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  itemDescription: {
    fontSize: 14,
    color: "lightgrey"
  },
  todoImage: {
    height: 80,
    width: 80,
    borderRadius: 10,
    marginRight: 10
  }
});

let storageInstance;
const getStorage = () =>
  storageInstance
    ? storageInstance
    : new Storage({
        size: 1000,
        storageBackend: AsyncStorage,
        defaultExpires: null,
        enableCache: true,
        sync: {}
      });

export default ({ navigation }) => {
  const { state, dispatch } = React.useContext(UserDataContext);
  const [isInit, setIsInit] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const storage = getStorage();
      const state = await storage.load({ key: "state" });

      console.log("state", state);

      if (storage && state) {
        dispatch({
          type: "INIT_STATE",
          payload: state
        });
        setIsInit(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    const storage = getStorage();
    if (storage && isInit) {
      console.log("save state", state);
      storage.save({ key: "state", data: state });
    }
  }, [state]);

  const handleLongPress = React.useCallback(id => {
    Alert.alert(
      "Delete item",
      "Do you want to delete thi item?",
      [
        {
          text: "Yes",
          onPress: () => {
            dispatch({
              type: "DELETE_TODO",
              payload: { id }
            });
          },
          style: "negative"
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  });

  console.log("state", state);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.todoList}>
        <FlatList
          data={state.todos}
          renderItem={({ item: todo }) => (
            <TouchableOpacity
              style={styles.todo}
              key={todo.id}
              onLongPress={() => handleLongPress(todo.id)}
            >
              {!!(todo.item && todo.item.image) && (
                <Image
                  style={styles.todoImage}
                  resizeMethod="scale"
                  source={{
                    uri: todo.item.image
                  }}
                />
              )}
              {!todo.item && (
                <Image
                  style={styles.todoImage}
                  resizeMethod="scale"
                  source={{
                    uri:
                      "https://images.unsplash.com/photo-1483546416237-76fd26bbcdd1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
                  }}
                />
              )}
              <View style={styles.itemInfos}>
                <Text
                  style={[
                    styles.itemName,
                    todo.item ? {} : { fontWeight: "normal", fontSize: 14 }
                  ]}
                  numberOfLines={todo.item ? 1 : 4}
                >
                  {todo.name}
                </Text>
                {!!(todo.item && todo.item.description) && (
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {todo.item.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <AddNote navigation={navigation} />
    </SafeAreaView>
  );
};
