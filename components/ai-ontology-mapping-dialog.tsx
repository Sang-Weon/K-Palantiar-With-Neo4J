"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Database,
  Network,
  CheckCircle2,
  Zap,
  Scale,
  Globe,
  Shield,
  TrendingUp,
  Loader2,
  Tag,
  LinkIcon,
} from "lucide-react"
import { OntologyService } from "@/lib/ontology-service"

interface AIOntologyMappingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

type Stage = "analyzing" | "constraints" | "mapping" | "validation" | "completed"

export function AIOntologyMappingDialog({ open, onOpenChange, onComplete }: AIOntologyMappingDialogProps) {
  const [stage, setStage] = useState<Stage>("analyzing")
  const [progress, setProgress] = useState(0)
  const [currentLog, setCurrentLog] = useState("")
  const [isFinishing, setIsFinishing] = useState(false)

  useEffect(() => {
    if (!open) return

    setStage("analyzing")
    setProgress(0)
    setCurrentLog("")
    setIsFinishing(false)

    // Stage 1: 데이터 분석 (드림텍 SAP ERP 시뮬레이션)
    const timer1 = setTimeout(() => {
      setStage("analyzing")
      setProgress(15)
      setCurrentLog("드림텍 SAP ERP 모바일 부문 스캔 중...")
    }, 500)

    const timer2 = setTimeout(() => {
      setProgress(25)
      setCurrentLog("베트남 Vina 1/2 생산 관리 데이터 구조 분석 중...")
    }, 1500)

    // Stage 2: 제약조건 및 규제 (핸드폰 부품 규격)
    const timer3 = setTimeout(() => {
      setStage("constraints")
      setProgress(35)
      setCurrentLog("삼성전자(SEC) 품질 인증 가이드라인 검토 중...")
    }, 2800)

    const timer4 = setTimeout(() => {
      setProgress(45)
      setCurrentLog("유해물질 제한 지침(RoHS) 준수 여부 매핑 중...")
    }, 3800)

    const timer5 = setTimeout(() => {
      setProgress(55)
      setCurrentLog("물류 리드타임 제약조건(천안-베트남) 반영 중...")
    }, 4800)

    // Stage 3: 온톨로지 매핑 (드림텍 객체 모델링)
    const timer6 = setTimeout(() => {
      setStage("mapping")
      setProgress(60)
      setCurrentLog("모바일 모듈 비즈니스 객체(Object) 추출 중...")
    }, 5800)

    const timer7 = setTimeout(() => {
      setProgress(70)
      setCurrentLog("수율, 가동율, 원가 속성(Property) 정의 중...")
    }, 6800)

    const timer8 = setTimeout(() => {
      setProgress(80)
      setCurrentLog("부품-공정-완제품 관계(Link) 매핑 중...")
    }, 7800)

    // Stage 4: 검증
    const timer9 = setTimeout(() => {
      setStage("validation")
      setProgress(90)
      setCurrentLog("온톨로지 데이터 무결성 검증 중...")
    }, 8800)

    const timer10 = setTimeout(() => {
      setProgress(95)
      setCurrentLog("갤럭시 S24 센서 모듈 공급망 정합성 확인 중...")
    }, 9500)

    // Stage 5: 완료
    const timer11 = setTimeout(() => {
      setStage("completed")
      setProgress(100)
      setCurrentLog("드림텍 특화 온톨로지 매핑 완료!")
    }, 10500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
      clearTimeout(timer7)
      clearTimeout(timer8)
      clearTimeout(timer9)
      clearTimeout(timer10)
      clearTimeout(timer11)
    }
  }, [open])

  const handleComplete = async () => {
    setIsFinishing(true)
    console.log("Triggering seedInitialData in dialog...")
    try {
      // 대량 데이터 생성을 위해 타임아웃 없이 비동기 처리 보장
      await OntologyService.seedInitialData()
      console.log("Seeding complete in dialog.")

      onComplete?.()

      // 사용자에게 성공 메시지를 잠시 보여준 후 닫기
      setTimeout(() => {
        onOpenChange(false)
        setIsFinishing(false)
      }, 800)
    } catch (error) {
      console.error("Critical error during seeding:", error)
      alert("데이터 생성 중 네트워크 오류가 발생했습니다. 잠시 후 선택해 주세요.")
      setIsFinishing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-purple-400" />
            AI 온톨로지 자동 매핑 (Dreamtech Mobile Scenario)
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            드림텍의 부품 생산부터 삼성전자 공급망까지의 데이터를 객체, 속성, 관계 기반으로 자동 모델링합니다
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-zinc-800/50 border-zinc-700 p-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">{currentLog}</span>
              <span className="text-purple-400 font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        {/* 1단계: 데이터 분석 */}
        {(stage === "analyzing" || progress > 25) && (
          <Card className="bg-zinc-800/50 border-zinc-700 p-4">
            <div className="flex items-start gap-3 mb-3">
              <Database className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-400 mb-2">1단계: 전사 데이터 소스 스캔</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">SAP ERP (PBA 생산 및 원가 모듈)</span>
                    {progress >= 15 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">베트남 Vina MES (실시간 수율/가동율)</span>
                    {progress >= 25 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 2단계: 제약조건 평가 */}
        {(stage === "constraints" || progress > 55) && (
          <Card className="bg-zinc-800/50 border-zinc-700 p-4">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-400 mb-2">2단계: 품질 인증 및 규제 제약조건</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Scale className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-zinc-300">SEC 대응 품질 규격</span>
                      {progress >= 35 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-zinc-300">생산 리드타임 최적화 전략</span>
                      {progress >= 45 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 3단계: 온톨로지 매핑 */}
        {(stage === "mapping" || progress > 80) && (
          <Card className="bg-zinc-800/50 border-zinc-700 p-4">
            <div className="flex items-start gap-3 mb-3">
              <Network className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-400 mb-2">3단계: 드림텍 특화 온톨로지 매핑</h3>
                <div className="space-y-3">
                  <div className="ml-6 flex flex-wrap gap-2">
                    <Badge className="bg-blue-600">생산거점</Badge>
                    <Badge className="bg-blue-600">생산공정</Badge>
                    <Badge className="bg-blue-600">부품재료</Badge>
                    <Badge className="bg-blue-600">모듈제품</Badge>
                    <Badge className="bg-blue-600">고객단말</Badge>
                  </div>
                  <div className="ml-6 space-y-1 text-xs text-zinc-400">
                    <p>• 가동율, 수율, 원가, 리드타임 속성 매핑 완료</p>
                    <p>• 공정 → 모듈 → 갤럭시 S24 장착 관계 설정 완료</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {stage === "completed" && (
          <Card className="bg-green-500/10 border-green-500/30 p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400 mb-2">매핑 완료! (Dreamtech Kernel)</h3>
                <p className="text-sm text-zinc-300 mb-3">
                  드림텍 핸드폰 모듈 비즈니스 로직이 성공적으로 온톨로지로 변환되었습니다.
                </p>
                <Button
                  onClick={handleComplete}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isFinishing}
                >
                  {isFinishing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 데이터를 구축 중입니다...</>
                  ) : (
                    "온톨로지 데이터 적용 및 대시보드 확인"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
