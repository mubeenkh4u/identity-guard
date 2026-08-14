import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Screen } from "../components/Screen";
import { Button, Card, Field, Subtitle, Title } from "../components/UI";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  async function choosePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  function startAudit() {
    if (!name.trim() && !email.trim() && !username.trim()) {
      return Alert.alert("Add an identifier", "Enter your name, email, or username to audit.");
    }
    router.push({ pathname: "/dashboard", params: { name: name.trim(), email: email.trim(), username: username.trim() } });
  }

  return <Screen>
    <View style={s.hero}>
      <Text style={s.badge}>PRIVATE IDENTITY AUDIT</Text>
      <Title>Identity Guard</Title>
      <Subtitle>Search public exposure tied to identifiers you are authorized to audit, then review evidence and remediation steps.</Subtitle>
    </View>
    <Card>
      <Text style={s.section}>Start your identity audit</Text>
      <Field label="Your name" value={name} onChangeText={setName} placeholder="e.g. Jane Doe" />
      <View style={{height:12}} />
      <Field label="Your email (optional)" value={email} onChangeText={setEmail} placeholder="jane@example.com" />
      <View style={{height:12}} />
      <Field label="Your username (optional)" value={username} onChangeText={setUsername} placeholder="janedoe" />
      <View style={{height:12}} />
      <Button title={photo ? "Change reference photo" : "Add reference photo (optional)"} onPress={choosePhoto} secondary />
      {photo && <Image source={{uri:photo}} style={s.photo} />}
      <Text style={s.note}>The reference photo stays local in this version and is not used for facial identification.</Text>
      <View style={{height:12}} />
      <Button title="Run privacy audit" onPress={startAudit} />
    </Card>
    <Card>
      <Text style={s.section}>Live checks when configured</Text>
      {["Public web results for supplied identifiers","Selected-platform web results","Known breach exposure for supplied email","Evidence URLs and timestamps","Risk score calculated from actual findings"].map(x => <Text key={x} style={s.item}>✓  {x}</Text>)}
    </Card>
  </Screen>
}
const s=StyleSheet.create({
  hero:{paddingVertical:22,gap:5},badge:{fontSize:11,fontWeight:"900",letterSpacing:1.4,color:"#475467",marginBottom:8},
  section:{fontSize:18,fontWeight:"800",color:"#111827",marginBottom:14},photo:{width:100,height:100,borderRadius:14,marginTop:12},
  item:{fontSize:15,color:"#344054",paddingVertical:7},note:{fontSize:12,color:"#667085",marginTop:8,lineHeight:18}
});
