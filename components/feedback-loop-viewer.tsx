"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, Database, Brain, Zap } from "lucide-react"

export function FeedbackLoopViewer() {
  const loopStages = [
    {
      stage: "데이터 수집",
      icon: Database,
      color: "text-blue-400",
      description: "SAP, MES, IoT 센서로부터 실시간 데이터 수집",
      examples: ["생산 실적", "품질 측정값", "설비 가동률"],
    },
    {
      stage: "온톨로지 매핑",
      icon: RefreshCw,
      color: "text-purple-400",
      description: "Raw 데이터를 비즈니스 객체로 변환",
      examples: ["주문 객체 생성", "공장-부품 관계 연결", "로직 자동 적용"],
    },
    {
      stage: "AI 분석 & 추론",
      icon: Brain,
      color: "text-yellow-400",
      description: "온톨로지 기반으로 AI가 패턴 학습 및 추론",
      examples: ["이상 패턴 탐지", "최적화 방안 생성", "리스크 예측"],
    },
    {
      stage: "의사결정 & 액션",
      icon: Zap,
      color: "text-green-400",
      description: "사용자가 승인한 액션을 실제 시스템에 반영",
      examples: ["생산 오더 변경", "구매 요청 생성", "일정 재조정"],
    },
    {
      stage: "결과 기록 & 학습",
      icon: TrendingUp,
      color: "text-cyan-400",
      description: "실행 결과를 데이터로 기록하여 AI 재학습",
      examples: ["액션 효과 측정", "모델 성능 개선", "규칙 자동 업데이트"],
    },
  ]

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold">동적 피드백 루프</h2>
        <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500 ml-2">
          지속적 학습 및 최적화
        </Badge>
      </div>

      <p className="text-sm text-zinc-400 mb-6">
        의사결정 결과가 다시 데이터로 기록되어 AI 모델을 지속적으로 개선하는 순환 구조입니다.
      </p>

      <div className="space-y-4">
        {loopStages.map((stage, index) => (
          <div key={index} className="relative">
            <Card className="bg-zinc-800/50 border-zinc-700 p-4 hover:bg-zinc-800 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center">
                    <stage.icon className={`w-6 h-6 ${stage.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{stage.stage}</h3>
                    <Badge variant="outline" className="text-xs">
                      단계 {index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{stage.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.examples.map((example, i) => (
                      <Badge key={i} variant="outline" className="bg-zinc-900/50 text-zinc-300 border-zinc-600 text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            {index < loopStages.length - 1 && (
              <div className="flex justify-center my-2">
                <div className="w-0.5 h-6 bg-gradient-to-b from-zinc-600 to-zinc-800" />
              </div>
            )}
          </div>
        ))}

        {/* 순환 표시 */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 text-sm text-cyan-400">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
            <span>지속적 순환 및 개선</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
