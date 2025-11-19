import { COLORS } from "@/src/constants/theme";
import { sharedStyles } from "@/src/styles/shared.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import NoteSummary from "../../ideas/components/NoteSummary";
import TagsDropdown from "../../sortingAndFiltering/components/TagsDropdown";
import singleNoteStyles from "../styles/singleNote.styles";
import NoteStats from "./NoteStats";

interface NoteInfoProps {
  selectedTags: string[];
  onChangeSelectedTags: (value: string[]) => void;
}

export default function NoteInfo({
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

          {infoSection === "general" && <NoteStats />}
          {infoSection === "tags" && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TagsDropdown
                selectedTags={selectedTags}
                onChangeSelectedTags={onChangeSelectedTags}
              />
            </View>
          )}
          {infoSection === "ai" && <NoteSummary />}
        </View>
      )}
    </>
  );
}
