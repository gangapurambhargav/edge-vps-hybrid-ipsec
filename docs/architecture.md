# Architecture

This project connects edge VPS nodes to on‑prem via IPsec (strongSwan ↔ SonicWALL), while also integrating small AWS EKS and GCP GKE clusters for scalable services. CI/CD via Jenkins builds and deploys to edge (Compose) and cloud (K8s), with SonarQube for code quality and SNMP for network monitoring.

Mermaid: High‑Level Topology
```mermaid
flowchart LR
  subgraph Branches[Edge/VPS Sites]
    V1[VPS Node 1\\nDocker]
    V2[VPS Node 2\\nDocker]
  end

  subgraph OnPrem[On‑Prem DC]
    SW[SonicWALL HQ\\nIPsec AES-256 IKEv2]
    AD[AD/Group Policy]
    LAN[OSPF, VTP, VLANs]
    JENK[Jenkins]
    SQ[SonarQube]
    NMS[SNMP/Alerting]
  end

  subgraph AWS[AWS]
    VPC[(VPC 10.50.0.0/16)]
    APRV1[10.50.1.0/24]
    APRV2[10.50.2.0/24]
    EKS[EKS]
    NLB[NLB]
  end

  subgraph GCP[GCP]
    VPCG[(VPC 10.60.0.0/16)]
    GPRV1[10.60.1.0/24]
    GPRV2[10.60.2.0/24]
    GKE[GKE]
    GLB[External LB]
    VM[Compute Engine VM]
  end

  V1 <-- IPsec (strongSwan) --> SW
  V2 <-- IPsec (strongSwan) --> SW
  SW <-- IPsec --> EKS
  SW <-- IPsec --> GKE
  JENK --- LAN
  SQ --- LAN
  NMS --- SW
```

Mermaid: CI/CD Flow (Edge + Cloud)
```mermaid
sequenceDiagram
  participant Dev as Developer
  participant Git as GitHub
  participant Jenkins as Jenkins
  participant SQ as SonarQube
  participant REG as GHCR
  participant VPS as Edge VPS
  participant EKS as EKS
  participant GKE as GKE

  Dev->>Git: Push PR/Commit
  Git->>Jenkins: Webhook triggers pipeline
  Jenkins->>SQ: Static analysis and quality gate
  Jenkins->>REG: Build + push Docker image
  Jenkins->>VPS: deploy_vps.sh (docker compose up -d)
  Jenkins->>EKS: kubectl set image + rollout
  Jenkins->>GKE: kubectl set image + rollout
```

Networking Notes
- Edge tunnels: each VPS establishes IKEv2 to SonicWALL; add routes for VPS subnets.
- On‑prem: static routes to AWS/GCP CIDRs via SonicWALL; OSPF/VLANs for internal segmentation.
- Cloud: standard north‑south via LBs; private nodes with NAT/Cloud NAT for egress.

Security
- IPsec AES‑256/IKEv2; least‑privilege for CI/CD credentials; restricted inbound to LBs.

Cost Levers
- Use low‑cost VPS for edge; Spot/Preemptible nodes in cloud clusters; schedule CI and consolidate infra.
