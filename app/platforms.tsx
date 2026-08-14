import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Button, Card, Field, Subtitle, Title } from "../components/UI";

export default function Platforms(){
 const [url,setUrl]=useState("");
 const [platforms,setPlatforms]=useState<string[]>([]);
 function add(){
   try {
     const u=new URL(url);
     if(!/^https?:$/.test(u.protocol)) throw new Error("protocol");
     setPlatforms(p=>p.includes(u.origin)?p:[...p,u.origin]); setUrl("");
   } catch { Alert.alert("Invalid URL","Enter a valid http(s) platform URL, such as https://github.com"); }
 }
 return <Screen>
  <Title>Selected platforms</Title>
  <Subtitle>Add public sites you want included as scoped web-search targets. This does not bypass login controls or scrape faces.</Subtitle>
  <View style={{height:16}}/>
  <Card><Field label="Platform URL" value={url} onChangeText={setUrl} placeholder="https://example.com"/><View style={{height:10}}/><Button title="Add platform" onPress={add}/></Card>
  {platforms.length===0 && <Card><Text style={s.note}>No platforms selected yet. Platform-specific persistence will be added with user accounts/database storage.</Text></Card>}
  {platforms.map(p=><Card key={p}><View style={s.row}><Text style={s.name}>{p}</Text><Text style={s.status}>Selected</Text></View></Card>)}
 </Screen>
}
const s=StyleSheet.create({row:{flexDirection:"row",justifyContent:"space-between",gap:10},name:{fontWeight:"800",fontSize:16,flex:1},status:{color:"#027A48",fontWeight:"800"},note:{color:"#667085",lineHeight:21}});
