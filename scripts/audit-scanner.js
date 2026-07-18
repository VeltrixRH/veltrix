/**
 * Veltrix AI Contract Audit Scanner
 * Simulates static analysis for common smart contract vulnerabilities.
 */

const MOCK_SOLIDITY_CONTRACT = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Vulnerability 1: Reentrancy Risk
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        // External call before state variable change
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= _amount; 
    }

    // Vulnerability 2: Arithmetic danger in old versions
    // Vulnerability 3: Owner centralization shadow variable
    function transferOwnership(address owner) public {
        owner = owner; // Shadowing warning and logic bug
    }
}
`;

function performAudit(code) {
  console.log("==================================================");
  console.log("       VELTRIX AI SMART CONTRACT SCANNED          ");
  console.log("==================================================");
  console.log("Initializing Static AST Parser...");
  console.log("Auditing Contract Code...");

  const lines = code.split("\n");
  const vulnerabilities = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for reentrancy pattern (msg.sender.call before state updates)
    if (line.includes("msg.sender.call") && lines.slice(i + 1, i + 5).some(l => l.includes("balances[") && l.includes("-="))) {
      vulnerabilities.push({
        line: i + 1,
        vulnerability: "Reentrancy Vulnerability (External call preceding state update)",
        severity: "CRITICAL",
        description: "An external transfer is executed before internal balances are decremented. An attacker can hijack the control flow and call withdraw recursively.",
        recommendation: "Implement the Checks-Effects-Interactions pattern or use OpenZeppelin's ReentrancyGuard."
      });
    }

    // Check shadowing
    if (line.includes("transferOwnership(address owner)") || line.includes("owner = owner")) {
      vulnerabilities.push({
        line: i + 1,
        vulnerability: "Centralization Shadowing / Centralized Variable Override",
        severity: "WARNING",
        description: "Local parameter shadows state variable 'owner', preventing actual state changes.",
        recommendation: "Rename the local variable parameter to '_owner' or avoid reassigning parameters directly."
      });
    }
  }

  // Print results
  setTimeout(() => {
    console.log(`\nScan Complete. Found ${vulnerabilities.length} vulnerabilities.\n`);
    
    vulnerabilities.forEach((v, idx) => {
      console.log(`[Vulnerability #${idx + 1}] Line ${v.line}: [${v.severity}] ${v.vulnerability}`);
      console.log(`  Description: ${v.description}`);
      console.log(`  Recommendation: ${v.recommendation}\n`);
    });
    console.log("==================================================");
  }, 1000);
}

performAudit(MOCK_SOLIDITY_CONTRACT);
