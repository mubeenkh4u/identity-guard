import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button, Card, Subtitle, Title } from "../components/UI";

const steps=["Verify the finding belongs to you before changing anything.","Remove phone/address details from profiles where they are unnecessary.","Enable MFA/passkeys on important accounts.","Change passwords exposed in a confirmed breach and never reuse them.","Report impersonating profiles through the platform's official process.","Record the removal request and re-check the exposure after 7–30 days."];

export default function Remediation(){
 return <Screen>
  <Title>Remediation center</Title>
  <Subtitle>Turn verified findings into concrete privacy improvements.</Subtitle>
  <View style={{height:16}}/>
  <Card>{steps.map((x,i)=><View key={x} style={s.step}><Text style={s.num}>{i+1}</Text><Text style={s.text}>{x}</Text></View>)}</Card>
  <Button title="Mark checklist complete" onPress={()=>{}}/>
 </Screen>
}
const s=StyleSheet.create({step:{flexDirection:"row",gap:12,paddingVertical:11,borderBottomWidth:1,borderBottomColor:"#EEF0F3"},num:{fontWeight:"900",width:24},text:{flex:1,color:"#344054",lineHeight:21}});
