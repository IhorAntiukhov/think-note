import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PostgrestError } from "@supabase/supabase-js";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { getUserStats } from "../api/userStatsRepo";
import profileStyles from "../styles/profile.styles";

export default function UserStats() {
  const [numNotes, setNumNotes] = useState(0);
  const [numFolders, setNumFolders] = useState(0);
  const [numIdeas] = useState(0);

  const { session } = useAuthStore();
  const { showInfoDialog } = useDialogStore();
  const user = session!.user;

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        try {
          const { data, error } = await getUserStats(user.id);

          if (error) throw error;
          if (!data) return;

          setNumNotes(data.find((value) => value.type === "note")?.count || 0);
          setNumFolders(
            data.find((value) => value.type === "folder")?.count || 0,
          );
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
          <Text>{numNotes} notes created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="folder" size={20} color={COLORS.secondary} />
          <Text>{numFolders} folders created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="lightbulb" size={20} color={COLORS.secondary} />
          <Text>{numIdeas} ideas generated</Text>
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
