# Environment configuration:

```jsonc
"env": {
    "selected": "dev" | "stag" | "prod", // Key der docker registry configuration aus der runtimeconfig.json
    "web": {
        "tag": // Docker tag webserver
    },
    "mdc": {
        "tag": // Docker tag runtime
    },
    "mtc": {
        "tag": // Docker tag webserver, immer "latest"
    }
}
```

## Production

```jsonc
"env": {
    "selected": "prod",
    "web": {
        "tag": "main"
    },
    "mdc": {
        "tag": "main"
    },
    "mtc": {
        "tag": "latest"
    }
}
```

## Staging

```jsonc
"env": {
    "selected": "stag",
    "web": {
        "tag": "staging"
    },
    "mdc": {
        "tag": "staging"
    },
    "mtc": {
        "tag": "latest"
    }
}
```

## Development

```jsonc
"env": {
    "selected": "dev",
    "web": {
        "tag": "develop"
    },
    "mdc": {
        "tag": "develop"
    },
    "mtc": {
        "tag": "latest"
    }
}
```

# Runtime Config

```jsonc
"registries": {
    "prod": {
        "url": "mdclight.azurecr.io",
        "web": {
            "tag": "main"
        },
        "mdc": {
            "tag": "main"
        },
        "mtc": {
            "tag": "latest"
        }
    },
    "dev": {
        "url": "mdclightdev.azurecr.io",
        "web": {
            "tag": "develop"
        },
        "mdc": {
            "tag": "develop"
        },
        "mtc": {
            "tag": "latest"
        }
    },
    "stag": {
        "url": "mdclightstaging.azurecr.io",
        "web": {
            "tag": "staging"
        },
        "mdc": {
            "tag": "staging"
        },
        "mtc": {
            "tag": "latest"
        }
    }
}
```
