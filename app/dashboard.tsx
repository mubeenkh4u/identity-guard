import { useCallback, useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "../components/Screen";
import { Button, Card, Subtitle, Title } from "../components/UI";
import { Finding, ScanResponse, scanIdentity } from "../lib/api";

export default function Dashboard() {
  const { name, email, username } = useLocalSearchParams<{name?:string; email?:string; username?:string}>();
  const router=useRouter();
  const [result,setResult]=useState<ScanResponse|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  const runScan=useCallback(async()=>{
    setLoading(true); setError(null);
    try { setResult(await scanIdentity({name:name||"",email:email||undefined,username:username||undefined})); }
    catch(e){ setResult(null); setError(e instanceof Error ? e.message : "Scan failed."); }
    finally { setLoading(false); }
  },[name,email,username]);

  useEffect(()=>{ void runScan(); },[runScan]);

  return <Screen>
    <Title>Audit dashboard</Title>
    <Subtitle>Identity: {name || username || email || "your identity"}</Subtitle>
    <View style={{height:16}}/>
    {loading && <Card><Text style={s.finding}>Scanning configured sources…</Text><Text style={s.muted}>Results shown here come from the configured backend providers, not demo data.</Text></Card>}
    {error && <Card><Text style={s.error}>Scan unavailable</Text><Text style={s.muted}>{error}</Text><View style={{height:12}}/><Button title="Retry scan" onPress={runScan}/></Card>}
    {result && <>
      <Card><Text style={s.score}>{result.score}</Text><Text style={s.scoreLabel}>Privacy posture</Text><Text style={s.muted}>{result.findings.length} finding(s) • scanned {new Date(result.scannedAt).toLocaleString()}</Text></Card>
      {result.findings.length===0 && <Card><Text style={s.finding}>No findings returned</Text><Text style={s.muted}>That does not guarantee the identity has no exposure; it only means the currently configured providers returned none.</Text></Card>}
      {result.findings.map((f:Finding)=><Card key={f.id}>
        <View style={s.row}><Text style={s.finding}>{f.title}</Text><Text style={s.severity}>{f.severity}</Text></View>
        <Text style={s.muted}>{f.detail}</Text>
        {f.source && <Text style={s.source}>Source: {f.source}</Text>}
        <View style={{height:10}}/>
        {f.url && <View style={{marginBottom:8}}><Button title="Open evidence" onPress={()=>void Linking.openURL(f.url!)} secondary /></View>}
        <Button title="View remediation" onPress={()=>router.push("/remediation")} secondary />
      </Card>)}
      <Button title="Run scan again" onPress={runScan} secondary />
      <View style={{height:10}}/>
    </>}
    <Button title="Manage platforms" onPress={()=>router.push("/platforms")} />
  </Screen>
}
const s=StyleSheet.create({
 score:{fontSize:48,fontWeight:"900",color:"#111827"},scoreLabel:{fontWeight:"800",fontSize:16},muted:{color:"#667085",lineHeight:21,marginTop:5},
 row:{flexDirection:"row",justifyContent:"space-between",gap:10},finding:{fontSize:17,fontWeight:"800",flex:1},severity:{fontWeight:"800",color:"#B54708"},
 error:{fontSize:18,fontWeight:"900",color:"#B42318"},source:{fontSize:12,color:"#475467",marginTop:8}
});
