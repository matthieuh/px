import NotesScreen from "../screens/NotesScreen";
import ListsScreen from "../screens/ListsScreen";

const routes = {
  Notes: NotesScreen,
  Lists: ListsScreen
};

export const options = {
  initialRouteName: "Notes",
};
export default routes;
