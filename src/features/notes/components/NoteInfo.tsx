import { COLORS } from "@/src/constants/theme";
import sharedStyles from "@/src/styles/shared.styles";
import formatDate from "@/src/utils/formatDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import singleNoteStyles from "../styles/singleNote.styles";
import TagsDropdown from "./TagsDropdown";

interface NoteInfoProps {
  createdAt?: string;
  updatedAt?: string;
  numVisits?: number;
  numWords: number;
  selectedTags: string[];
  onChangeSelectedTags: (value: string[]) => void;
}

export default function NoteInfo({
  createdAt,
  updatedAt,
  numVisits,
  numWords,
  selectedTags,
  onChangeSelectedTags,
}: NoteInfoProps) {
  const [isInfoOpened, setIsInfoOpened] = useState(true);
  const [infoSection, setInfoSection] = useState<"general" | "tags" | "ai">(
    "general",
  );

  return (
    <>
      <TouchableOpacity
        style={singleNoteStyles.noteStatsHeader}
        onPress={() => setIsInfoOpened((state) => !state)}
      >
        <Text style={sharedStyles.largeText}>Note info</Text>
        <MaterialIcons
          name={isInfoOpened ? "arrow-drop-up" : "arrow-drop-down"}
          size={20}
          color={COLORS.secondary}
        />
      </TouchableOpacity>
      {isInfoOpened && (
        <View style={singleNoteStyles.noteStatsContainer}>
          <SegmentedButtons
            value={infoSection}
            onValueChange={setInfoSection as (text: string) => void}
            style={{ marginBottom: 10 }}
            buttons={[
              {
                value: "general",
                label: "General",
                icon: "format-list-bulleted-type",
              },
              {
                value: "tags",
                label: "Tags",
                icon: "tag",
              },
              {
                value: "ai",
                label: "AI",
                icon: "brain",
              },
            ]}
          />
          {infoSection === "general" && (
            <>
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
                  <MaterialIcons
                    name="update"
                    size={22}
                    color={COLORS.secondary}
                  />
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
            </>
          )}
          {infoSection === "tags" && (
            <TagsDropdown
              selectedTags={selectedTags}
              onChangeSelectedTags={onChangeSelectedTags}
            />
          )}
        </View>
      )}
    </>
  );
}
