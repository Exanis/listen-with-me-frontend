#!/bin/bash

SERVICE='frontend'
FRONTEND_VERSION=$(($(cat ../kube/FRONTEND)+1))

docker build -t rg.fr-par.scw.cloud/listenwithme/${SERVICE}:latest -t rg.fr-par.scw.cloud/listenwithme/${SERVICE}:${FRONTEND_VERSION} -t listenwithme/${SERVICE}:latest .
docker push rg.fr-par.scw.cloud/listenwithme/${SERVICE}:${FRONTEND_VERSION}
docker push rg.fr-par.scw.cloud/listenwithme/${SERVICE}:latest

BACKEND_VERSION=$(cat ../kube/BACKEND)
cat ../kube/deploy.tpl.yaml | sed "s/@@FRONTEND_VERSION@@/${FRONTEND_VERSION}/" | sed "s/@@BACKEND_VERSION@@/${BACKEND_VERSION}/" > ../kube/deploy.yaml
kubectl --kubeconfig=../kube/kubeconfig-listen-with-me.yaml apply -f ../kube/deploy.yaml
echo ${FRONTEND_VERSION} > ../kube/FRONTEND