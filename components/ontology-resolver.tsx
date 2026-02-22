"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Database } from "lucide-react"

interface OntologyResolverProps {
  onConfirm: () => void
  isConfirmed: boolean
}

export function OntologyResolver({ onConfirm, isConfirmed }: OntologyResolverProps) {
  const [sapData, setSapData] = useState<any | null>(null)
  const [ontologyData, setOntologyData] = useState<any | null>(null)

  // Fetch mock ontology data from the backend
  useEffect(() => {
    let mounted = true
    fetch("http://localhost:8000/api/ontology")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        setSapData(data.sapData ?? null)
        setOntologyData(data.ontologyData ?? null)
      })
      .catch((err) => {
        console.error("Failed to load ontology data:", err)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg lg:text-xl font-semibold">AI 온톨로지 리졸버</h2>
        {isConfirmed && (
          <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            매핑 확인됨
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 좌측: Raw SAP 데이터 */}
        <Card className="bg-zinc-900 border-zinc-800 p-4 lg:p-6">
          <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase tracking-wide">Raw SAP 데이터</h3>
          <div className="space-y-2 font-mono text-xs lg:text-sm">
            {sapData ? (
              Object.entries(sapData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 p-2 bg-zinc-800/50 rounded"
                >
                  <span className="text-zinc-400">{key}:</span>
                  <span className="text-amber-400 break-all">"{String(value)}"</span>
                </div>
              ))
            ) : (
              <div className="p-2 text-zinc-400">로딩 중...</div>
            )}
          </div>
        </Card>

        {/* 우측: AI 정제 온톨로지 */}
        <Card className="bg-zinc-900 border-zinc-800 p-4 lg:p-6">
          <h3 className="text-sm font-semibold mb-4 text-purple-400 uppercase tracking-wide">AI 정제 온톨로지 객체</h3>
          <div className="space-y-3 text-xs lg:text-sm">
            {ontologyData ? (
              <>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-400 block mb-1">주문 ID</span>
                  <span className="font-mono text-purple-300">{ontologyData.order_id}</span>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-400 block mb-1">제품</span>
                  <div className="ml-2 space-y-1">
                    <div>
                      <span className="text-zinc-500">이름:</span>{" "}
                      <span className="text-purple-300">{ontologyData.product?.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">카테고리:</span>{" "}
                      <span className="text-purple-300">{ontologyData.product?.category}</span>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-400 block mb-1">수요 수량</span>
                  <span className="font-mono text-purple-300">{Number(ontologyData.demand_quantity).toLocaleString()} 개</span>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-400 block mb-1">목적지</span>
                  <span className="text-purple-300">{ontologyData.destination?.plant}</span>
                </div>
              </>
            ) : (
              <div className="p-2 text-zinc-400">로딩 중...</div>
            )}
          </div>
        </Card>
      </div>

      {/* 매핑 확인 버튼 */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onConfirm}
          disabled={isConfirmed}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isConfirmed ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              매핑 확인 완료
            </>
          ) : (
            <>
              매핑 확인
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
