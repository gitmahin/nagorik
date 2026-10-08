import { MCPAdapter } from "@langchain/mcp-adapters";

export async function createMCPAdapter() {
 try {
       const adapter = new MCPAdapter({
           servers: {
               docs: { url: "http://localhost:8000/mcp" },
           },
       });
       
       return await adapter.listTools();
 } catch (error) {
    console.log("MCP unavailable, continuing without MCP tools");
    return []
 }
}
