import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button, Card, Subtitle, Title } from "../components/UI";

const findings = [
  {title:"Public profile exposure", severity:"Review", detail:"Several public profiles may be associated with the supplied name. Verify ownership before taking action."},
  {title:"Credential exposure", severity:"High", detail:"Connect a breach-monitoring provider or authorized account source to verify whether your identifiers appear in known incidents."},
  {title:"Impersonation risk", severity:"Review", detail:"Look for duplicate usernames, profile photos, or bios that could confuse people about which account is yours."}
];

export default function Dashboard() {
  const { name } = useLocalSearchParams<{name:string}>();
  const router=useRouter();
  return <Screen>
    <Title>Audit dashboard</Title>
    <Subtitle>Identity: {name || "your identity"}</Subtitle>
    <View style={{height:16}}/>
    <Card>
      <Text style={s.score}>72</Text>
      <Text style={s.scoreLabel}>Privacy posture</Text>
      <Text style={s.muted}>Demo score — replace with server-side risk scoring after connecting authorized data sources.</Text>
    </Card>
    {findings.map(f=><Card key={f.title}>
      <View style={s.row}><Text style={s.finding}>{f.title}</Text><Text style={s.severity}>{f.severity}</Text></View>
      <Text style={s.muted}>{f.detail}</Text>
      <View style={{height:10}}/>
      <Button title="View remediation" onPress={()=>router.push("/remediation")} secondary />
    </Card>)}
    <Button title="Manage platforms" onPress={()=>router.push("/platforms")} />
  </Screen>
}
const s=StyleSheet.create({
 score:{fontSize:48,fontWeight:"900",color:"#111827"},scoreLabel:{fontWeight:"800",fontSize:16},muted:{color:"#667085",lineHeight:21,marginTop:5},
 row:{flexDirection:"row",justifyContent:"space-between",gap:10},finding:{fontSize:17,fontWeight:"800",flex:1},severity:{fontWeight:"800",color:"#B54708"}
});
