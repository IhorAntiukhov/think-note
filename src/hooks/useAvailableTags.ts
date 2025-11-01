import useAvailableTagsStore from "@/src/store/availableTagsStore";
import useDialogStore from "@/src/store/dialogStore";
import { PostgrestError, Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { getAvailableTags } from "../features/sortingAndFiltering/api/tagsRepo";

export default function useAvailableTags(session: Session | null | undefined) {
  const { showInfoDialog } = useDialogStore();
  const { setAvailableTags } = useAvailableTagsStore();

  useEffect(() => {
    if (!session?.user) return;

    const fetchTags = async () => {
      try {
        const { data, error } = await getAvailableTags(session.user.id);

        if (error) throw error;

        if (data)
          setAvailableTags(
            data.map(({ id, label, color }) => ({
              value: id.toString(),
              label,
              color,
            })),
          );
      } catch (error) {
        showInfoDialog(
          "Failed to fetch tags",
          (error as PostgrestError).message,
        );
      }
    };

    fetchTags();
  }, [session?.user, setAvailableTags, showInfoDialog]);
}
