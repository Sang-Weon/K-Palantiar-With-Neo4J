"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Activity } from "lucide-react"
import { useState, useEffect } from "react"
import { FactoryDetailDialog } from "./factory-detail-dialog"
import { useToast } from "@/hooks/use-toast"

export function GlobalMap() {
  const [selectedFactory, setSelectedFactory] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [factoryMetrics, setFactoryMetrics] = useState<Record<string, any>>({
    cheonan: { production: "98%", quality: "99.2%", delivery: "100%" },
    vietnam: { production: "62%", quality: "94.1%", delivery: "78%" },
    india: { production: "95%", quality: "97.8%", delivery: "99%" },
  })

  useEffect(() => {
    const handleQualityImpact = (event: CustomEvent) => {
      const { issueId, impact } = event.detail

      // Update factory metrics based on quality improvement
      setFactoryMetrics((prev) => ({
        ...prev,
        cheonan: {
          ...prev.cheonan,
          quality: `${impact.kpiImpact.yield.after.toFixed(1)}%`,
          production: `${impact.kpiImpact.productivity.after}%`,
        },
      }))

      // Show toast notification
      toast({
        title: "품질 개선 결과 반영",
        description: `품질 수율이 ${impact.kpiImpact.yield.before}%에서 ${impact.kpiImpact.yield.after}%로 개선되었습니다. 월간 ${(impact.financialImpact.profitImprovement / 100000000).toFixed(1)}억원의 영업이익 개선이 예상됩니다.`,
        duration: 5000,
      })
    }

    window.addEventListener("qualityImpactConfirmed", handleQualityImpact as EventListener)

    return () => {
      window.removeEventListener("qualityImpactConfirmed", handleQualityImpact as EventListener)
    }
  }, [toast])

  const nodes = [
    {
      id: "cheonan",
      name: "천안 공장",
      location: "대한민국",
      status: "normal",
      statusText: "정상 운영",
      metrics: factoryMetrics.cheonan,
      position: { top: "32%", left: "72%" }, // South Korea position
      products: ["디스플레이 패널", "반도체 부품", "카메라 모듈", "메인보드"],
      annualTarget: { revenue: 15000, units: 1200000 },
      annualActual: { revenue: 14200, units: 1150000 },
      kpis: [
        { name: "생산 효율", value: 98, target: 100, unit: "%" },
        { name: "품질 수율", value: 99.2, target: 99.5, unit: "%" },
        { name: "납기 준수율", value: 100, target: 100, unit: "%" },
        { name: "설비 가동률", value: 95, target: 97, unit: "%" },
      ],
      issues: [
        { id: "ch-1", title: "5호 라인 설비 정기 점검 필요", severity: "중간", date: "2026-01-20" },
        { id: "ch-2", title: "원자재 재고 하한선 근접", severity: "낮음", date: "2026-01-22" },
      ],
      actions: [
        {
          id: "act-ch-1",
          title: "5호 라인 점검 스케줄 조정",
          assignee: "김철수",
          dueDate: "2026-01-25",
          status: "진행중",
        },
        { id: "act-ch-2", title: "원자재 긴급 발주 승인", assignee: "이영희", dueDate: "2026-01-28", status: "완료" },
      ],
      economicIndicators: [
        { name: "철강 가격", value: "₩1,245/kg", change: 2.3 },
        { name: "전력 단가", value: "₩145/kWh", change: 1.5 },
        { name: "USD 환율", value: "₩1,325", change: -0.8 },
        { name: "물류비", value: "₩28,500/톤", change: 3.2 },
      ],
      relationships: [
        { factory: "베트남 공장", type: "공급", description: "디스플레이 패널 및 메인보드를 주 2회 공급" },
        { factory: "인도 공장", type: "기술지원", description: "생산 공정 최적화 및 품질 관리 기술 지원" },
      ],
    },
    {
      id: "vietnam",
      name: "베트남 공장",
      location: "베트남 호치민",
      status: "critical",
      statusText: "부품 부족 경고",
      metrics: factoryMetrics.vietnam,
      position: { top: "52%", left: "58%" }, // Ho Chi Minh City, Vietnam (center of map)
      products: ["완제품 조립", "패키징", "QC 검사", "출하"],
      annualTarget: { revenue: 8500, units: 2400000 },
      annualActual: { revenue: 7100, units: 1950000 },
      kpis: [
        { name: "생산 효율", value: 62, target: 100, unit: "%" },
        { name: "품질 수율", value: 94.1, target: 99.0, unit: "%" },
        { name: "납기 준수율", value: 78, target: 100, unit: "%" },
        { name: "설비 가동률", value: 65, target: 97, unit: "%" },
      ],
      issues: [
        { id: "vn-1", title: "천안 공장 부품 공급 지연", severity: "높음", date: "2026-01-18" },
        { id: "vn-2", title: "조립 라인 2호 설비 고장", severity: "높음", date: "2026-01-19" },
        { id: "vn-3", title: "품질 불량률 증가 추세", severity: "중간", date: "2026-01-20" },
      ],
      actions: [
        {
          id: "act-vn-1",
          title: "긴급 부품 항공 운송 추진",
          assignee: "Nguyen Van",
          dueDate: "2026-01-22",
          status: "진행중",
        },
        {
          id: "act-vn-2",
          title: "2호 라인 설비 긴급 수리",
          assignee: "Tran Minh",
          dueDate: "2026-01-25",
          status: "진행중",
        },
        { id: "act-vn-3", title: "품질 개선 TF 구성", assignee: "Le Thi", dueDate: "2026-01-28", status: "대기" },
      ],
      economicIndicators: [
        { name: "인건비", value: "₩185,000/월", change: 5.2 },
        { name: "전력 단가", value: "₩98/kWh", change: 2.1 },
        { name: "VND 환율", value: "₩0.056", change: -1.2 },
        { name: "항공 물류비", value: "₩4,500/kg", change: 8.5 },
      ],
      relationships: [
        { factory: "천안 공장", type: "공급받음", description: "천안에서 주요 부품 공급 (현재 지연 중)" },
        { factory: "인도 공장", type: "협력", description: "품질 관리 노하우 공유 및 공동 개선 활동" },
      ],
    },
    {
      id: "india",
      name: "인도 공장",
      location: "인도 뉴델리",
      status: "normal",
      statusText: "정상 운영",
      metrics: factoryMetrics.india,
      position: { top: "45%", left: "38%" }, // New Delhi, India position
      products: ["하우징 부품", "배터리 모듈", "케이블 어셈블리", "소형 부품"],
      annualTarget: { revenue: 6200, units: 3800000 },
      annualActual: { revenue: 6450, units: 3950000 },
      kpis: [
        { name: "생산 효율", value: 95, target: 100, unit: "%" },
        { name: "품질 수율", value: 97.8, target: 99.0, unit: "%" },
        { name: "납기 준수율", value: 99, target: 100, unit: "%" },
        { name: "설비 가동률", value: 96, target: 97, unit: "%" },
      ],
      issues: [
        { id: "in-1", title: "전력 공급 불안정 우려", severity: "중간", date: "2026-01-19" },
        { id: "in-2", title: "신규 인력 교육 프로그램 필요", severity: "낮음", date: "2026-01-20" },
      ],
      actions: [
        {
          id: "act-in-1",
          title: "자가발전 설비 증설 검토",
          assignee: "Kumar Singh",
          dueDate: "2026-02-05",
          status: "진행중",
        },
        {
          id: "act-in-2",
          title: "Q1 신규 채용 교육 프로그램 개발",
          assignee: "Priya Sharma",
          dueDate: "2026-02-10",
          status: "대기",
        },
      ],
      economicIndicators: [
        { name: "플라스틱 원료", value: "₩2,850/kg", change: -1.5 },
        { name: "전력 단가", value: "₩112/kWh", change: 4.8 },
        { name: "INR 환율", value: "₩16.2", change: 0.5 },
        { name: "해상 물류비", value: "₩850/CBM", change: -2.1 },
      ],
      relationships: [
        { factory: "천안 공장", type: "기술지원받음", description: "생산 공정 개선 및 품질 기술 이전" },
        { factory: "베트남 공장", type: "협력", description: "품질 개선 우수 사례 공유 및 벤치마킹" },
      ],
    },
  ]

  const handleFactoryClick = (node: any) => {
    setSelectedFactory(node)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* 맵 컨테이너 */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/southeast-asia-centered-world-map-dark.jpg"
            alt="World Map"
            className="w-full h-full object-cover opacity-30"
            style={{ objectPosition: "center center" }}
          />
          {/* 그리드 오버레이 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>

        {/* 글로벌 타이틀 */}
        <div className="relative z-10 mb-4">
          <h2 className="text-lg lg:text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            글로벌 실행 맵
          </h2>
          <p className="text-xs text-zinc-500 mt-1">공장을 클릭하면 상세 경영 정보를 확인할 수 있습니다</p>
        </div>

        {/* 노드들 */}
        <div className="relative w-full h-full">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                top: node.position.top,
                left: node.position.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`relative group cursor-pointer ${node.status === "critical" ? "animate-pulse" : ""}`}
                onClick={() => handleFactoryClick(node)}
              >
                {/* 외곽 링 */}
                <div
                  className={`absolute inset-0 rounded-full ${
                    node.status === "critical"
                      ? "bg-red-500/20 ring-2 ring-red-500"
                      : "bg-green-500/20 ring-2 ring-green-500"
                  } w-12 h-12 lg:w-16 lg:h-16 group-hover:scale-110 transition-transform`}
                />

                {/* 중심 아이콘 */}
                <div
                  className={`relative flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-full ${
                    node.status === "critical" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {node.status === "critical" ? (
                    <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  )}
                </div>

                {/* 툴팁 카드 */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 lg:w-56 z-20">
                  <Card className="bg-zinc-800 border-zinc-700 p-3 shadow-xl">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm">{node.name}</h3>
                        <p className="text-xs text-zinc-400">{node.location}</p>
                      </div>
                      <Badge variant={node.status === "critical" ? "destructive" : "default"} className="text-xs">
                        {node.statusText}
                      </Badge>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">생산율:</span>
                          <span className="font-mono">{node.metrics.production}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">품질:</span>
                          <span className="font-mono">{node.metrics.quality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">배송:</span>
                          <span className="font-mono">{node.metrics.delivery}</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-400 text-center pt-2 border-t border-zinc-700">
                        클릭하여 상세 정보 보기
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* 노드 라벨 */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-xs lg:text-sm font-medium">{node.name}</p>
              </div>
            </div>
          ))}

          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
            {/* 천안 -> 베트남 */}
            <line
              x1="72%"
              y1="32%"
              x2="58%"
              y2="52%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.4"
            />
            {/* 천안 -> 인도 */}
            <line
              x1="72%"
              y1="32%"
              x2="38%"
              y2="45%"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.4"
            />
            {/* 베트남 -> 인도 */}
            <line
              x1="58%"
              y1="52%"
              x2="38%"
              y2="45%"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          </svg>
        </div>
      </Card>

      {/* 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <Card
            key={node.id}
            className="bg-zinc-900 border-zinc-800 p-4 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => handleFactoryClick(node)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{node.name}</h3>
                <p className="text-xs text-zinc-400">{node.location}</p>
              </div>
              {node.status === "critical" ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">생산율</span>
                <span className="font-mono">{node.metrics.production}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">품질</span>
                <span className="font-mono">{node.metrics.quality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">배송</span>
                <span className="font-mono">{node.metrics.delivery}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedFactory && (
        <FactoryDetailDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} factory={selectedFactory} />
      )}
    </div>
  )
}
