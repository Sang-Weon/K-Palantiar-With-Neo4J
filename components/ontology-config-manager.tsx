"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, Database, LinkIcon, Tag, Network, Terminal, Share2, Loader2, Copy, Check, Download, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIOntologyMappingDialog } from "./ai-ontology-mapping-dialog"
import { OntologyService, ObjectType, PropertyType, LinkType } from "@/lib/ontology-service"
import { Neo4jService, Neo4jConfig } from "@/lib/neo4j-service"

export function OntologyConfigManager() {
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [linkTypes, setLinkTypes] = useState<LinkType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Firebase 실시간 구독 설정
    setIsLoading(true)
    const unsubscribeObjects = OntologyService.subscribeToObjectTypes((data) => {
      setObjectTypes(data)
      setIsLoading(false)
    })
    const unsubscribeProperties = OntologyService.subscribeToPropertyTypes(setPropertyTypes)
    const unsubscribeLinks = OntologyService.subscribeToLinkTypes(setLinkTypes)

    return () => {
      unsubscribeObjects()
      unsubscribeProperties()
      unsubscribeLinks()
    }
  }, [])

  useEffect(() => {
    if (objectTypes.length > 0 || linkTypes.length > 0) {
      const code = OntologyService.generateCypher(objectTypes, linkTypes)
      setCypherCode(code)
    }
  }, [objectTypes, linkTypes])

  const [showAIMappingDialog, setShowAIMappingDialog] = useState(false)
  const [cypherCode, setCypherCode] = useState("")

  // Neo4j Connection State
  const [neo4jConn, setNeo4jConn] = useState<Neo4jConfig>({
    uri: "bolt://localhost:7687",
    user: "neo4j",
    pass: ""
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const { toast } = useToast()

  const handleNeo4jConnect = async () => {
    setIsConnecting(true)
    try {
      await Neo4jService.connect(neo4jConn)
      setIsConnected(true)
      toast({ title: "Neo4j 연결 성공", description: "그래프 데이터베이스와 동기화 준비가 되었습니다." })
    } catch (e: any) {
      toast({
        title: "Neo4j 연결 실패",
        description: e.message || "연결 정보를 확인해 주세요.",
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleRunCypher = async () => {
    if (!isConnected) {
      toast({ title: "연결 필요", description: "먼저 Neo4j에 연결해 주세요.", variant: "destructive" })
      return
    }
    setIsExecuting(true)
    try {
      await Neo4jService.runQuery(cypherCode)
      toast({ title: "Neo4j 반영 완료", description: "온톨로지 스키마가 Neo4j에 성공적으로 구축되었습니다." })
    } catch (e: any) {
      toast({ title: "실행 오류", description: e.message, variant: "destructive" })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAIAutoMapping = () => {
    setShowAIMappingDialog(true)
  }

  const handleMappingComplete = () => {
    toast({
      title: "AI 온톨로지 매핑 완료",
      description: "데모용 드림텍 모듈 비즈니스 데이터가 Firebase와 동기화되었습니다.",
    })
    // 매핑 완료 후 Cypher 코드 자동 생성
    generateNeo4jCode()
  }

  const generateNeo4jCode = () => {
    const code = OntologyService.generateCypher(objectTypes, linkTypes)
    setCypherCode(code)
    toast({
      title: "Neo4j Cypher 생성됨",
      description: "그래프 DB 연동을 위한 Cypher 스크립트가 준비되었습니다.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 p-6 overflow-hidden relative">
        {/* 장식용 배경 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-1" />

        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              온톨로지 구성 및 그래프 DB 관리 (Firebase + Neo4j)
            </h2>
            <p className="text-sm text-zinc-400">
              드림텍 비즈니스 객체 및 관계를 정의하고 Neo4j 그래프 엔진과 연동합니다
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateNeo4jCode} className="border-green-500/50 text-green-400 hover:bg-green-500/10">
              <Network className="w-4 h-4 mr-2" />
              Neo4j 연동 확인
            </Button>
            <Button onClick={handleAIAutoMapping} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI 자동 매핑
            </Button>
          </div>
        </div>

        <Tabs defaultValue="objects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800/50 p-1 mb-4">
            <TabsTrigger value="objects">객체 (Object)</TabsTrigger>
            <TabsTrigger value="properties">속성 (Property)</TabsTrigger>
            <TabsTrigger value="links">관계 (Link)</TabsTrigger>
            <TabsTrigger value="neo4j" className="text-green-400">Neo4j Lab</TabsTrigger>
          </TabsList>

          <TabsContent value="objects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-400">{objectTypes.length}개의 객체가 정의되어 있습니다</p>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                    <Plus className="w-4 h-4 mr-1" />
                    객체 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle>새 객체 정의 (Type Schema)</DialogTitle>
                    <DialogDescription>수동으로 생성하거나 AI 매핑 결과를 수정합니다</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>객체 식별명</Label>
                      <Input placeholder="예: Site_Vina1" className="bg-zinc-800 border-zinc-700" />
                    </div>
                    <Button className="w-full bg-blue-600">저장하기</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {objectTypes.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-xl">
                  <Database className="w-8 h-8 text-zinc-700 mb-2" />
                  <p className="text-zinc-500 text-sm">정의된 객체가 없습니다. 우측 상단의 AI 자동 매핑을 실행하세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {objectTypes.map((obj) => (
                    <Card key={obj.id} className="bg-zinc-800/30 border-zinc-700/50 p-4 hover:border-purple-500/50 transition-colors group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg group-hover:text-purple-300 transition-colors">{obj.name}</h3>
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                              {obj.metadata?.neo4j_label || "Node"}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">{obj.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {obj.properties?.map(p => (
                          <Badge key={p.id} variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px]">
                            {p.name}:{p.type}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="properties">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-3">
                {propertyTypes.map((prop) => (
                  <Card key={prop.id} className="bg-zinc-800/30 border-zinc-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Tag className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{prop.name}</h4>
                        <p className="text-xs text-zinc-500">{prop.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-zinc-900 border-zinc-700 text-zinc-400 font-mono uppercase text-[10px]">
                      {prop.dataType}
                    </Badge>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="links">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-3">
                {linkTypes.map((link) => (
                  <Card key={link.id} className="bg-zinc-800/30 border-zinc-700 p-4 flex items-center gap-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <LinkIcon className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 flex items-center gap-4 text-sm">
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">{link.fromType}</Badge>
                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-[10px] text-zinc-500 font-mono mb-1">{link.name}</span>
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent relative">
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-zinc-600" />
                        </div>
                      </div>
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">{link.toType}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="neo4j" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 연결 설정 패널 */}
              <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  Neo4j 연결 설정
                </h3>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Connection URI</Label>
                    <Input
                      value={neo4jConn.uri}
                      onChange={(e) => setNeo4jConn({ ...neo4jConn, uri: e.target.value })}
                      className="bg-black border-zinc-800 text-xs font-mono"
                      placeholder="bolt://localhost:7687"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Username</Label>
                    <Input
                      value={neo4jConn.user}
                      onChange={(e) => setNeo4jConn({ ...neo4jConn, user: e.target.value })}
                      className="bg-black border-zinc-800 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Password</Label>
                    <Input
                      type="password"
                      value={neo4jConn.pass}
                      onChange={(e) => setNeo4jConn({ ...neo4jConn, pass: e.target.value })}
                      className="bg-black border-zinc-800 text-xs"
                    />
                  </div>
                  <Button
                    className={`w-full ${isConnected ? 'bg-green-600' : 'bg-blue-600'}`}
                    onClick={handleNeo4jConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isConnected ? "연결됨 (Connected)" : "Neo4j 인스턴스 연결"}
                  </Button>
                </div>
              </Card>

              {/* 쿼리 실행 패널 */}
              <Card className="lg:col-span-2 bg-black border-zinc-800 p-6 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-green-400" />
                    <div>
                      <h3 className="font-mono text-green-400 font-bold">Cypher Workflow</h3>
                      <p className="text-[10px] text-zinc-500">자동 생성된 쿼리를 Neo4j에 즉시 반영합니다</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleRunCypher}
                      disabled={isExecuting || !isConnected}
                    >
                      {isExecuting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Zap className="w-3 h-3 mr-2" />}
                      Neo4j에 쿼리 실행
                    </Button>
                  </div>
                </div>

                <div className="bg-zinc-950/80 rounded-lg border border-zinc-800 p-4 min-h-[300px]">
                  <ScrollArea className="h-[300px]">
                    <pre className="text-emerald-500/90 font-mono text-[11px] leading-6">
                      {cypherCode || "// AI 자동 매핑 후 쿼리 갱신을 누르면 Neo4j Cypher 코드가 생성됩니다."}
                    </pre>
                  </ScrollArea>
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 italic">
                  <span>Status: {isConnected ? "READY TO SYNC" : "DISCONNECTED"}</span>
                  <span>* 실행 전 반드시 Neo4j 인스턴스(Desktop/Aura)가 구동 중인지 확인하세요.</span>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <AIOntologyMappingDialog
        open={showAIMappingDialog}
        onOpenChange={setShowAIMappingDialog}
        onComplete={handleMappingComplete}
      />
    </div>
  )
}
