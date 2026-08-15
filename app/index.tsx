import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Screen } from "../components/Screen";
import { Button, Card, Field, Subtitle, Title } from "../components/UI";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  async function choosePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  function startAudit() {
    if (!name.trim()) return Alert.alert("Add your name", "Enter the name you want to audit.");
    router.push({ pathname: "/dashboard", params: { name } });
  }

  return <Screen>
    <View style={s.hero}>
      <Text style={s.badge}>PRIVATE IDENTITY AUDIT</Text>
      <Title>Identity Guard</Title>
      <Subtitle>Find and fix public exposure connected to your own identity. This starter app does not identify strangers or perform facial identification.</Subtitle>
    </View>

    <Card>
      <Text style={s.section}>Start your identity audit</Text>
      <Field label="Your name" value={name} onChangeText={setName} placeholder="e.g. Jane Doe" />
      <View style={{height:12}} />
      <Button title={photo ? "Change reference photo" : "Add reference photo"} onPress={choosePhoto} secondary />
      {photo && <Image source={{uri:photo}} style={s.photo} />}
      <View style={{height:12}} />
      <Button title="Run privacy audit" onPress={startAudit} />
    </Card>

    <Card>
      <Text style={s.section}>What this MVP checks</Text>
      {["Public profile exposure","Username and email mentions","Credential/breach indicators","Impersonation signals","Remediation steps"].map(x =>
        <Text key={x} style={s.item}>✓  {x}</Text>
      )}
    </Card>
  </Screen>
}
const s=StyleSheet.create({
  hero:{paddingVertical:22,gap:5},
  badge:{fontSize:11,fontWeight:"900",letterSpacing:1.4,color:"#475467",marginBottom:8},
  section:{fontSize:18,fontWeight:"800",color:"#111827",marginBottom:14},
  photo:{width:100,height:100,borderRadius:14,marginTop:12},
  item:{fontSize:15,color:"#344054",paddingVertical:7}
});
