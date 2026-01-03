/* ================================
   Subnet Mask Map
================================ */
const subnetMasks = {
  24: "255.255.255.0",
  25: "255.255.255.128",
  26: "255.255.255.192",
  27: "255.255.255.224",
  28: "255.255.255.240",
  29: "255.255.255.248",
  30: "255.255.255.252"
};

/* ================================
   Utility Functions
================================ */
function ipToArray(ip) {
  return ip.split(".").map(Number);
}

function toBinary(octet) {
  return octet.toString(2).padStart(8, "0");
}

/* ================================
   Subnet Calculation
================================ */
function calculateSubnet(ipArray, cidr) {
  const maskArray = ipToArray(subnetMasks[cidr]);
  const network = ipArray.map((octet, i) => octet & maskArray[i]);

  const hostBits = 32 - cidr;
  const blockSize = Math.pow(2, hostBits);

  const broadcast = [...network];
  broadcast[3] += blockSize - 1;

  const firstHost = [...network];
  firstHost[3] += 1;

  const lastHost = [...broadcast];
  lastHost[3] -= 1;

  return {
    network,
    broadcast,
    firstHost,
    lastHost,
    totalHosts: blockSize - 2
  };
}

/* ================================
   Convert Hosts → CIDR
================================ */
function cidrFromHosts(requiredHosts) {
  if (requiredHosts > 254) return null;
  for (let hostBits = 1; hostBits <= 8; hostBits++) {
    const usableHosts = Math.pow(2, hostBits) - 2;
    if (usableHosts >= requiredHosts) return 32 - hostBits;
  }
  return null;
}

/* ================================
   CIDR Mode Dropdown Toggle
================================ */
const cidrModeSelect = document.getElementById("cidrMode");
const cidrLabel = document.getElementById("cidrInputLabel");
const hostLabel = document.getElementById("hostInputLabel");

function toggleCidrInputs() {
  if (cidrModeSelect.value === "manual") {
    cidrLabel.style.display = "block";
    hostLabel.style.display = "none";
  } else {
    cidrLabel.style.display = "none";
    hostLabel.style.display = "block";
  }
}
toggleCidrInputs();
cidrModeSelect.addEventListener("change", toggleCidrInputs);

/* ================================
   Teaching Mode Renderer
================================ */
function renderTeaching(ipArray, cidr, mode, requiredHosts) {
  let html = '';

  // Step 0: CIDR Selection Logic
  if (mode === 'hosts') html += `
    <div class="step-card step-teaching-white">
      <div class="step-label">CIDR Selection Logic</div>
      <div class="step-value highlight-line">
        You requested at least <strong>${requiredHosts}</strong> usable hosts.<br>
        Based on this requirement, the tool calculates the smallest subnet that can accommodate all hosts.
        This ensures no IP addresses are wasted and subnetting is efficient. In this case, the appropriate subnet is <strong>/${cidr}</strong>.
      </div>
    </div>
  `;

  // Step 1: Convert IP to Binary (keep gradient)
  html += `
    <div class="step-card">
      <div class="step-label">Step 1: Convert IP to Binary</div>
      <div class="step-value">
        Each octet of the IP address is converted into an 8-bit binary format.
        This is essential because subnetting calculations are done in binary. Binary representation helps us visualize which bits are used for the network and which for hosts.
      </div>
  `;
  ipArray.forEach((octet,i) => {
    html += `<div class="binary highlight-line">Octet ${i+1}: ${octet} → ${toBinary(octet)}</div>`;
  });
  html += `</div>`;

  const maskArray = ipToArray(subnetMasks[cidr]);
  const blockSize = 256 - maskArray[3];
  const totalUsableHosts = Math.pow(2, 32 - cidr) - 2;

  // Step 2: Apply Subnet Mask (white bg)
  html += `
    <div class="step-card step-teaching-white">
      <div class="step-label">Step 2: Apply Subnet Mask</div>
      <div class="step-value">
        The CIDR /${cidr} corresponds to the subnet mask ${subnetMasks[cidr]}.
        Applying the subnet mask to the IP address separates the network portion from the host portion.
        This helps define the boundaries of the subnet, allowing accurate identification of network, broadcast, and usable host addresses.
      </div>
    </div>
  `;

  // Step 3: Block Size and Host Count (white bg, full explanation)
  html += `
    <div class="step-card step-teaching-white">
      <div class="step-label">Step 3: Block Size and Host Count</div>
      <div class="step-value">
        <div class="highlight-line">
          Block size is calculated as 256 minus the last octet of the subnet mask: 256 - ${maskArray[3]} = ${blockSize}.
          This defines the range of IP addresses each subnet covers.
        </div>
        <div class="highlight-line">
          Total usable hosts in this subnet = 2^(number of host bits) - 2 = 2^${32-cidr} - 2 = ${totalUsableHosts}.
          We subtract 2 because the first IP is the network address and the last is the broadcast address, which cannot be assigned to hosts.
        </div>
        <div>
          Understanding the difference between block size and total usable hosts is crucial: block size shows the full IP range, while usable hosts reflect assignable addresses within that range.
        </div>
      </div>
    </div>
  `;

  // Step 4: Subnet Boundaries (white bg)
  html += `
    <div class="step-card step-teaching-white">
      <div class="step-label">Step 4: Subnet Boundaries</div>
      <div class="step-value">
        Subnets increment by the block size in the last octet. 
        For example, if the block size is ${blockSize}, subnets start at .0, .${blockSize}, .${blockSize*2}, etc.
        Knowing subnet boundaries is essential for routing and avoiding IP conflicts between subnets.
      </div>
    </div>
  `;

  // Step 5: Optional Gateway (keep gradient)
  html += `
    <div class="step-card">
      <div class="step-label">Optional Gateway</div>
      <div class="step-value highlight-line">
        Typically, the first usable IP address in the subnet is designated as the gateway for routers and network devices.
        In this subnet, the gateway would be ${ipArray[0]}.${ipArray[1]}.${ipArray[2]}.${ipArray[3]+1}, though it can be customized.
      </div>
    </div>
  `;

  return html;
}

