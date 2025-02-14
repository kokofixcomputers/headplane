import type { ActionFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';

import Notice from '~/components/Notice';
import { loadContext } from '~/utils/config/headplane';
import { loadConfig, patchConfig } from '~/utils/config/headscale';
import { getSession } from '~/utils/sessions.server';

import DerpModal from './components/derp';

// We do not want to expose every config value
export async function loader() {
	const context = await loadContext();
	if (!context.config.read) {
		throw new Error('No configuration is available');
	}

	const config = await loadConfig();
	const configdata = config ? {
		// Server
        enabled: config.derp.server.enabled,
        region_id: config.derp.server.region_id,
        region_code: config.derp.server.region_code,
        region_name: config.derp.server.region_name,
        stun_listen_addr: config.derp.server.stun_listen_addr,
        private_key_path: config.derp.server.private_key_path,
        automatically_add_embedded_derp_region: config.derp.server.automatically_add_embedded_derp_region,
        ipv4: config.derp.server.ipv4,
        ipv6: config.derp.server.ipv6,
	} : {};


	return {
		...configdata,
		...context,
	};
}

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	if (!session.has('hsApiKey')) {
		return data({ success: false }, { status: 401 });
	}

	const context = await loadContext();
	if (!context.config.write) {
		return data({ success: false }, { status: 403 });
	}

	const textData = await request.text();
	if (!textData) {
		return data({ success: true });
	}

	const patch = JSON.parse(textData) as Record<string, unknown>;
	await patchConfig(patch);

	if (context.integration?.onConfigChange) {
		await context.integration.onConfigChange(context.integration.context);
	}

	return data({ success: true });
}

export default function Page() {
	const data = useLoaderData<typeof loader>();
	return (
		<>
            <div className="flex flex-col gap-8 max-w-screen-lg">
                    {data.config.write ? undefined : (
                        <Notice>
                            The Headscale configuration is read-only. You cannot make changes to
                            the configuration
                        </Notice>
                    )}
					<DerpModal enabled={data.enabled ?? false} region_id={BigInt(data.region_id ?? 999)} region_code={data.region_code ?? "headscale"} region_name={data.region_name ?? "Headscale Embedded DERP"} stun_listen_addr={data.stun_listen_addr ?? "0.0.0.0:3478"} private_key_path={data.private_key_path ?? "/var/lib/headscale/derp_server_private.key"} automatically_add_embedded_derp_region={data.automatically_add_embedded_derp_region ?? true} ipv4={data.ipv4 ?? "1.2.3.4"} ipv6={data.ipv6 ?? "2001:db8::1"} />
			</div>
		</>
	);
}
