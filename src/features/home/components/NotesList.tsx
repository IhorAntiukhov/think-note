import useAuthStore from "@/src/store/authStore";
import { PostgrestError } from "@supabase/supabase-js";
import { useFocusEffect } from "expo-router";
import { createContext, useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ActivityIndicator, Card } from "react-native-paper";
import Sorting from "../../sortingAndFiltering/components/Sorting";
import SORTING_OPTIONS from "../../sortingAndFiltering/constants/sortingOptions";
import { NoteData } from "../api/noteListsStore";
import LIST_NAMES from "../constants/listNames";
import homeStyles from "../styles/home.styles";
import ListName from "../types/listName";
import getFetchFunction from "../utils/getFetchFunction";
import NewNote from "./NewNote";
import Note from "./Note";

interface NotesListProps {
  listName: ListName;
}

export const NotesContext = createContext<string>(SORTING_OPTIONS[0].value);

export default function NotesList({ listName }: NotesListProps) {
  const { user } = useAuthStore().session!;
  const isUncategorized = listName === LIST_NAMES.UNCATEGORIZED;

  const [data, setData] = useState<(NoteData | "new")[] | null>(
    isUncategorized ? ["new"] : null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState<string>(SORTING_OPTIONS[0].value);
  const [isAscending, setIsAscending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const { data, error } = await getFetchFunction(
            listName,
            user.id,
            sortBy,
            isAscending,
          );

          if (error) throw error;

          if (data && isUncategorized) setData(["new", ...data]);
          else if (data) setData(data);
        } catch (error) {
          setError((error as PostgrestError).message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [isUncategorized, listName, user.id, sortBy, isAscending]),
  );

  return (
    <Card>
      <Card.Content>
        <View style={homeStyles.listHeader}>
          <View style={homeStyles.listNameHeader}>
            <Text style={homeStyles.listName}>{listName}</Text>
            <Text style={homeStyles.noteCount}>{data?.length || 0} notes</Text>
          </View>

          {listName !== LIST_NAMES.MOST_VISITED && (
            <Sorting
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              isAscending={isAscending}
              onChangeIsAscending={setIsAscending}
              sortingOptions={
                listName === LIST_NAMES.RECENT
                  ? [
                      { label: "Created at", value: "created_at" },
                      { label: "Updated at", value: "updated_at" },
                    ]
                  : undefined
              }
            />
          )}
        </View>

        {data?.length ? (
          <NotesContext value={sortBy}>
            <FlatList
              data={data!}
              renderItem={({ item }) =>
                item === "new" ? <NewNote /> : <Note item={item} />
              }
              horizontal
              style={{
                padding: 10,
                margin: -10,
              }}
              contentContainerStyle={{
                gap: 10,
              }}
            />
          </NotesContext>
        ) : isLoading ? (
          <ActivityIndicator size={32} />
        ) : error ? (
          <Text style={homeStyles.errorText}>{error}</Text>
        ) : (
          <Text style={homeStyles.noDataText}>No notes found in this list</Text>
        )}
      </Card.Content>
    </Card>
  );
}
