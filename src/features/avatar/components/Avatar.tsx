import supabase from "@/src/api/supabase";
import { updateUser } from "@/src/features/auth/api/auth";
import useAuthStore from "@/src/store/authStore";
import useDialogStore from "@/src/store/dialogStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PostgrestError } from "@supabase/supabase-js";
import * as Font from "expo-font";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { getFromStorage } from "../api/storageRepo";
import avatarStyles from "../styles/avatar.styles";

interface AvatarProps {
  minimized?: boolean;
}

export default function Avatar({ minimized = false }: AvatarProps) {
  const { session, avatarUrl, setAvatarUrl } = useAuthStore();
  const { showInfoDialog } = useDialogStore();

  const user = session?.user;

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);

  const size = minimized ? 48 : 96;

  const downloadFromStorage = useCallback(
    async (avatarPath: string) => {
      const { data, error } = await getFromStorage(avatarPath);

      if (error) throw error;
      if (!data) return;

      const fileReader = new FileReader();
      fileReader.readAsDataURL(data);
      fileReader.onload = () => {
        setAvatarUrl(fileReader.result as string);
      };
    },
    [setAvatarUrl],
  );

  useEffect(() => {
    async function loadAvatar() {
      const avatarPath = user?.user_metadata.avatar_path;

      try {
        if (avatarPath) {
          await downloadFromStorage(avatarPath);
        } else {
          await Font.loadAsync({
            MaterialIcons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
          });
        }
      } catch (error) {
        showInfoDialog(
          "Failed to download avatar",
          (error as PostgrestError).message.substring(0, 500),
        );
      } finally {
        setIsAvatarLoading(false);
      }
    }

    loadAvatar();
  }, [user?.user_metadata.avatar_path, downloadFromStorage, showInfoDialog]);

  const uploadAvatar = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled) return;

      setIsAvatarLoading(true);

      const avatarUri = result.assets[0].uri;
      const response = await fetch(avatarUri);

      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { data, error } = await supabase.storage
        .from("Avatars")
        .upload(
          `${user?.id}/avatar.${blob.type.slice(blob.type.indexOf("/") + 1) || "jpeg"}`,
          arrayBuffer,
          {
            contentType: blob.type,
            upsert: true,
          },
        );

      if (error) throw error;

      const { error: updateUserError } = await updateUser({
        avatarPath: data.path,
      });

      if (updateUserError) throw updateUserError;

      await downloadFromStorage(data.path);
    } catch (error) {
      showInfoDialog("Avatar upload failed", (error as PostgrestError).message);
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const avatarImage = (
    <Image
      source={{ uri: avatarUrl ?? undefined }}
      style={
        minimized ? avatarStyles.avatarImageMinimized : avatarStyles.avatarImage
      }
      alt="User avatar image"
      onLoad={() => setIsAvatarLoading(false)}
    />
  );

  return (
    <>
      {isAvatarLoading && (
        <ActivityIndicator
          animating
          color="white"
          size={size}
          style={{ marginBottom: 10 }}
        />
      )}
      {avatarUrl && !(isAvatarLoading && avatarUrl) ? (
        minimized ? (
          avatarImage
        ) : (
          <TouchableOpacity onPress={uploadAvatar} style={{ marginBottom: 10 }}>
            {avatarImage}
          </TouchableOpacity>
        )
      ) : (
        !isAvatarLoading && (
          <MaterialCommunityIcons
            name="account-edit"
            size={size}
            color={minimized ? "black" : "white"}
            onPress={minimized ? undefined : uploadAvatar}
            style={{ marginBottom: 0 }}
          />
        )
      )}
    </>
  );
}
