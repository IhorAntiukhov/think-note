import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import concatNumberString from "@/src/utils/concatNumberString";
import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PostgrestError } from "@supabase/supabase-js";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { getIdeaCount, getNoteFolderCount } from "../api/userStatsRepo";
import profileStyles from "../styles/profile.styles";

export default function UserStats() {
  const [numNotes, setNumNotes] = useState(0);
  const [numFolders, setNumFolders] = useState(0);
  const [numIdeas, setNumIdeas] = useState(0);

  const { session } = useAuthStore();
  const { showInfoDialog } = useDialogStore();
  const user = session!.user;

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const { data: noteFolderData, error: noteFolderError } =
            await getNoteFolderCount(user.id);

          if (noteFolderError) throw noteFolderError;
          if (!noteFolderData) return;

          const { data: ideaData, error: ideaError } = await getIdeaCount(
            user.id,
          );

          if (ideaError) throw ideaError;
          if (!ideaData) return;

          setNumNotes(
            noteFolderData.find((value) => value.type === "note")?.count || 0,
          );
          setNumFolders(
            noteFolderData.find((value) => value.type === "folder")?.count || 0,
          );
          setNumIdeas(ideaData[0].count);
        } catch (error) {
          showInfoDialog(
            "User stats fetch failed",
            (error as PostgrestError).message,
          );
        }
      };

      fetchStats();
    }, [user.id, showInfoDialog]),
  );

  return (
    <>
      <Text style={profileStyles.formTitle}>Stats</Text>

      <View style={profileStyles.stats}>
        <View style={profileStyles.stat}>
          <MaterialIcons name="note" size={20} color={COLORS.secondary} />
          <Text>{concatNumberString(numNotes, "note")} created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="folder" size={20} color={COLORS.secondary} />
          <Text>{concatNumberString(numFolders, "folder")} created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="lightbulb" size={20} color={COLORS.secondary} />
          <Text>{concatNumberString(numIdeas, "idea")} generated</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons
            name="calendar-month"
            size={20}
            color={COLORS.secondary}
          />
          <Text>Member since {formatDate(user.created_at)}</Text>
        </View>
      </View>
    </>
  );
}
