# Problem Statement & Solution Overview

## Project Statement
Deliver low‑latency edge services on cost‑effective VPS nodes (Docker Compose) connected securely to on‑prem (SonicWALL) via IPsec (strongSwan), while bursting to cloud (EKS/GKE) for scale — unified by a single CI/CD pipeline.

## Business Drivers
- Latency: Serve users near branch/edge sites; meet UX and SLA goals.
- Security: Encrypted IPsec to HQ; policy control on the firewall.
- Flexibility: Use edge for locality and cloud for elasticity.
- Cost: Keep base costs low on VPS; pay for scale only when needed.

## Requirements
- IKEv2 IPsec tunnels: strongSwan (VPS) ↔ SonicWALL (HQ).
- Simple edge runtime: Docker Compose with minimal ops overhead.
- Cloud clusters: small EKS/GKE targets with standard ingress.
- One pipeline: build once → deploy edge (Compose) + cloud (kubectl).

## Architecture (at a glance)
- Edge: VPS nodes (10.255.1.0/24, 10.255.2.0/24) with containers.
- On‑prem: SonicWALL, AD/GPO, Jenkins, SonarQube, SNMP.
- AWS/GCP: small clusters for core services and bursts; LBs for ingress.

See diagram: `edge-vps-hybrid-ipsec/docs/diagrams/topology.png`

## Why This Approach
- strongSwan + VPS: Inexpensive, flexible, and fits small edge footprints.
- Docker Compose: Lightweight at the edge; K8s features not always required.
- EKS/GKE: Common deployment model across edge/cloud where K8s adds value.

## Alternatives Considered (and why not)
- SD‑WAN/SASE: Simpler path selection/QoS, but higher recurring costs and lock‑in.
- K3s/MicroK8s at edge: Powerful, but more ops overhead than Compose for small nodes.
- ECS/Fargate/Autopilot: Great singly per cloud, but less aligned with hybrid edge model.

## Cost Optimization
- Use low‑cost VPS for edge; Spot/Preemptible in clusters.
- CI right‑sizing: Off‑hours schedules, shared agents, build caching.
- Minimize LBs; prefer shared VIPs/ports; compress/batch data to reduce egress.
- Keep observability lean at edge (critical metrics only).

Initial vs Optimized (monthly, ballpark)
- Initial ≈ $520 → Optimized ≈ $220 via preemptible/spot, fewer LBs, off‑hours CI.

## Risks If Not Implemented
- Higher latency and degraded UX without local edge.
- Cost spikes if all traffic and compute live in distant cloud regions.
- Operational drift across sites with inconsistent deployment models.

## Outcomes (what to showcase)
- Lower latency from edge delivery; secure tunnels into HQ.
- One pipeline deploys both edge and cloud targets.
- Cost kept low while enabling scale‑out on demand.

## How to Demo
- Edge: `edge/docker-compose.yaml`, `edge/deploy_vps.sh` (set VPS_HOST)
- VPN: `network/strongswan/onprem.conf`
- CI: `ci/Jenkinsfile`
- K8s: `k8s/base` and `k8s/overlays/{aws,gcp}`
