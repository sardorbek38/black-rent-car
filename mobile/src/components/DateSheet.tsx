import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Dict, Locale } from "../lib/i18n";
import { c, t } from "../lib/theme";
import { DatePick } from "./DatePick";
import { GoldButton } from "./ui";

/** Pastdan chiqadigan sana/vaqt tanlash oynasi */
export function DateSheet({ visible, title, value, onChange, onClose, minDay, locale, d, blocked, hasBusy }: {
  blocked?: (v: Date) => boolean; hasBusy?: boolean;
  visible: boolean; title: string; value: Date; onChange: (v: Date) => void; onClose: () => void; minDay: Date; locale: Locale; d: Dict;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={s.handle} />
        <Text style={[t.labelMd, { color: c.onVariant, textTransform: "uppercase", letterSpacing: 1 }]}>{title}</Text>
        <Text style={[t.headlineSm, { marginBottom: 6 }]}>{d.form.pickTitle}</Text>
        <DatePick value={value} onChange={onChange} minDay={minDay} locale={locale} t={d} blocked={blocked} />
        {hasBusy ? <Text style={[t.bodySm, { color: c.outline }]}>{d.form.busyNote}</Text> : null}
        <GoldButton label={d.form.done} icon="check" onPress={onClose} style={{ marginTop: 8 }} />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { backgroundColor: c.container, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, gap: 10 },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: c.highest, marginBottom: 6 },
});
