"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, XCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { QualityIssueDialog } from "@/components/quality-issue-dialog"

interface QualitySpec {
  id: string
  name: string
  requirement: string
  current: number
  target: number
  status: "normal" | "warning" | "critical"
}

interface QualityIssue {
  id: string
  title: string
  severity: "high" | "medium" | "low"
  process: string
  defectRate: number
  occurredAt: string
}

export function QualityDefenseDashboard() {
  const [selectedIssue, setSelectedIssue] = useState<QualityIssue | null>(null)

  const specs: QualitySpec[] = [
    {
      id: "1",
      name: "외관 불량률",
      requirement: "< 0.5%",
      current: 0.42,
      target: 0.5,
      status: "normal",
    },
    {
      id: "2",
      name: "치수 공차",
      requirement: "±0.1mm",
      current: 0.08,
      target: 0.1,
      status: "normal",
    },
    {
      id: "3",
      name: "도장 두께",
      requirement: "50-70μm",
      current: 68,
      target: 70,
      status: "warning",
    },
    {
      id: "4",
      name: "조립 강도",
      requirement: "> 150N",
      current: 142,
      target: 150,
      status: "critical",
    },
  ]

  const trendData = [
    { date: "1주", 불량률: 0.52, 목표: 0.5 },
    { date: "2주", 불량률: 0.48, 목표: 0.5 },
    { date: "3주", 불량률: 0.45, 목표: 0.5 },
    { date: "4주", 불량률: 0.42, 목표: 0.5 },
  ]

  const issues: QualityIssue[] = [
    {
      id: "Q001",
      title: "조립 공정 강도 미달",
      severity: "high",
      process: "조립",
      defectRate: 5.3,
      occurredAt: "2026-01-08 14:23",
    },
    {
      id: "Q002",
      title: "도장 두께 편차 증가",
      severity: "medium",
      process: "도장",
      defectRate: 2.8,
      occurredAt: "2026-01-09 09:15",
    },
    {
      id: "Q003",
      title: "사출 치수 불량",
      severity: "low",
      process: "사출",
      defectRate: 1.2,
      occurredAt: "2026-01-10 16:40",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "critical":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
      case "critical":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      default:
        return ""
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 좌측: 삼성전자 품질 요구사항 */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-4 lg:p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            SEC 품질 요구사항
          </h2>
          <div className="space-y-4">
            {specs.map((spec) => (
              <div key={spec.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(spec.status)}
                    <span className="font-semibold text-sm">{spec.name}</span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(spec.status)}>
                    {spec.current}
                  </Badge>
                </div>
                <div className="text-xs text-zinc-400 ml-6">요구사항: {spec.requirement}</div>
                <Progress value={(spec.current / spec.target) * 100} className="ml-6" />
              </div>
            ))}
          </div>
        </Card>

        {/* 중앙: 품질 매트릭 및 불량률 트렌드 */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-4 lg:p-6 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-400" />
            불량률 트렌드 분석
          </h2>

          {/* 트렌드 차트 */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="date" stroke="#a1a1aa" style={{ fontSize: "12px" }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="불량률" stroke="#ef4444" strokeWidth={2} name="실제 불량률 (%)" />
                <Line
                  type="monotone"
                  dataKey="목표"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="목표 (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 공정별 불량 분포 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">공정별 불량 분포</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">사출</div>
                <div className="text-lg font-bold text-green-400">0.8%</div>
                <TrendingDown className="w-4 h-4 text-green-400 mx-auto mt-1" />
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">도장</div>
                <div className="text-lg font-bold text-yellow-400">2.8%</div>
                <TrendingUp className="w-4 h-4 text-yellow-400 mx-auto mt-1" />
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">조립</div>
                <div className="text-lg font-bold text-red-400">5.3%</div>
                <TrendingUp className="w-4 h-4 text-red-400 mx-auto mt-1" />
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">검사</div>
                <div className="text-lg font-bold text-green-400">0.3%</div>
                <TrendingDown className="w-4 h-4 text-green-400 mx-auto mt-1" />
              </div>
            </div>
          </div>

          {/* 품질 이슈 목록 */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">활성 품질 이슈</h3>
            <div className="space-y-2">
              {issues.map((issue) => (
                <Card
                  key={issue.id}
                  className="bg-zinc-800/50 border-zinc-700 p-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityColor(issue.severity)}>{issue.severity.toUpperCase()}</Badge>
                        <span className="text-xs text-zinc-400">{issue.id}</span>
                      </div>
                      <div className="font-semibold text-sm mb-1">{issue.title}</div>
                      <div className="text-xs text-zinc-400">
                        공정: {issue.process} | 불량률: {issue.defectRate}% | {issue.occurredAt}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-2 bg-transparent">
                      조치
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quality Issue Workflow Dialog */}
      {selectedIssue && (
        <QualityIssueDialog
          open={!!selectedIssue}
          onOpenChange={(open) => !open && setSelectedIssue(null)}
          issue={selectedIssue}
        />
      )}
    </>
  )
}
