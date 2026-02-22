"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Settings2, TrendingUp, Clock, Package, Cpu } from "lucide-react"
import { SimulationResultDialog } from "@/components/simulation-result-dialog"

interface ScenarioConfig {
  demandVolume: number
  dueDate: string
  facilityUtilization: number
  inventoryLevel: number
  maxOvertime: number
  outsourcingAllowed: boolean
}

export function SimulationScenarioBuilder() {
  const [config, setConfig] = useState<ScenarioConfig>({
    demandVolume: 5000,
    dueDate: "2026-02-15",
    facilityUtilization: 85,
    inventoryLevel: 30,
    maxOvertime: 20,
    outsourcingAllowed: true,
  })
  const [showResults, setShowResults] = useState(false)

  const handleRunSimulation = () => {
    setShowResults(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-400" />
              생산 시뮬레이션 엔진
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Palantir 방식의 시나리오 최적화</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRunSimulation}>
            <Play className="w-4 h-4 mr-2" />
            시뮬레이션 실행
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 시나리오 빌더 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 수요 설정 */}
            <Card className="bg-zinc-900/50 border-zinc-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-400" />
                수요 파라미터
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>수요 수량</Label>
                    <Input
                      type="number"
                      value={config.demandVolume}
                      onChange={(e) => setConfig({ ...config, demandVolume: Number.parseInt(e.target.value) })}
                      className="mt-2 bg-zinc-800 border-zinc-700"
                    />
                    <p className="text-xs text-zinc-400 mt-1">생산해야 할 총 수량</p>
                  </div>
                  <div>
                    <Label>납기일</Label>
                    <Input
                      type="date"
                      value={config.dueDate}
                      onChange={(e) => setConfig({ ...config, dueDate: e.target.value })}
                      className="mt-2 bg-zinc-800 border-zinc-700"
                    />
                    <p className="text-xs text-zinc-400 mt-1">요구 납품 마감일</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 생산 제약조건 */}
            <Card className="bg-zinc-900/50 border-zinc-800 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-400" />
                생산 제약조건
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>설비 가동률 목표 (%)</Label>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50">
                      {config.facilityUtilization}%
                    </Badge>
                  </div>
                  <Slider
                    value={[config.facilityUtilization]}
                    onValueChange={(value) => setConfig({ ...config, facilityUtilization: value[0] })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-zinc-400 mt-1">설비의 최대 활용률</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>재고 수준 (%)</Label>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/50">
                      {config.inventoryLevel}%
                    </Badge>
                  </div>
                  <Slider
                    value={[config.inventoryLevel]}
                    onValueChange={(value) => setConfig({ ...config, inventoryLevel: value[0] })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-zinc-400 mt-1">현재 재고 활용 가능 비율</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>최대 잔업 시간 (%)</Label>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50">
                      {config.maxOvertime}%
                    </Badge>
                  </div>
                  <Slider
                    value={[config.maxOvertime]}
                    onValueChange={(value) => setConfig({ ...config, maxOvertime: value[0] })}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-zinc-400 mt-1">정규 근무 대비 추가 가능 잔업</p>
                </div>

                <div>
                  <Label>외주 허용 여부</Label>
                  <Select
                    value={config.outsourcingAllowed ? "yes" : "no"}
                    onValueChange={(value) => setConfig({ ...config, outsourcingAllowed: value === "yes" })}
                  >
                    <SelectTrigger className="mt-2 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="yes">허용</SelectItem>
                      <SelectItem value="no">불허</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-400 mt-1">생산 능력 부족 시 외주 사용 가능 여부</p>
                </div>
              </div>
            </Card>

            {/* 시나리오 템플릿 */}
            <Card className="bg-zinc-900/50 border-zinc-800 p-6">
              <h3 className="text-lg font-semibold mb-4">빠른 시나리오 템플릿</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-800"
                  onClick={() =>
                    setConfig({
                      demandVolume: 5000,
                      dueDate: "2026-02-15",
                      facilityUtilization: 85,
                      inventoryLevel: 30,
                      maxOvertime: 20,
                      outsourcingAllowed: true,
                    })
                  }
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">표준 생산</div>
                    <div className="text-xs text-zinc-400 mt-1">균형잡힌 설정</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-800"
                  onClick={() =>
                    setConfig({
                      demandVolume: 8000,
                      dueDate: "2026-02-05",
                      facilityUtilization: 95,
                      inventoryLevel: 15,
                      maxOvertime: 40,
                      outsourcingAllowed: true,
                    })
                  }
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">긴급 주문</div>
                    <div className="text-xs text-zinc-400 mt-1">최대 가동</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-800"
                  onClick={() =>
                    setConfig({
                      demandVolume: 3000,
                      dueDate: "2026-02-28",
                      facilityUtilization: 70,
                      inventoryLevel: 50,
                      maxOvertime: 10,
                      outsourcingAllowed: false,
                    })
                  }
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">비용 최적화</div>
                    <div className="text-xs text-zinc-400 mt-1">재고 활용</div>
                  </div>
                </Button>
              </div>
            </Card>
          </div>

          {/* 우측: 시나리오 개요 */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 p-6">
              <h3 className="text-lg font-semibold mb-4">시나리오 개요</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                  <div className="text-xs text-zinc-400 mb-1">목표 생산량</div>
                  <div className="text-2xl font-bold text-green-400">{config.demandVolume.toLocaleString()}</div>
                  <div className="text-xs text-zinc-400 mt-1">개</div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                  <div className="text-xs text-zinc-400 mb-1">납기일까지</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.ceil((new Date(config.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">일</div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                  <div className="text-xs text-zinc-400 mb-1">설비 가동률</div>
                  <div className="text-2xl font-bold text-purple-400">{config.facilityUtilization}%</div>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                  <div className="text-xs text-zinc-400 mb-1">외주 허용</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {config.outsourcingAllowed ? "예" : "아니오"}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-400 mb-1">AI 최적화</div>
                  <p className="text-zinc-300">
                    시뮬레이션 실행 시 AI가 3가지 최적화 방안을 자동 생성하여 비용, 시간, 품질을 종합 분석합니다.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/30 p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-purple-400 mb-1">예상 소요 시간</div>
                  <p className="text-zinc-300">시뮬레이션 실행에는 약 30-45초가 소요됩니다.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Simulation Result Dialog */}
      <SimulationResultDialog open={showResults} onOpenChange={setShowResults} config={config} />
    </>
  )
}
