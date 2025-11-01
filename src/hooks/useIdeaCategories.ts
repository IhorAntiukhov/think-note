import { PostgrestError, Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { getIdeaCategories } from "../features/ideas/api/ideasRepo";
import useDialogStore from "../store/dialogStore";
import useIdeaCategoriesStore from "../store/ideaCategoriesStore";

export default function useIdeaCategories(session: Session | null | undefined) {
  const { showInfoDialog } = useDialogStore();
  const { setCategories } = useIdeaCategoriesStore();

  useEffect(() => {
    if (!session?.user) return;

    const fetchCategories = async () => {
      try {
        const { data, error } = await getIdeaCategories(session.user.id);

        if (error) throw error;

        if (data) setCategories(data);
      } catch (error) {
        showInfoDialog(
          "Failed to fetch idea categories",
          (error as PostgrestError)?.message,
        );
      }
    };

    fetchCategories();
  }, [session?.user, setCategories, showInfoDialog]);
}
