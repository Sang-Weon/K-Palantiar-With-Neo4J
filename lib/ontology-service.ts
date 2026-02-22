import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    onSnapshot,
    Timestamp,
    serverTimestamp,
    writeBatch
} from "firebase/firestore";

export interface ObjectType {
    id: string;
    name: string;
    description: string;
    properties: Property[];
    source: "manual" | "ai-mapped";
    metadata?: Record<string, any>;
}

export interface Property {
    id: string;
    name: string;
    type: string;
    required: boolean;
}

export interface PropertyType {
    id: string;
    name: string;
    dataType: "string" | "number" | "boolean" | "date" | "json";
    description: string;
    validation?: string;
    defaultValue?: string;
    usedBy: string[];
    source: "manual" | "ai-mapped";
}

export interface LinkType {
    id: string;
    name: string;
    fromType: string;
    toType: string;
    bidirectional: boolean;
    neo4jType?: string;
}

export interface ActionType {
    id: string;
    name: string;
    description: string;
    targetSystems: string[];
    affectedModules: string[];
}

export interface WritebackAction {
    id?: string;
    actionTypeId: string;
    decision: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    logs: string[];
    results: any[];
    createdAt: any;
}

export const OntologyService = {
    // 객체 타입 조회
    async getObjectTypes(): Promise<ObjectType[]> {
        try {
            const querySnapshot = await getDocs(collection(db, "objectTypes"));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectType));
        } catch (e) {
            console.error("Error getting objects:", e);
            return [];
        }
    },

    // 속성 타입 조회
    async getPropertyTypes(): Promise<PropertyType[]> {
        const querySnapshot = await getDocs(collection(db, "propertyTypes"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PropertyType));
    },

    // 관계 타입 조회
    async getLinkTypes(): Promise<LinkType[]> {
        const querySnapshot = await getDocs(collection(db, "linkTypes"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkType));
    },

    // 실시간 구독
    subscribeToObjectTypes(callback: (types: ObjectType[]) => void) {
        return onSnapshot(collection(db, "objectTypes"), (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectType)));
        });
    },

    subscribeToPropertyTypes(callback: (types: PropertyType[]) => void) {
        return onSnapshot(collection(db, "propertyTypes"), (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PropertyType)));
        });
    },

    subscribeToLinkTypes(callback: (types: LinkType[]) => void) {
        return onSnapshot(collection(db, "linkTypes"), (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkType)));
        });
    },

    // 액션 처리
    async executeWriteback(actionData: Omit<WritebackAction, "id" | "createdAt">): Promise<string> {
        const docRef = await addDoc(collection(db, "writebackActions"), {
            ...actionData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async updateWritebackAction(actionId: string, updates: Partial<WritebackAction>): Promise<void> {
        const docRef = doc(db, "writebackActions", actionId);
        await updateDoc(docRef, updates);
    },

    subscribeToAction(actionId: string, callback: (action: WritebackAction) => void) {
        return onSnapshot(doc(db, "writebackActions", actionId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() } as WritebackAction);
            }
        });
    },

    // Neo4j 연동 시뮬레이션: 고도화된 Cypher 쿼리 생성기
    generateCypher(objectTypes: ObjectType[], linkTypes: LinkType[]): string {
        let cypher = "// [K-Palantir] AI Generated Cypher for Neo4j Digital Twin Ontology\n";
        cypher += "// Generated at: " + new Date().toLocaleString() + "\n\n";

        cypher += "// 1. Create Constraints\n";
        objectTypes.forEach(obj => {
            const label = (obj.metadata?.neo4j_label || obj.name).replace(/\s/g, '_');
            cypher += `CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE;\n`;
        });
        cypher += "\n";

        cypher += "// 2. Define Object Types (Nodes) with Properties\n";
        objectTypes.forEach(obj => {
            const label = (obj.metadata?.neo4j_label || obj.name).replace(/\s/g, '_');
            const props = obj.properties?.map(p => `${p.name}: ""`).join(", ") || "";
            cypher += `MERGE (t:OntologyType {name: "${obj.name}"})\n`;
            cypher += `SET t.description = "${obj.description}", t.source = "${obj.source}", t.neo4j_label = "${label}"\n`;
            cypher += `// Example Instance: MERGE (n:${label} {id: "placeholder_id", ${props}})\n`;
        });
        cypher += "\n";

        cypher += "// 3. Define Link Types (Relationships)\n";
        linkTypes.forEach(link => {
            const relType = link.name.toUpperCase().replace(/\s/g, '_');
            cypher += `// Relationship: ${link.fromType} -> ${link.toType}\n`;
            cypher += `MATCH (a:OntologyType {name: "${link.fromType}"}), (b:OntologyType {name: "${link.toType}"})\n`;
            cypher += `MERGE (a)-[r:${relType} {bidirectional: ${link.bidirectional}}]->(b);\n`;
        });

        return cypher;
    },

    // 드림텍 핸드폰 모듈 비즈니스 "복합 관계" 대량 시딩
    async seedInitialData() {
        console.log("Starting Atomic Batch Seed for Dreamtech Mobile Complex Graph...");

        try {
            // 1. 기존 데이터 모두 삭제 (Batch)
            const collections = ["objectTypes", "propertyTypes", "linkTypes", "simulationScenarios", "writebackActions"];
            const deleteBatch = writeBatch(db);

            for (const colName of collections) {
                const q = await getDocs(collection(db, colName));
                q.docs.forEach(doc => deleteBatch.delete(doc.ref));
            }
            await deleteBatch.commit();
            console.log("Existing data cleared.");

            // 2. 신규 데이터 생성 (Atomic Batch)
            const finalBatch = writeBatch(db);

            // --- 객체 정의 (Objects) ---
            const objects = [
                {
                    name: "Global_HQ", description: "드림텍 본사 (천안)", source: "ai-mapped",
                    properties: [{ id: "h1", name: "Location", type: "string", required: true }],
                    metadata: { neo4j_label: "HQ" }
                },
                {
                    name: "Vina_Subsidiary", description: "베트남 현지 법인 (Vina 1/2 공장 관리)", source: "ai-mapped",
                    properties: [{ id: "v1", name: "Region", type: "string", required: true }],
                    metadata: { neo4j_label: "Subsidiary" }
                },
                {
                    name: "SMT_Line", description: "표면실장 기술 라인 (PBA 제조)", source: "ai-mapped",
                    properties: [
                        { id: "sm1", name: "Utilization", type: "number", required: true },
                        { id: "sm2", name: "Efficiency", type: "number", required: true }
                    ],
                    metadata: { neo4j_label: "Line" }
                },
                {
                    name: "Assembly_Line", description: "모듈 최종 조립 라인", source: "ai-mapped",
                    properties: [{ id: "as1", name: "Yield_Rate", type: "number", required: true }],
                    metadata: { neo4j_label: "Line" }
                },
                {
                    name: "Inspection_AOI", description: "자동 광학 검사 장비", source: "ai-mapped",
                    properties: [{ id: "in1", name: "False_Call_Rate", type: "number", required: true }],
                    metadata: { neo4j_label: "Equipment" }
                },
                {
                    name: "IC_Chip", description: "지문인식 핵심 IC 소자", source: "ai-mapped",
                    properties: [{ id: "c1", name: "Stock_Level", type: "number", required: true }],
                    metadata: { neo4j_label: "Component" }
                },
                {
                    name: "FPCB_Board", description: "연성 회로 기판", source: "ai-mapped",
                    properties: [{ id: "f1", name: "Unit_Price", type: "number", required: true }],
                    metadata: { neo4j_label: "Component" }
                },
                {
                    name: "Sensor_Module", description: "반제품 상태의 센서 모듈", source: "ai-mapped",
                    properties: [{ id: "m1", name: "WIP_Count", type: "number", required: true }],
                    metadata: { neo4j_label: "Module" }
                },
                {
                    name: "Galaxy_S24_Module", description: "삼성전자 향 최종 완제품 모듈", source: "ai-mapped",
                    properties: [{ id: "fm1", name: "Quality_Grade", type: "string", required: true }],
                    metadata: { neo4j_label: "Product" }
                },
                {
                    name: "SEC_Factory", description: "삼성전자 스마트폰 조립 공장", source: "ai-mapped",
                    properties: [{ id: "sec1", name: "Delivery_Schedule", type: "string", required: true }],
                    metadata: { neo4j_label: "Customer" }
                }
            ];

            objects.forEach(obj => {
                const ref = doc(collection(db, "objectTypes"));
                finalBatch.set(ref, obj);
            });

            // --- 관계 정의 (Links) ---
            const links = [
                { name: "MANAGES", fromType: "Global_HQ", toType: "Vina_Subsidiary", bidirectional: true },
                { name: "OPERATES", fromType: "Vina_Subsidiary", toType: "SMT_Line", bidirectional: false },
                { name: "OPERATES", fromType: "Vina_Subsidiary", toType: "Assembly_Line", bidirectional: false },
                { name: "CONSUMES", fromType: "SMT_Line", toType: "IC_Chip", bidirectional: false },
                { name: "CONSUMES", fromType: "SMT_Line", toType: "FPCB_Board", bidirectional: false },
                { name: "PRODUCES", fromType: "SMT_Line", toType: "Sensor_Module", bidirectional: false },
                { name: "VERIFIES", fromType: "Inspection_AOI", toType: "Sensor_Module", bidirectional: false },
                { name: "FEEDS_INTO", fromType: "Sensor_Module", toType: "Assembly_Line", bidirectional: false },
                { name: "FINISHES", fromType: "Assembly_Line", toType: "Galaxy_S24_Module", bidirectional: false },
                { name: "SHIPS_TO", fromType: "Galaxy_S24_Module", toType: "SEC_Factory", bidirectional: false }
            ];

            links.forEach(link => {
                const ref = doc(collection(db, "linkTypes"));
                finalBatch.set(ref, link);
            });

            // --- 속성 정의 (Global Pool) ---
            const props = [
                { name: "Utilization", dataType: "number", description: "가동율", usedBy: ["SMT_Line"], source: "ai-mapped" },
                { name: "Yield_Rate", dataType: "number", description: "수율", usedBy: ["Assembly_Line"], source: "ai-mapped" },
                { name: "Stock_Level", dataType: "number", description: "재고수위", usedBy: ["IC_Chip"], source: "ai-mapped" },
                { name: "Unit_Price", dataType: "number", description: "단가", usedBy: ["FPCB_Board"], source: "ai-mapped" }
            ];

            props.forEach(prop => {
                const ref = doc(collection(db, "propertyTypes"));
                finalBatch.set(ref, prop);
            });

            await finalBatch.commit();
            console.log("Atomic Seeding Success. Multi-node graph created.");

        } catch (error) {
            console.error("Critical seeding error:", error);
            throw error;
        }
    }
};
