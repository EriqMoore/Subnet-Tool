<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Subnet Analysis Tool - README</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      color: #333;
      max-width: 900px;
      margin: auto;
      padding: 40px;
    }
    h1, h2, h3 {
      color: #1e3a8a;
    }
    h1 {
      text-align: center;
    }
    pre {
      background: #f9fafb;
      padding: 15px;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
    }
    ul {
      margin-left: 20px;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Subnet Analysis Tool</h1>

  <h2>Overview</h2>
  <p>
    The Subnet Analysis Tool is a web-based IPv4 subnet calculator with an optional "Teaching Mode" 
    to help users understand subnetting concepts step by step. 
    It focuses on single-octet subnetting (/24–/30) and explains network, broadcast, and host address calculations.
  </p>

  <h2>Features</h2>
  <ul>
    <li>Calculate network, broadcast, first usable, last usable, and total usable hosts.</li>
    <li>Two selection modes: 
      <ul>
        <li><strong>Hosts Mode:</strong> Enter required usable hosts; the tool computes the smallest subnet.</li>
        <li><strong>Manual Mode:</strong> Enter a CIDR directly for the subnet.</li>
      </ul>
    </li>
    <li>Teaching Mode with detailed step-by-step explanations:</li>
      <ul>
        <li>CIDR selection logic</li>
        <li>IP to binary conversion</li>
        <li>Subnet mask application</li>
        <li>Block size and host count</li>
        <li>Subnet boundaries</li>
        <li>Optional gateway IP</li>
      </ul>
    <li>Highlights key calculations for easier learning.</li>
    <li>Responsive and visually clean layout using HTML, CSS, and vanilla JavaScript.</li>
  </ul>

  <h2>Files</h2>
  <ul>
    <li><code>index.html</code> – Main HTML page containing the form, output container, and footer.</li>
    <li><code>style.css</code> – Styles for layout, form, output, teaching steps, and highlights.</li>
    <li><code>script.js</code> – JavaScript for IP validation, subnet calculations, CIDR conversion, and teaching mode rendering.</li>
    <li><code>/img/network.png</code> – Optional illustration for the placeholder when no subnet is calculated.</li>
  </ul>

  <h2>Usage</h2>
  <ol>
    <li>Open <code>index.html</code> in a modern browser.</li>
    <li>Enter a valid IPv4 address.</li>
    <li>Select either "I need at least X usable hosts" or "I already know the CIDR".</li>
    <li>If using hosts mode, enter the number of required hosts.</li>
    <li>If using manual CIDR mode, enter the CIDR (between /24 and /30).</li>
    <li>Check "Enable Teaching Mode" to see step-by-step explanations.</li>
    <li>Click "Calculate Subnet" to view results.</li>
  </ol>

  <h2>Example</h2>
  <pre><code>IP Address: 192.168.10.1
Mode: Hosts
Required Hosts: 50
Teaching Mode: Enabled

Results:
Network Address: 192.168.10.0
First Usable: 192.168.10.1
Last Usable: 192.168.10.62
Broadcast Address: 192.168.10.63
Total Usable Hosts: 62
</code></pre>

  <h2>Technical Details</h2>
  <ul>
    <li>Subnet calculations are done in JavaScript using bitwise operations.</li>
    <li>Teaching Mode explains each calculation in detail and highlights key values.</li>
    <li>Supports only /24–/30 for single-octet subnet planning.</li>
    <li>Uses vanilla JavaScript — no frameworks required.</li>
  </ul>

  <h2>License</h2>
  <p>
    This project is open source and can be freely used and modified.
  </p>

  <h2>Author</h2>
  <p>
    Created by <strong>Eriq Moore</strong>.
  </p>

</body>
</html>
