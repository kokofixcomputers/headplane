# Headplane-fork
> An advanced UI for [juanfont/headscale](https://github.com/juanfont/headscale)

<picture>
    <source
        media="(prefers-color-scheme: dark)"
        srcset="./assets/preview-dark.png"
    >
    <source
        media="(prefers-color-scheme: light)"
        srcset="./assets/preview-light.png"
    >
    <img
        alt="Preview"
        src="./assets/preview-dark.png"
    >
</picture>

Headscale is a self-hosted version of the Tailscale control server, however, it currently lacks a first-party web UI.
Headplane aims to solve this issue by providing a GUI that can deeply integrate with the Headscale server.
It's able to replicate nearly all of the functions of the official Tailscale SaaS UI, including:

- Machine/Node expiry, network routing, name, owner management, and changing ip (NEW! IP Change is new.)
- Access Control List (ACL) and tagging configuration
- Support for OpenID Connect (OIDC) as a login provider
- DNS and *safe* Headscale configuration management

## Features
- [x] Authentication via OpenID Connect (OIDC)
- [x] ACL and Tag management
- [x] DNS management
- [x] Headscale configuration management
- [x] User management
- [x] Node management
- [x] Node expiry
- [x] Change Node IP

## Deployment
> For more configuration options, refer to the [Configuration](/docs/Configuration.md) guide.

For fully-featured deployments, see the [Advanced Deployment](/docs/Advanced-Integration.md) guide.
This includes automatic management of ACLs, DNS settings, and Headscale configuration.
*This is the closest experience to the Tailscale UI that can be achieved with Headscale and Headplane.*
*If you aren't sure which one to pick, we recommend this.*

If your environment is not able to support the advanced deployment, you can still use the basic deployment.
For basic deployments, see the [Basic Deployment](/docs/Basic-Integration.md) guide.
It does not include automatic management of ACLs, DNS settings, or the Headscale configuration,
instead requiring manual editing and reloading when making changes.

## Updating
For updating headplane, The way is to run these:
```bash
curl -L https://github.com/kokofixcomputers/headplane/releases/latest/download/release.zip -o release.zip && unzip -o release.zip
pnpm run build
```
Then restart headplane. All Done!

## Contributing
If you would like to contribute, please install a relatively modern version of Node.js and PNPM.
Clone this repository, run `pnpm install`, and then run `pnpm dev` to start the development server.

> Copyright (c) 2024 Aarnav Tale
