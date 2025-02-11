import type { ActionFunctionArgs } from 'react-router';
import { data, useLoaderData } from 'react-router';
import { ArrowRightIcon } from '@primer/octicons-react';
import { Link as RemixLink } from 'react-router';
import Link from '~/components/Link';
import Card from '~/components/Card';
import Notice from '~/components/Notice';
import { loadContext } from '~/utils/config/headplane';
import { loadConfig, patchConfig } from '~/utils/config/headscale';
import { getSession } from '~/utils/sessions.server';
import OdicModal from './components/odic';
import AgentSection from './components/agent';

export async function loader() {
	const context = await loadContext();
	if (!context.config.read) {
		throw new Error('No configuration is available');
	}

	const config = await loadConfig();
	const odicdata = config.oidc ? {
		issuer: config.oidc.issuer,
		client_id: config.oidc.client_id,
		client_secret: config.oidc.client_secret,
	} : {};

	return {
		...odicdata,
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
		<div className="flex flex-col gap-8 max-w-screen-lg">
			{data.config.write ? undefined : (
				<Notice>
					The Headscale configuration is read-only. You cannot make changes to
					the configuration
				</Notice>
			)}
			<div className="flex flex-col w-2/3">
				<h1 className="text-2xl font-medium mb-4">Settings</h1>
				<p>
					The settings page is still under construction. As I'm able to add more
					features, I'll be adding them here. If you require any features, feel
					free to open an issue on the GitHub repository.
				</p>
			</div>
			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Pre-Auth Keys</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Headscale fully supports pre-authentication keys in order to easily
					add devices to your Tailnet. To learn more about using
					pre-authentication keys, visit the{' '}
					<Link
						to="https://tailscale.com/kb/1085/auth-keys/"
						name="Tailscale Auth Keys documentation"
					>
						Tailscale documentation
					</Link>
					
					<RemixLink to="/settings/auth-keys">
						<div className="text-lg font-medium flex items-center">
							Manage Auth Keys
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			<OdicModal issuer={data.issuer ?? ''} client_id={data.client_id ?? ''} client_secret={data.client_secret ?? ''} disabled={!data.config.write}></OdicModal>
			{/**<AgentSection />**/}
		</div>
	);
}
