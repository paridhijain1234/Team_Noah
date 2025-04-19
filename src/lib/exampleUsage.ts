import { orchestrateUserInput } from "./agents/orchestrator";
import { MasterAgent } from "./agents/masterAgent";
import { PlannerAgent } from "./agents/plannerAgent";

async function runExample() {
  console.log("===============================================");
  console.log("🚀 PADHAI-BUDDY EXAMPLE EXECUTION STARTING");
  console.log("===============================================");
  
  // Configuration section
  console.log("\n📝 CONFIGURATION");
  console.log("-----------------------------------------------");
  const apiKey = process.env.NEBIUS_API_KEY!;
  if (!apiKey) {
    console.error("⛔ ERROR: NEBIUS_API_KEY environment variable not set");
    process.exit(1);
  }
  console.log("✅ API Key loaded successfully");
  
  // Input section
  console.log("\n📥 USER INPUT");
  console.log("-----------------------------------------------");
  const userInput = `DC回路の理解
DC（直流）回路は、電流が一定方向に流れる電気回路です。電子の流れが周期的に反転するAC（交流）とは異なり、DCは安定した電流を維持するため、バッテリー、スマートフォン、電子回路などのデバイスに最適です。

基本的なDC回路では、電流はバッテリーやDC電源などの電源によって生成され、一定の電圧が供給されます。この電圧によって、電子は電源の負極端子から回路を通り、正極端子に戻ります。

DC回路の主な構成要素は次のとおりです。

電源：電圧を供給するもの（例：バッテリー）。

導体（電線）：電流が流れる経路。

負荷：電気エネルギーを使用する装置または部品（例：電球、抵抗器）。

スイッチ（オプション）：回路を開閉することで電流の流れを制御します。

DC回路解析で用いられる基本的な法則の一つにオームの法則があります。

𝑉
= 
𝐼
×
𝑅
V=I×R
ここで、

𝑉
Vは電圧（ボルト）、

𝐼
Iは電流（アンペア）、

𝑅
Rは抵抗（オーム）です。

DC回路は直列または並列に構成できます。

直列回路では、すべての部品が端から端まで接続されているため、電流が流れる経路は1つしかありません。すべての部品に流れる電流は同じですが、各部品の電圧はそれぞれ降下します。

並列回路では、すべての部品が同じ2点に接続されているため、電流の経路は複数あります。各分岐の電圧は同じですが、電流は各経路の抵抗に応じて分割されます。

キルヒホッフの法則も直流回路解析において重要な役割を果たします。

キルヒホッフの電流法則（KCL）：接合部に流入する電流の総和は、接合部から流出する電流の総和に等しくなります。

キルヒホッフの電圧法則（KVL）：閉ループの周りのすべての電圧の総和はゼロになります。

直流回路は、ほとんどの電子機器の動作を理解する上で不可欠です。直流回路の解析方法を学ぶことで、電気工学と電子工学のより深い概念の基礎を築くことができます。`;
  
  console.log(`Input length: ${userInput.length} characters`);
  console.log(`Input preview: ${userInput.substring(0, 100)}...`);
  
  // Planning section
  console.log("\n🧠 PLANNING PHASE");
  console.log("-----------------------------------------------");
  console.log("⏳ Generating pipeline plan via Master Agent...");
  const masterAgent = new MasterAgent(apiKey);
  const pipelinePlan = await masterAgent.generatePipelinePlan(userInput);
  console.log("✅ Pipeline plan generated");
  
  console.log("\n⏳ Creating detailed execution plan via Planner Agent...");
  const plannerAgent = new PlannerAgent(apiKey);
  const detailedPlan = await plannerAgent.planDetailedExecution(userInput);
  console.log("✅ Detailed execution plan created");
  
  // Display planning details
  console.log("\n📊 PLANNING DETAILS");
  console.log("-----------------------------------------------");
  console.log("📌 Pipeline Plan:");
  console.log(JSON.stringify(pipelinePlan, null, 2));
  
  console.log("\n📌 Detailed Execution Plan:");
  console.log(detailedPlan);
  
  // Execution section
  console.log("\n⚙️ EXECUTION PHASE");
  console.log("-----------------------------------------------");
  console.log("⏳ Orchestrating pipeline execution...");
  const startTime = Date.now();
  const { result, rationale } = await orchestrateUserInput(userInput, apiKey);
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Pipeline execution completed in ${executionTime} seconds`);
  
  // Results section
  console.log("\n📋 RESULTS");
  console.log("-----------------------------------------------");
  console.log("📌 Pipeline Execution Rationale:");
  console.log(rationale);
  
  console.log("\n📌 Final Output:");
  console.log(result);
  
  console.log("\n===============================================");
  console.log("✅ PADHAI-BUDDY EXAMPLE EXECUTION COMPLETED");
  console.log("===============================================");
}

// Ensure this file runs only if executed directly (not imported as a module)
if (require.main === module) {
  console.log("🔍 Running Padhai-Buddy example...");
  runExample()
    .catch(error => {
      console.error("❌ Error during execution:", error);
      process.exit(1);
    });
}
