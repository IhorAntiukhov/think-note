import { COLORS } from '@/src/constants/theme'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.background,
        tabBarStyle: {
          backgroundColor: COLORS.primary
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => <MaterialIcons name="account-tree" size={28} color={color} />
        }}
      />

      <Tabs.Screen
        name="ideas"
        options={{
          title: "Ideas",
          tabBarIcon: ({ color }) => <MaterialIcons name="lightbulb" size={28} color={color} />
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" size={28} color={color} />
        }}
      />
    </Tabs>
  )
}