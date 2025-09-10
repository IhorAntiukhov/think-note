import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import singleNoteStyles from "../styles/singleNote.styles";

interface NoteStatsProps {
  numWords: number;
}

export default function NoteStats({ numWords }: NoteStatsProps) {
  const [isStatsOpened, setIsStatsOpened] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={singleNoteStyles.noteStatsHeader}
        onPress={() => setIsStatsOpened((state) => !state)}
      >
        <Text style={sharedStyles.largeText}>Note stats</Text>
        <MaterialIcons
          name={isStatsOpened ? "arrow-drop-up" : "arrow-drop-down"}
          size={20}
          color={COLORS.secondary}
        />
      </TouchableOpacity>
      {isStatsOpened && (
        <View>
          <View style={singleNoteStyles.noteStat}>
            <MaterialIcons name="abc" size={22} color={COLORS.secondary} />
            <Text style={sharedStyles.mediumText}>{numWords} words</Text>
          </View>
        </View>
      )}
    </>
  );
}
