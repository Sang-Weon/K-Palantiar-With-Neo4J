import neo4j, { Driver } from "neo4j-driver";

export interface Neo4jConfig {
    uri: string;
    user: string;
    pass: string;
}

let driver: Driver | null = null;

export const Neo4jService = {
    // Neo4j 연결 초기화
    async connect(config: Neo4jConfig): Promise<boolean> {
        try {
            if (driver) {
                await driver.close();
            }
            driver = neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.pass));
            await driver.getServerInfo(); // 연결 확인
            console.log("Connected to Neo4j successfully");
            return true;
        } catch (error) {
            console.error("Failed to connect to Neo4j:", error);
            driver = null;
            throw error;
        }
    },

    // Cypher 쿼리 실행
    async runQuery(cypher: string): Promise<any> {
        if (!driver) {
            throw new Error("Neo4j driver is not initialized. Please connect first.");
        }

        const session = driver.session();
        try {
            // 여러 줄의 쿼리를 개별적으로 실행 (CREATE CONSTRAINT 등은 단독 실행 필요할 수 있음)
            const queries = cypher.split(';').filter(q => q.trim() !== "");
            let lastResult = null;

            for (const query of queries) {
                const result = await session.run(query);
                lastResult = result;
            }

            return lastResult;
        } catch (error) {
            console.error("Error executing Cypher:", error);
            throw error;
        } finally {
            await session.close();
        }
    },

    async disconnect() {
        if (driver) {
            await driver.close();
            driver = null;
        }
    }
};
