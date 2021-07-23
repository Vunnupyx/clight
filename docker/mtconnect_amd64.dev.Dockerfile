FROM registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/mtconnect:latest

WORKDIR /agentConfiguration

COPY docker/MtcAgentConfig .

CMD ["agent", "debug"]
