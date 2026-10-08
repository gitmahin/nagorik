import { MCPAdapter } from "@langchain/mcp-adapters";

const adapter = new MCPAdapter({
  servers: {
    docs: { url: "http://localhost:8000/mcp" },
  },
});

export const mcp_tools = await adapter.listTools();
