import { createMiddleware } from "langchain";
import { ToolMessage } from "@langchain/core/messages";

const isEmpty = (c: unknown) =>
  c == null ||
  (typeof c === "string" && c.trim() === "") ||
  (Array.isArray(c) && c.length === 0);

export const nonEmptyToolResult = createMiddleware({
  name: "NonEmptyToolResult",
  wrapToolCall: async (request, handler) => {
    const result = await handler(request);
    if (ToolMessage.isInstance(result) && isEmpty(result.content)) {
      console.log("Empty tool result patched:", result.name);   // confirms it runs
      return new ToolMessage({
        content: `The tool "${result.name}" returned no results (empty list).`,
        tool_call_id: result.tool_call_id,
        name: result.name,
        status: result.status,
      });
    }
    return result;
  },
});