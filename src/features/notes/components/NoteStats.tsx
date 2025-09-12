import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import singleNoteStyles from "../styles/singleNote.styles";

interface NoteStatsProps {
  createdAt?: string;
  updatedAt?: string;
  numVisits?: number;
  numWords: number;
}

export default function NoteStats({
  createdAt,
  updatedAt,
  numVisits,
  numWords,
}: NoteStatsProps) {
  const [isStatsOpened, setIsStatsOpened] = useState(true);

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
        <View style={singleNoteStyles.noteStatsContainer}>
          {createdAt && (
            <View style={singleNoteStyles.noteStat}>
              <MaterialIcons
                name="calendar-month"
                size={22}
                color={COLORS.secondary}
              />
              <Text style={sharedStyles.mediumText}>
                Created at {formatDate(createdAt)}
              </Text>
            </View>
          )}
          {updatedAt && (
            <View style={singleNoteStyles.noteStat}>
              <MaterialIcons name="update" size={22} color={COLORS.secondary} />
              <Text style={sharedStyles.mediumText}>
                Updated at {formatDate(updatedAt)}
              </Text>
            </View>
          )}
          {numVisits !== undefined && (
            <View style={singleNoteStyles.noteStat}>
              <MaterialIcons
                name="file-open"
                size={22}
                color={COLORS.secondary}
              />
              <Text style={sharedStyles.mediumText}>
                Visited {numVisits + 1} times
              </Text>
            </View>
          )}
          <View style={singleNoteStyles.noteStat}>
            <MaterialIcons name="abc" size={22} color={COLORS.secondary} />
            <Text style={sharedStyles.mediumText}>{numWords} words</Text>
          </View>
        </View>
      )}
    </>
  );
}
