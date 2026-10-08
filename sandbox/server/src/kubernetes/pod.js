import { k8sCoreV1Api } from "./config.js";

export const createPod = async (sandboxId) => { 

    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec: {
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            containers: [
                {
                    image: "template:v2",
                    imagePullPolicy: "IfNotPresent",
                    name: "sandbox-container",
                    ports: [{ containerPort: 5173, name: 'http' }],
                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "512Mi"
                        },
                        requests: {
                            cpu: "250m",
                            memory: "128Mi"
                        },
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ],
                },
                
                {
                    image: "agent:v2",
                    imagePullPolicy: "IfNotPresent",
                    name: "agent-container",
                    ports: [{ containerPort: 3000, name: 'http' }],
                    resources: {
                        limits: {
                            cpu: "500m",
                            memory: "1Gi"
                        },
                        requests: {
                            cpu: "250m",
                            memory: "500Mi"
                        },
                    },
                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ],
                }
            ]
        }
    };

    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace: "default",
        body: podManifest
    });

    return response;
};