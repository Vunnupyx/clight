FROM mdclightdev.azurecr.io/mtconnect-prod_arm64:latest

EXPOSE 5000/tcp

COPY _mdclight/mtc-config/prod .