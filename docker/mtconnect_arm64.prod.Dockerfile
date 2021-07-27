FROM registry.gitlab.com/codestryke-tech/dmg-mori/mdc-light/mtconnect_arm64v2

WORKDIR /agentConfiguration

COPY docker/MtcAgentConfig_prod .

CMD ["agent", "run"]
