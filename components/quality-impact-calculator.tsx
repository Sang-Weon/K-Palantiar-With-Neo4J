"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, DollarSign, Target } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts"

interface QualityImpact {
  kpiImpact: {
    defectRate: { before: number; after: number; improvement: number }
    productivity: { before: number; after: number; improvement: number }
    yield: { before: number; after: number; improvement: number }
  }
  financialImpact: {
    costReduction: number
    revenueIncrease: number
    profitImprovement: number
    roi: number
  }
}

interface QualityImpactCalculatorProps {
  issueTitle: string
  onConfirm: (impact: QualityImpact) => void
}

export function QualityImpactCalculator({ issueTitle, onConfirm }: QualityImpactCalculatorProps) {
  const impact: QualityImpact = {
    kpiImpact: {
      defectRate: { before: 5.3, after: 0.8, improvement: 84.9 },
      productivity: { before: 85, after: 96, improvement: 12.9 },
      yield: { before: 94.7, after: 99.2, improvement: 4.8 },
    },
    financialImpact: {
      costReduction: 245000000, // 월간 2.45억원
      revenueIncrease: 180000000, // 월간 1.8억원 (불량 감소로 인한 판매량 증가)
      profitImprovement: 425000000, // 월간 4.25억원
      roi: 3.2, // 320%
    },
  }

  const radarData = [
    {
      metric: "불량률",
      Before: impact.kpiImpact.defectRate.before,
      After: impact.kpiImpact.defectRate.after,
    },
    {
      metric: "생산성",
      Before: impact.kpiImpact.productivity.before,
      After: impact.kpiImpact.productivity.after,
    },
    {
      metric: "수율",
      Before: impact.kpiImpact.yield.before,
      After: impact.kpiImpact.yield.after,
    },
  ]

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억원`
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`
    }
    return `${value.toLocaleString()}원`
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-800/50 border-zinc-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          KPI 영향 분석
        </h3>
        <p className="text-sm text-zinc-400 mb-6">이슈: {issueTitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                <Radar name="Before" dataKey="Before" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Radar name="After" dataKey="After" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div className="bg-zinc-900/50 border border-zinc-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">불량률</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                  {impact.kpiImpact.defectRate.improvement.toFixed(1)}% 개선
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-400">{impact.kpiImpact.defectRate.before}%</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
                <span className="text-green-400 font-bold">{impact.kpiImpact.defectRate.after}%</span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">생산성</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                  +{impact.kpiImpact.productivity.improvement.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">{impact.kpiImpact.productivity.before}%</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
                <span className="text-green-400 font-bold">{impact.kpiImpact.productivity.after}%</span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">수율</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                  +{impact.kpiImpact.yield.improvement.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">{impact.kpiImpact.yield.before}%</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
                <span className="text-green-400 font-bold">{impact.kpiImpact.yield.after}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-zinc-800/50 border-zinc-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          재무 영향 분석
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/50 border-zinc-700 p-4">
            <div className="text-xs text-zinc-400 mb-2">원가 절감 (월간)</div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {formatCurrency(impact.financialImpact.costReduction)}
            </div>
            <div className="text-xs text-zinc-500">불량품 감소, 재작업 절감</div>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-700 p-4">
            <div className="text-xs text-zinc-400 mb-2">매출 증대 (월간)</div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency(impact.financialImpact.revenueIncrease)}
            </div>
            <div className="text-xs text-zinc-500">판매량 증가, 클레임 감소</div>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-700 p-4">
            <div className="text-xs text-zinc-400 mb-2">영업이익 개선 (월간)</div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {formatCurrency(impact.financialImpact.profitImprovement)}
            </div>
            <div className="text-xs text-zinc-500">원가 절감 + 매출 증대</div>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-700 p-4">
            <div className="text-xs text-zinc-400 mb-2">투자 대비 수익률</div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{impact.financialImpact.roi * 100}%</div>
            <div className="text-xs text-zinc-500">ROI (6개월 기준)</div>
          </Card>
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-300 mb-1">재무적 인사이트</p>
              <p className="text-xs text-zinc-300">
                이 품질 조치를 완료하면 연간 약 <span className="text-green-400 font-bold">51억원</span>의 영업이익
                개선이 예상됩니다. 투자 회수 기간은 약 <span className="text-blue-400 font-bold">3.8개월</span>이며,
                SEC와의 장기 계약 갱신 가능성도 <span className="text-purple-400 font-bold">85%</span>로 증가합니다.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="bg-transparent">
          분석 다시 실행
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => onConfirm(impact)}>
          영향도 확정 및 대시보드 반영
        </Button>
      </div>
    </div>
  )
}
