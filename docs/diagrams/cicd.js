window.cicdDiagram = `
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
`;

