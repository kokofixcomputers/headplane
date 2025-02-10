import { InfoIcon } from '@primer/octicons-react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { useState } from 'react';
import Code from '~/components/Code';
import { ErrorPopup } from '~/components/Error';
import Link from '~/components/Link';
import type { Machine, Route, User } from '~/types';
import cn from '~/utils/cn';
import { loadContext } from '~/utils/config/headplane';
import { loadConfig } from '~/utils/config/headscale';
import { pull } from '~/utils/headscale';
import { getSession } from '~/utils/sessions.server';
import { initAgentSocket, queryAgent } from '~/utils/ws-agent';

import Tooltip from '~/components/Tooltip';
import { menuAction } from './action';
import MachineRow from './components/machine';
import NewMachine from './dialogs/new';

export async function loader({ request, context: lC }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	const [machines, routes, users] = await Promise.all([
		pull<{ nodes: Machine[] }>('v1/node', session.get('hsApiKey')!),
		pull<{ routes: Route[] }>('v1/routes', session.get('hsApiKey')!),
		pull<{ users: User[] }>('v1/user', session.get('hsApiKey')!),
	]);

	initAgentSocket(lC);

	const stats = await queryAgent(machines.nodes.map((node) => node.nodeKey));
	const context = await loadContext();
	let magic: string | undefined;

	if (context.config.read) {
		const config = await loadConfig();
		if (config.dns.magic_dns) {
			magic = config.dns.base_domain;
		}
	}

	return {
		nodes: machines.nodes,
		routes: routes.routes,
		users: users.users,
		magic,
		stats,
		server: context.headscaleUrl,
		publicServer: context.headscalePublicUrl,
	};
}

export async function action({ request }: ActionFunctionArgs) {
	return menuAction(request);
}

export default function Page() {
	const data = useLoaderData<typeof loader>();

	const [selectedOwner, setSelectedOwner] = useState(null);

  	const handleOwnerClick = (userId) => { 
    		setSelectedOwner((prevSelectedOwner) => (prevSelectedOwner === userId ? null : userId));
  	};

  	const filteredMachines = selectedOwner
    		? data.nodes.filter((machine) => machine.user.id === selectedOwner)
    		: data.nodes;

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<div className="flex flex-col w-2/3">
					<h1 className="text-2xl font-medium mb-2">Machines</h1>
					<p>
						Manage the devices connected to your Tailnet.{' '}
						<Link
							to="https://tailscale.com/kb/1372/manage-devices"
							name="Tailscale Manage Devices Documentation"
						>
							Learn more
						</Link>
					</p>
				</div>
				<NewMachine
					server={data.publicServer ?? data.server}
					users={data.users}
				/>
			</div>
			<table className="table-auto w-full rounded-lg">
				<thead className="text-headplane-600 dark:text-headplane-300">
					<tr className="text-left px-0.5">
						<th className="uppercase text-xs font-bold pb-2">Name</th>
						<th className="uppercase text-xs font-bold pb-2">Owner</th>
						<th className="pb-2 w-1/4">
							<div className="flex items-center gap-x-1">
								<p className="uppercase text-xs font-bold">Addresses</p>
								{data.magic ? (
									<Tooltip>
										<InfoIcon className="w-4 h-4" />
										<Tooltip.Body className="font-normal">
											Since MagicDNS is enabled, you can access devices based on
											their name and also at{' '}
											<Code>
												[name].
												{data.magic}
											</Code>
										</Tooltip.Body>
									</Tooltip>
								) : undefined}
							</div>
						</th>
						{/**<th className="uppercase text-xs font-bold pb-2">Version</th>**/}
						<th className="uppercase text-xs font-bold pb-2">Last Seen</th>
					</tr>
				</thead>
				<tbody
					className={cn(
						'divide-y divide-headplane-100 dark:divide-headplane-800 align-top',
						'border-t border-headplane-100 dark:border-headplane-800',
					)}
				>
					
					{filteredMachines.map((machine) => (
					        <MachineRow
					          key={machine.id}
					          machine={machine}
					          routes={data.routes.filter(
					            (route) => route.node.id === machine.id
					          )}
					          users={data.users}
					          magic={data.magic}
					          stats={data.stats?.[machine.nodeKey]}
					          onOwnerClick={handleOwnerClick}
					        />
					))}
				</tbody>
			</table>
		</>
	);
}

export function ErrorBoundary() {
	return <ErrorPopup type="embedded" />;
}
