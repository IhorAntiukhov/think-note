import { sharedStyles } from "@/src/styles/shared.styles";
import React from "react";
import { View } from "react-native";
import { Card, Divider, TouchableRipple } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import NoteHeader from "../../treeList/components/NoteHeader";
import useOpenNote from "../../treeList/hooks/useOpenNote";
import { NoteData } from "../api/noteListsStore";
import homeStyles from "../styles/home.styles";
import NoteFooter from "./NoteFooter";

interface NoteProps {
  item: NoteData;
}

export default function Note({ item }: NoteProps) {
  const openNote = useOpenNote(null, item);

  return (
    <TouchableRipple onPress={openNote}>
      <Card style={{ flex: 1 }} contentStyle={{ flex: 1 }}>
        <Card.Content style={{ flex: 1 }}>
          <View style={{ display: "flex", flex: 1, maxWidth: 250 }}>
            <NoteHeader
              item={{
                id: item.id,
                name: item.name,
                folder_id: item.folder_id,
                type: item.type as "note",
                depth: item.depth,
                marked: item.marked,
                tags_notes: item.tags_notes,
              }}
            />

            <Divider
              style={[sharedStyles.divider, { marginHorizontal: -16 }]}
            />

            <View style={homeStyles.noteHTML}>
              <RenderHTML source={{ html: item.content }} contentWidth={250} />
            </View>

            <Divider
              style={[
                sharedStyles.divider,
                { marginHorizontal: -16, marginBottom: 10 },
              ]}
            />

            <NoteFooter item={item} />
          </View>
        </Card.Content>
      </Card>
    </TouchableRipple>
  );
}
