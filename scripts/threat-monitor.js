/**
 * Veltrix Threat Shield Transaction Monitor
 * Simulates real-time mempool transaction sniffing and automated blocking logic.
 */

const BLOCKED_ADDRESSES = [
  "0x00000000000039bc00000000000000000000dEaD", // Simulated phishing deployment address
  "0x3f5CE0Daa8a8e3f5CE0Daa8a8e3f5CE0Daa8a8e"   // Known liquidity drainer account
];

const SIMULATED_TXS = [
  { hash: "0xa2f190e84b8cf6b483", sender: "0xUserA", to: "0xTokenVault", value: "1.2 ETH", data: "0xa9059cbb00000000" },
  { hash: "0xb7c81d2f9a1c7e9902", sender: "0xAttacker", to: "0x00000000000039bc00000000000000000000dEaD", value: "0 ETH", data: "0x" },
  { hash: "0xc8d1fa92a83f982cf6", sender: "0xUserB", to: "0xUniswapV3Pool", value: "0.5 ETH", data: "0x" },
  { hash: "0xd90ea81f9b3cf681da", sender: "0xDrainer", to: "0x3f5CE0Daa8a8e3f5CE0Daa8a8e3f5CE0Daa8a8e", value: "10.0 ETH", data: "0x7769746864726177" }
];

console.log("==================================================");
console.log("     VELTRIX FIREWALL NETWORK MONITOR ACTIVE      ");
console.log("  RPC: Robinhood EVM Custom Port 2009            ");
console.log("==================================================");
console.log("Subscribing to WebSocket pool alerts...");

let txIndex = 0;

const interval = setInterval(() => {
  if (txIndex >= SIMULATED_TXS.length) {
    console.log("\nSimulated mempool stream finished. Firewall secure.");
    clearInterval(interval);
    return;
  }

  const tx = SIMULATED_TXS[txIndex];
  console.log(`\n[Incoming Tx] Hash: ${tx.hash}... From: ${tx.sender}`);

  const isBlockedAddress = BLOCKED_ADDRESSES.includes(tx.to);
  const isSuspiciousPayload = tx.data.includes("0x7769746864726177"); // simulated exploit data hex

  if (isBlockedAddress || isSuspiciousPayload) {
    console.log(`[ALERT - FIREWALL BLOCKED] Severity: CRITICAL`);
    console.log(`  Reason: ${isBlockedAddress ? "Transaction target is a blacklisted phishing address." : "Malicious reentrancy data signature detected."}`);
    console.log(`  Action: Transaction discarded. Senders address flagged for inspection.`);
  } else {
    console.log(`[PASS] Transaction safe. Propagating to validator nodes...`);
  }

  txIndex++;
}, 1500);
