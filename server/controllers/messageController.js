// Store server side event connections
const connections = {};

export const sseController = (req, res) => {
  const { userId } = req.params;
  console.log(`SSE connection established for user: ${userId}`);

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Add client response obj to connections obj
  connections[userId] = res;
  res.write("Connected to SSE stream\n\n");

  // Handle client disconnect
  req.on("close", () => {
    delete connections[userId];
    console.log(`SSE connection closed for user: ${userId}`);
  });
};