/* ================================
   Form Submission
================================ */
document.getElementById("subnetForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const ipInput = document.getElementById("ipAddress").value.trim();
  const teaching = document.getElementById("teachingMode").checked;
  const mode = cidrModeSelect.value;
  const output = document.getElementById("output");

  // Validate IP
  const ipParts = ipInput.split(".");
  if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    output.innerHTML = `<div style="color:red;">Invalid IPv4 address.</div>`;
    return;
  }

  let cidr;
  let requiredHosts = null;

  if (mode === "manual") {
    cidr = Number(document.getElementById("cidr").value);
    if (!subnetMasks[cidr]) {
      output.innerHTML = `<div style="color:red;">CIDR must be between /24 and /30 for this tool.</div>`;
      return;
    }
  } else {
    requiredHosts = Number(document.getElementById("requiredHosts").value);
    if (requiredHosts < 1 || requiredHosts > 254) {
      output.innerHTML = `<div style="color:red;">This tool supports up to 254 usable hosts (single-octet subnet planning).</div>`;
      return;
    }
    cidr = cidrFromHosts(requiredHosts);
  }

  const ipArray = ipToArray(ipInput);
  const result = calculateSubnet(ipArray, cidr);

  // Display results
  let html = `<h2>Results</h2>`;
  html += `
    <div class="step-card result-default"><div class="step-label">Network Address</div><div class="step-value">${result.network.join(".")}</div></div>
    <div class="step-card result-default"><div class="step-label">First Usable</div><div class="step-value">${result.firstHost.join(".")}</div></div>
    <div class="step-card result-default"><div class="step-label">Last Usable</div><div class="step-value">${result.lastHost.join(".")}</div></div>
    <div class="step-card result-default"><div class="step-label">Broadcast Address</div><div class="step-value">${result.broadcast.join(".")}</div></div>
    <div class="step-card result-default"><div class="step-label">Total Usable Hosts</div><div class="step-value">${result.totalHosts}</div></div>
  `;

  if (teaching) {
    html += `<hr><h3>Teaching Mode</h3>`;
    html += renderTeaching(ipArray, cidr, mode, requiredHosts);
  }

  output.innerHTML = html;

  // Animate steps
  setTimeout(() => {
    document.querySelectorAll(".step-card").forEach(card => card.classList.add("visible"));
  }, 150);

  output.scrollIntoView({ behavior: "smooth", block: "start" });
});
