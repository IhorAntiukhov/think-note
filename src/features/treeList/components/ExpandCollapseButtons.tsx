import { COLORS } from "@/src/constants/theme";
import React, { use } from "react";
import { View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import AvatarWithUserName from "../../avatar/components/AvatarWithUserName";
import useExpandOrCollapseFolders from "../hooks/useExpandOrCollapseFolders";
import treeListStyles from "../styles/treeList.styles";
import TreeListContext from "../context/treeListContext";
import LoadingAllState from "../types/loadingAllState";

export default function ExpandCollapseButtons() {
  const { loadingAllState } = use(TreeListContext)!;
  const expandOrCollapseFolders = useExpandOrCollapseFolders();

  return (
    <View style={treeListStyles.mainDirectory}>
      <AvatarWithUserName />

      <View style={treeListStyles.controlButtons}>
        {loadingAllState === LoadingAllState.loadingExpand ? (
          <ActivityIndicator size={32} />
        ) : (
          <IconButton
            icon="arrow-expand-all"
            size={20}
            iconColor={COLORS.primary}
            style={treeListStyles.controlButton}
            onPress={() => expandOrCollapseFolders(true)}
          />
        )}
        {loadingAllState === LoadingAllState.loadingCollapse ? (
          <ActivityIndicator size={32} />
        ) : (
          <IconButton
            icon="arrow-collapse-all"
            size={20}
            iconColor={COLORS.primary}
            style={treeListStyles.controlButton}
            onPress={() => expandOrCollapseFolders(false)}
          />
        )}
      </View>
    </View>
  );
}
