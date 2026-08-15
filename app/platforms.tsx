import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button, Card, Field, Subtitle, Title } from "../components/UI";

export default function Platforms(){
 const [url,setUrl]=useState("");
 const [platforms,setPlatforms]=useState<string[]>(["GitHub","LinkedIn","Reddit"]);
 function add(){
   try { const u=new URL(url); setPlatforms(p=>[...p,u.hostname]); setUrl(""); }
   catch { Alert.alert("Invalid URL","Enter a valid platform URL, such as https://example.com"); }
 }
 return <Screen>
  <Title>Authorized platforms</Title>
  <Subtitle>Add sites you want to monitor. Production integrations should use official APIs, OAuth, or another authorization mechanism—not facial scraping.</Subtitle>
  <View style={{height:16}}/>
  <Card>
    <Field label="Platform URL" value={url} onChangeText={setUrl} placeholder="https://example.com"/>
    <View style={{height:10}}/><Button title="Add platform" onPress={add}/>
  </Card>
  {platforms.map(p=><Card key={p}><View style={s.row}><Text style={s.name}>{p}</Text><Text style={s.status}>Ready</Text></View></Card>)}
 </Screen>
}
const s=StyleSheet.create({row:{flexDirection:"row",justifyContent:"space-between"},name:{fontWeight:"800",fontSize:16},status:{color:"#027A48",fontWeight:"800"}});
