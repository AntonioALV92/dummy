#!/bin/sh

oc project biometricos
oc delete all --selector app=gib-dummy-services
oc new-app --name=gib-dummy-services \
--docker-image=nexus-0.dev.openshift.multivaloresgf.local:18444/gib-dummy-services:latest \
-e PORT=8778

oc expose svc/gib-dummy-services


oc deploy gib-dummy-services