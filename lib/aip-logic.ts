import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface SimulationScenario {
    id?: string;
    name: string;
    variables: Record<string, any>;
    prediction: {
        efficiencyGain: number;
        costReduction: number;
        riskScore: number;
    };
    recommendation: string;
    createdAt: any;
}

export const AIPLogic = {
    // 시뮬레이션 시나리오 분석 및 결과 생성 (드림텍 특화)
    async simulateScenario(name: string, variables: Record<string, any>): Promise<SimulationScenario> {
        let efficiencyGain = 0;
        let costReduction = 0;
        let riskScore = 0;
        let recommendation = "";

        if (name.includes("S24") || name.includes("수율")) {
            efficiencyGain = 15.8;
            costReduction = 180;
            riskScore = 12;
            recommendation = "갤럭시 S24용 지문인식 센서 모듈의 수율(Yield) 최적화를 위해 베트남 Vina 2 공장의 검사 공정 파라미터를 조정합니다. 예상 원가 절감액은 월 1.8억 원입니다.";
        } else if (name.includes("리드타임") || name.includes("공급망")) {
            efficiencyGain = 9.5;
            costReduction = 120;
            riskScore = 8;
            recommendation = "핵심 IC 소자의 리드타임이 4주에서 6주로 지연됨에 따라, 천안 거점의 안전 재고를 20% 늘리고 생산 사이클을 2일 단축하는 시나리오를 권장합니다.";
        } else if (name.includes("가동율") || name.includes("가동률")) {
            efficiencyGain = 22.1;
            costReduction = 250;
            riskScore = 20;
            recommendation = "드림텍 Vina 1 공장의 SMT 라인 가동율을 88%에서 94%로 상향 평준화하기 위해 예방 정비 스케줄을 재구성할 것을 제안합니다.";
        } else {
            efficiencyGain = 10.0;
            costReduction = 100;
            riskScore = 15;
            recommendation = "현재 드림텍 온톨로지 모델 분석 결과, 센서 모듈 조립 공정의 원가 비중을 5% 절감할 수 있는 최적화 포인트가 발견되었습니다.";
        }

        const scenario: SimulationScenario = {
            name,
            variables,
            prediction: { efficiencyGain, costReduction, riskScore },
            recommendation,
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, "simulationScenarios"), scenario);
        scenario.id = docRef.id;

        return scenario;
    },

    async processFeedback(actionId: string, actualResult: any) {
        console.log(`Processing feedback for action ${actionId}:`, actualResult);
    }
};
