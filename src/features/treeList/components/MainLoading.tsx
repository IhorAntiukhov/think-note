import { use } from "react";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import TreeListContext from "../context/treeListContext";
import treeListStyles from "../styles/treeList.styles";
import LoadingAllState from "../types/loadingAllState";

export default function MainLoading() {
  const { data, loadingAllState, newFolderDepth } = use(TreeListContext)!;

  return !data.length && !newFolderDepth ? (
    <View style={treeListStyles.noDataWrapper}>
      {loadingAllState === LoadingAllState.loadingAll ? (
        <ActivityIndicator size={32} />
      ) : (
        <Text style={treeListStyles.noDataText}>
          You do not have any folders or notes
        </Text>
      )}
    </View>
  ) : null;
}
