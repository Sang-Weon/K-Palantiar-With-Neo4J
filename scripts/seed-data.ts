import { OntologyService } from "../lib/ontology-service";

async function main() {
    console.log("--- K-Palantir System Configuration & Seeding ---");

    try {
        console.log("1. Seeding initial data...");
        await OntologyService.seedInitialData();
        console.log("   Seed data injected successfully.");

        console.log("2. Verifying Object Types...");
        const types = await OntologyService.getObjectTypes();
        console.log(`   Found ${types.length} object types in Firestore.`);

        console.log("3. Verifying Property Types...");
        const props = await OntologyService.getPropertyTypes();
        console.log(`   Found ${props.length} property types in Firestore.`);

        console.log("4. Verifying Link Types...");
        const links = await OntologyService.getLinkTypes();
        console.log(`   Found ${links.length} link types in Firestore.`);

        console.log("\n[SUCCESS] 시스템 구성 및 데이터 동기화가 완료되었습니다.");
        process.exit(0);
    } catch (error) {
        console.error("\n[FAILURE] 시딩 중 오류 발생:", error);
        process.exit(1);
    }
}

main();
