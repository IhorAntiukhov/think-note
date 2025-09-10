import supabase from "@/src/api/supabase";
import { updateUser } from "@/src/features/auth/api/auth";
import useAuthStore from "@/src/store/authStore";
import { errorAlert } from "@/src/utils/alerts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Font from "expo-font";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import profileStyles from "../styles/profile.styles";
import { PostgrestError } from "@supabase/supabase-js";

interface AvatarProps {
  minimized?: boolean;
}

export default function Avatar({ minimized = false }: AvatarProps) {
  const { session, avatarUrl, setAvatarUrl } = useAuthStore();
  const user = session?.user;

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);

  const size = minimized ? 48 : 96;

  const downloadFromStorage = useCallback(
    async (avatarPath: string) => {
      const { data, error } = await supabase.storage
        .from("Avatars")
        .download(avatarPath);

      if (!data || error) throw error;

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
      } finally {
        setIsAvatarLoading(false);
      }
    }

    loadAvatar();
  }, [user?.user_metadata.avatar_path, downloadFromStorage]);

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

      const { error: updateUserError } = await updateUser(
        undefined,
        undefined,
        undefined,
        data.path,
      );

      if (updateUserError) throw updateUserError;

      downloadFromStorage(data.path);
    } catch (error) {
      errorAlert("Avatar upload failed", error as PostgrestError);
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const avatarImage = (
    <Image
      source={{ uri: avatarUrl }}
      style={
        minimized
          ? profileStyles.avatarImageMinimized
          : profileStyles.avatarImage
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
            color={"white"}
            onPress={minimized ? undefined : uploadAvatar}
            style={{ marginBottom: 10 }}
          />
        )
      )}
    </>
  );
}
