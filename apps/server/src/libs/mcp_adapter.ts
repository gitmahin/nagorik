import { MCPAdapter } from "@langchain/mcp-adapters";

export async function createMCPAdapter() {
 try {
       const adapter = new MCPAdapter({
           servers: {
               docs: { url: "http://localhost:8000/mcp" },
           },
            prefixToolNameWithServerName: false,
  additionalToolNamePrefix: "",
       });
       
       return await adapter.listTools();
 } catch (error) {
    console.log("MCP unavailable, continuing without MCP tools");
    return []
 }
}


// import { MCPAdapter } from "@langchain/mcp-adapters";

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// let tools: any[] = [];
// let connecting = false;

// async function connectOnce(): Promise<any[]> {
//   let failed = false;

//   const adapter = new MCPAdapter({
//     servers: { chatnagorikmcp: { url: "http://127.0.0.1:8000/mcp" } },
//     onConnectionError: (error) => {
//       failed = true;
//       console.error("MCP connection error:", (error as any)?.error?.message ?? error);
//     },
//   });

//   const result = await adapter.listTools();
//   if (failed || result.length === 0) {
//     throw new Error("MCP connection failed or returned no tools");
//   }
//   return result;
// }

// export async function connectMcpWithRetry(maxAttempts = 10, baseDelayMs = 1000) {
//   if (connecting) return;
//   connecting = true;
//   try {
//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         tools = await connectOnce();
//         console.log(`MCP connected, ${tools.length} tools`);
//         return;
//       } catch {
//         console.log(`MCP attempt ${attempt}/${maxAttempts} failed`);
//         if (attempt < maxAttempts) {
//           await sleep(Math.min(baseDelayMs * 2 ** (attempt - 1), 30_000));
//         }
//       }
//     }
//     console.log("MCP unavailable, continuing without MCP tools");
//   } finally {
//     connecting = false;
//   }
// }

// export const getMcpTools = () => tools;

// void connectMcpWithRetry();