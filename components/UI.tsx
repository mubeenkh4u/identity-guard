import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}
export function Title({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}
export function Subtitle({ children }: PropsWithChildren) {
  return <Text style={styles.subtitle}>{children}</Text>;
}
export function Button({ title, onPress, secondary=false }: {title:string; onPress:()=>void; secondary?:boolean}) {
  return <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondary]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
  </Pressable>;
}
export function Field({ label, value, onChangeText, placeholder }: {label:string; value:string; onChangeText:(s:string)=>void; placeholder?:string}) {
  return <View style={{gap:7}}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={styles.input} autoCapitalize="none" />
  </View>;
}
export const styles = StyleSheet.create({
  card:{backgroundColor:"#fff",borderRadius:18,padding:18,marginBottom:14,borderWidth:1,borderColor:"#E6E8EC"},
  title:{fontSize:30,fontWeight:"800",color:"#111827",marginBottom:7},
  subtitle:{fontSize:15,color:"#667085",lineHeight:22},
  label:{fontSize:13,fontWeight:"700",color:"#344054"},
  input:{borderWidth:1,borderColor:"#D0D5DD",borderRadius:12,paddingHorizontal:14,paddingVertical:12,fontSize:16,backgroundColor:"#fff"},
  button:{backgroundColor:"#111827",paddingVertical:13,paddingHorizontal:17,borderRadius:12,alignItems:"center"},
  secondary:{backgroundColor:"#fff",borderWidth:1,borderColor:"#D0D5DD"},
  buttonText:{color:"#fff",fontWeight:"800",fontSize:15},
  secondaryText:{color:"#111827"}
});
