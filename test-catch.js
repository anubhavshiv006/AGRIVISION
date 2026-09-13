async function run() {
  // Simulate res.json() throwing a SyntaxError
  const res = {
    ok: false,
    json: async () => { throw new SyntaxError("Unexpected token '<', \"<!doctype \"... is not valid JSON"); }
  };
  
  try {
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to analyze image');
    }
  } catch (err) {
    console.log("CAUGHT MESSAGE:", err.message);
  }
}
run();
