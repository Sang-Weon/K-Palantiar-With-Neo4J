"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Database, ArrowRight, CheckCircle2, Loader2, AlertCircle, FileText } from "lucide-react"
import { OntologyService, WritebackAction } from "@/lib/ontology-service"

interface KineticWritebackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  decision: string
}

export function KineticWritebackDialog({ open, onOpenChange, decision }: KineticWritebackDialogProps) {
  const [stage, setStage] = useState<WritebackAction["status"] | "preparing">("preparing")
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [writebackDetails, setWritebackDetails] = useState<any[]>([])
  const [actionId, setActionId] = useState<string | null>(null)
  const isProcessingRef = useRef(false)

  useEffect(() => {
    if (open && !isProcessingRef.current) {
      isProcessingRef.current = true
      // 초기화
      setStage("preparing")
      setProgress(0)
      setLogs(["[AIP] Kinetic 계층 트랜잭션 수립 중..."])
      setWritebackDetails([])

      // 1. Firebase에 트랜잭션 생성
      const startWriteback = async () => {
        try {
          const id = await OntologyService.executeWriteback({
            actionTypeId: "k-palantir-integrated-action",
            decision: decision,
            status: "pending",
            progress: 5,
            logs: ["[AIP] 분석 결과 기반 실행 계획 작성 완료"],
            results: [],
          });
          setActionId(id);

          // 실시간 상태 구독
          const unsubscribe = OntologyService.subscribeToAction(id, (action) => {
            setStage(action.status);
            setProgress(action.progress);
            setLogs(action.logs);
            setWritebackDetails(action.results || []);
          });

          // 시뮬레이션: 워커 프로세스 (실제 Firestore 업데이트 수행)
          simulateServerProcessing(id);

          return () => {
            unsubscribe();
            // Note: isProcessingRef.current reset is handled inside the simulation finish
          }
        } catch (error) {
          console.error("Writeback failed:", error);
          setStage("failed");
          isProcessingRef.current = false;
        }
      };

      startWriteback();
    }
  }, [open, decision]);

  //서버 프로세싱 시뮬레이션 로직 (실제 Firestore 업데이트)
  const simulateServerProcessing = async (id: string) => {
    const currentLogs = ["[AIP] 분석 결과 기반 실행 계획 작성 완료"];

    const steps = [
      { status: "processing", progress: 25, log: "[SAP] ERP Global_Plant 재고 수위 조정 (SKU_Component #7701)" },
      { status: "processing", progress: 50, log: "[MES] 천안 공장 생산 라인 스케줄링 재배치 반영" },
      { status: "processing", progress: 75, log: "[Logistics] Logistics_Hub 컨테이너 배차 우선순위 상향 조정" },
      {
        status: "completed", progress: 100, log: "[Success] 최적화 시나리오 모든 하위 시스템 반영 완료",
        result: { system: "K-Palantir Kernel", module: "Ontology Sync", records: 5 }
      },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1800));
      currentLogs.push(step.log);

      const updates: Partial<WritebackAction> = {
        status: step.status as WritebackAction["status"],
        progress: step.progress,
        logs: currentLogs,
      };

      if (step.result) {
        setWritebackDetails(prev => {
          const newResults = [...prev, step.result];
          updates.results = newResults;
          return newResults;
        });
      }

      await OntologyService.updateWritebackAction(id, updates);
    }
    isProcessingRef.current = false;
  };

  const getStageTitle = () => {
    switch (stage) {
      case "preparing": return "트랜잭션 초기화"
      case "pending": return "커널 대기 중"
      case "processing": return "시스템 비동기 반영 중"
      case "completed": return "반영 성공"
      case "failed": return "오류 발생"
      default: return "진행 중"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="w-6 h-6 text-green-400" />
            키네틱 계층: 글로벌 최적화 제안 실행 (AIP)
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            실행 ID: <span className="font-mono text-zinc-500">{actionId || "생성 중..."}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-zinc-800/50 border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {stage === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : stage === "failed" ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                )}
                <span className="font-semibold">{getStageTitle()}</span>
              </div>
              <Badge className="bg-blue-600 font-mono">{Math.round(progress)}%</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>

          {writebackDetails.length > 0 && (
            <Card className="bg-zinc-800/50 border-zinc-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold">Ontology Write-back Summary</h3>
              </div>
              <div className="space-y-2">
                {writebackDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-zinc-900 rounded border border-zinc-700">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{detail.system}</span>
                      <span className="text-[10px] text-zinc-500">{detail.module} Layer</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Sync: {detail.records} Objects
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="bg-black/30 border-zinc-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold">AIP Integration Logs</h3>
            </div>
            <div className="space-y-1 font-mono text-[11px] max-h-40 overflow-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-zinc-400 border-l border-zinc-700 pl-3 py-0.5">
                  <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
            </div>
          </Card>

          {stage === "completed" && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                제안된 최적화 루프가 성공적으로 완결되었습니다.
              </div>
              실시간 온톨로지 지표가 업데이트되어 대시보드에 반영 중입니다.
            </div>
          )}

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
              onClick={() => onOpenChange(false)}
              disabled={stage !== "completed" && stage !== "failed"}
            >
              업데이트 결과 확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
