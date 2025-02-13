import type { ActionFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';

import Notice from '~/components/Notice';
import { loadContext } from '~/utils/config/headplane';
import { loadConfig, patchConfig } from '~/utils/config/headscale';
import { getSession } from '~/utils/sessions.server';

import PKCEModal from './components/pkce';

// We do not want to expose every config value
export async function loader() {
	const context = await loadContext();
	if (!context.config.read) {
		throw new Error('No configuration is available');
	}

	const config = await loadConfig();
	const pkcedata = config.oidc.pkce ? {
		enabled: config.oidc.pkce.enabled,
		method: config.oidc.pkce.method,
	} : {};


	return {
		...pkcedata,
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
                    <PKCEModal enabled={data.enabled ?? false} method={data.method ?? 'S256'} disabled={!data.config.write}></PKCEModal>
                </div>
		</>
	);
}
