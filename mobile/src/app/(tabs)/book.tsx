import { FlatList, Text, View } from "react-native";
import { PickRow } from "../../components/CarCards";
import { BrandHeader } from "../../components/Header";
import { TAB_BAR_SPACE } from "../../components/TabBar";
import { useStore } from "../../lib/store";
import { c, t } from "../../lib/theme";

// Pastki menyudagi "Bron": avval mashina tanlanadi, keyin forma ochiladi
export default function BookPick() {
  const { t: d, cars } = useStore();
  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BrandHeader />
      <FlatList
        data={cars}
        keyExtractor={(x) => x.slug}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: TAB_BAR_SPACE }}
        ListHeaderComponent={
          <View style={{ paddingBottom: 6 }}>
            <Text style={t.headlineLgMobile}>{d.pick.title}</Text>
            <Text style={[t.bodySm, { marginTop: 2 }]}>{d.pick.sub}</Text>
          </View>
        }
        renderItem={({ item }) => <PickRow car={item} d={d} />}
      />
    </View>
  );
}
