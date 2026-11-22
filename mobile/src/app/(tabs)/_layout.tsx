import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { Platform } from "react-native";
import { useStore } from "../../lib/store";
import { c, f } from "../../lib/theme";

export default function TabsLayout() {
  const { t } = useStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.gold,
        tabBarInactiveTintColor: c.dim,
        tabBarStyle: { backgroundColor: "#0F0F0F", borderTopColor: c.line, ...(Platform.OS === "web" ? { height: 64 } : null) },
        tabBarLabelStyle: { fontFamily: f.bodySemi, fontSize: 11 },
        sceneStyle: { backgroundColor: c.ink },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.home, tabBarIcon: ({ color }) => <MaterialIcons name="home-filled" size={24} color={color as string} /> }} />
      <Tabs.Screen name="cars" options={{ title: t.tabs.cars, tabBarIcon: ({ color }) => <MaterialIcons name="directions-car" size={24} color={color as string} /> }} />
      <Tabs.Screen name="contacts" options={{ title: t.tabs.contacts, tabBarIcon: ({ color }) => <MaterialIcons name="support-agent" size={24} color={color as string} /> }} />
    </Tabs>
  );
}
