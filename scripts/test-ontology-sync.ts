import { OntologyService } from "../lib/ontology-service";

async function main() {
    console.log("--- Ontology Service Verification ---");

    try {
        console.log("1. Fetching Object Types...");
        const types = await OntologyService.getObjectTypes();
        console.log(`   Found ${types.length} object types.`);

        console.log("2. Testing Write-back Execution...");
        const actionId = await OntologyService.executeWriteback({
            actionTypeId: "verification-test",
            decision: "Test decision for verification",
            status: "pending",
            progress: 0,
            logs: ["Test log from verification script"],
            results: []
        });
        console.log(`   Successfully created action with ID: ${actionId}`);

        console.log("Verification Successful!");
        process.exit(0);
    } catch (error) {
        console.error("Verification Failed:", error);
        process.exit(1);
    }
}

main();
