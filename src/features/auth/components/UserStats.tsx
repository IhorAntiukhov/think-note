import { COLORS } from "@/src/constants/theme";
import useAuthStore from "@/src/store/authStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import profileStyles from "../styles/profile.styles";

export default function UserStats() {
  const { session } = useAuthStore();
  const user = session?.user;

  return (
    <>
      <Text style={profileStyles.formTitle}>Stats</Text>

      <View style={profileStyles.stats}>
        <View style={profileStyles.stat}>
          <MaterialIcons name="note" size={20} color={COLORS.secondary} />
          <Text>{} notes created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="lightbulb" size={20} color={COLORS.secondary} />
          <Text>{} ideas generated</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons name="folder" size={20} color={COLORS.secondary} />
          <Text>{} folders created</Text>
        </View>
        <View style={profileStyles.stat}>
          <MaterialIcons
            name="calendar-month"
            size={20}
            color={COLORS.secondary}
          />
          <Text>Member since {new Date(user!.created_at).toDateString()}</Text>
        </View>
      </View>
    </>
  );
}
