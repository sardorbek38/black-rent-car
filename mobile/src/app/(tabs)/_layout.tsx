import { Tabs } from "expo-router/tabs";
import { TabBar } from "../../components/TabBar";
import { useStore } from "../../lib/store";
import { c } from "../../lib/theme";

export default function TabsLayout() {
  const { t } = useStore();
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.surface } }}>
      <Tabs.Screen name="index" options={{ title: t.tabs.home }} />
      <Tabs.Screen name="cars" options={{ title: t.tabs.cars }} />
      <Tabs.Screen name="book" options={{ title: t.tabs.book }} />
      <Tabs.Screen name="contacts" options={{ title: t.tabs.contacts }} />
    </Tabs>
  );
}
