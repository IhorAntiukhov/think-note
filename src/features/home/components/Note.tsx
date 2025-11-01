import sharedStyles from "@/src/styles/shared.styles";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import NoteHeader from "../../notes/components/NoteHeader";
import useOpenNote from "../../notes/hooks/useOpenNote";
import { NoteData } from "../api/noteListsStore";
import NoteFooter from "./NoteFooter";

interface NoteProps {
  item: NoteData;
}

export default function Note({ item }: NoteProps) {
  const openNote = useOpenNote(null, item);

  return (
    <TouchableWithoutFeedback onPress={openNote}>
      <Card>
        <Card.Content>
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

          <Divider style={[sharedStyles.divider, { marginHorizontal: -16 }]} />

          <View style={{ height: 150, overflow: "hidden", width: 200 }}>
            <RenderHTML source={{ html: item.content }} contentWidth={200} />
          </View>

          <Divider style={[sharedStyles.divider, { marginBottom: 10 }]} />

          <NoteFooter item={item} />
        </Card.Content>
      </Card>
    </TouchableWithoutFeedback>
  );
}
