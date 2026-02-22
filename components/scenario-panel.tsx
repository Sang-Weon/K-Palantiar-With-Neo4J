"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { SimulationEngineDialog } from "@/components/simulation-engine-dialog"

interface ScenarioPanelProps {
  onExecute: (option: string) => void
}

export function ScenarioPanel({ onExecute }: ScenarioPanelProps) {
  const [selectedOption, setSelectedOption] = useState("option1")
  const [showSimulation, setShowSimulation] = useState(false)

  const chartData = [
    {
      name: "현재",
      비용: 850000,
      매출: 1200000,
    },
    {
      name: "옵션1",
      비용: 920000,
      매출: 1350000,
    },
    {
      name: "옵션2",
      비용: 880000,
      매출: 1180000,
    },
  ]

  const handleExecuteClick = () => {
    setShowSimulation(true)
  }

  const getOptionLabel = () => {
    return selectedOption === "option1" ? "옵션 1: 긴급 생산 증대" : "옵션 2: 재고 활용"
  }

  return (
    <>
      <div className="w-full lg:w-96 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col max-h-screen overflow-auto">
        {/* 헤더 */}
        <div className="p-4 border-b border-zinc-800">
          <Badge variant="destructive" className="mb-2">
            <AlertTriangle className="w-3 h-3 mr-1" />
            긴급 알림
          </Badge>
          <h2 className="font-semibold text-base lg:text-lg mb-1">SEC 수요 변경</h2>
          <p className="text-xs lg:text-sm text-zinc-400">Galaxy S25 수요 +2000대 증가</p>
        </div>

        {/* 시나리오 옵션 */}
        <div className="p-4 space-y-4 flex-1 overflow-auto">
          <div>
            <h3 className="text-sm font-semibold mb-3">대응 시나리오 선택</h3>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <Card
                className={`p-4 mb-3 cursor-pointer transition-colors ${
                  selectedOption === "option1" ? "bg-blue-500/20 border-blue-500" : "bg-zinc-800/50 border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="option1" id="option1" className="mt-1" />
                  <Label htmlFor="option1" className="cursor-pointer flex-1">
                    <div className="font-semibold text-sm mb-1">옵션 1: 긴급 생산 증대</div>
                    <p className="text-xs text-zinc-400 mb-2">천안 공장 야간 라인 가동</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        매출 +12.5%
                      </Badge>
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/50">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        비용 +8.2%
                      </Badge>
                    </div>
                  </Label>
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-colors ${
                  selectedOption === "option2" ? "bg-blue-500/20 border-blue-500" : "bg-zinc-800/50 border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="option2" id="option2" className="mt-1" />
                  <Label htmlFor="option2" className="cursor-pointer flex-1">
                    <div className="font-semibold text-sm mb-1">옵션 2: 재고 활용</div>
                    <p className="text-xs text-zinc-400 mb-2">베트남 공장 재고 전환 배송</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        매출 -1.7%
                      </Badge>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        비용 +3.5%
                      </Badge>
                    </div>
                  </Label>
                </div>
              </Card>
            </RadioGroup>
          </div>

          {/* 재무 영향 차트 */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              재무 영향 분석
            </h3>
            <Card className="bg-zinc-800/50 border-zinc-700 p-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#a1a1aa" style={{ fontSize: "10px" }} tickFormatter={(value) => `${value / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => `₩${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="비용" fill="#ef4444" />
                  <Bar dataKey="매출" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* 실행 버튼 */}
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleExecuteClick}>
            선택한 옵션 실행
          </Button>
        </div>
      </div>

      {/* Simulation Engine Dialog */}
      <SimulationEngineDialog
        open={showSimulation}
        onOpenChange={setShowSimulation}
        selectedOption={getOptionLabel()}
      />
    </>
  )
}
