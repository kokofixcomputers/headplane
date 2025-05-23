import { DataRef, DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { PersonIcon } from '@primer/octicons-react';
import { useEffect, useState } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { useActionData, useLoaderData, useSubmit } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { Info } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSitemap } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '~/components/Tooltip';
import Attribute from '~/components/Attribute';
import Card from '~/components/Card';
import { ErrorPopup } from '~/components/Error';
import StatusCircle from '~/components/StatusCircle';
import type { Machine, User } from '~/types';
import cn from '~/utils/cn';
import { loadContext } from '~/utils/config/headplane';
import { loadConfig } from '~/utils/config/headscale';
import { del, post, pull } from '~/utils/headscale';
import { send } from '~/utils/res';
import { getSession } from '~/utils/sessions.server';
import Chip from '~/components/Chip';


import toast from '~/utils/toast';
import Auth from './components/auth';
import Oidc from './components/oidc';
import Remove from './dialogs/remove';
import Rename from './dialogs/rename';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	const [machines, apiUsers] = await Promise.all([
		pull<{ nodes: Machine[] }>('v1/node', session.get('hsApiKey')!),
		pull<{ users: User[] }>('v1/user', session.get('hsApiKey')!),
	]);

	const users = apiUsers.users.map((user) => ({
		...user,
		machines: machines.nodes.filter((machine) => machine.user.id === user.id),
	}));

	const context = await loadContext();
	let magic: string | undefined;

	if (context.config.read) {
		const config = await loadConfig();
		if (config.dns.magic_dns) {
			magic = config.dns.base_domain;
		}
	}

	return {
		oidc: context.oidc,
		magic,
		users,
	};
}

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	if (!session.has('hsApiKey')) {
		return send({ message: 'Unauthorized' }, 401);
	}

	const data = await request.formData();
	if (!data.has('_method')) {
		return send({ message: 'No method provided' }, 400);
	}

	const method = String(data.get('_method'));

	switch (method) {
		case 'create': {
			if (!data.has('username')) {
				return send({ message: 'No name provided' }, 400);
			}

			const username = String(data.get('username'));
			await post(`v1/node/${id}/user`, session.get('hsApiKey')!, { user: to });

			return { message: `User ${username} created` };
		}

		case 'delete': {
			if (!data.has('username')) {
				return send({ message: 'No name provided' }, 400);
			}

			const username = String(data.get('username'));
			await del(`v1/user/${username}`, session.get('hsApiKey')!);
			return { message: `User ${username} deleted` };
		}

		case 'rename': {
			if (!data.has('old') || !data.has('new')) {
				return send({ message: 'No old or new name provided' }, 400);
			}

			const old = String(data.get('old'));
			const newName = String(data.get('new'));
			await post(`v1/user/${old}/rename/${newName}`, session.get('hsApiKey')!);
			return { message: `User ${old} renamed to ${newName}` };
		}

		case 'move': {
			if (!data.has('id') || !data.has('to') || !data.has('name')) {
				return send({ message: 'No ID or destination provided' }, 400);
			}

			const id = String(data.get('id'));
			const to = String(data.get('to'));
			const name = String(data.get('name'));

			try {
			  await post(`v1/node/${id}/user`, session.get('hsApiKey')!, { user: to });
			  return { message: `Moved ${name} to ${to}` };
			} catch (error) {
			  let errorMessage = 'An unexpected error occurred.';
			  
			  // Assuming post function throws an object with a status and possibly a text property
			  if (typeof error === 'object' && 'status' in error) {
			    errorMessage = `Failed with status ${error.status}:`;
			    try {
			      const responseText = await (error as any).text();
			      errorMessage += `\n${responseText}`;
			    } catch (e) {}
			  } else if (typeof error === 'string') {
			    errorMessage = `Failed: ${error}`;
			  }
			
			  return send({ message: `Failed to move ${name} to ${to}`, details: errorMessage }, 500);
			}

		}

		default: {
			return send({ message: 'Invalid method' }, 400);
		}
	}
}

export default function Page() {
	const data = useLoaderData<typeof loader>();
	const [users, setUsers] = useState(data.users);
	const actionData = useActionData<typeof action>();

	useEffect(() => {
		if (!actionData) {
			return;
		}

		toast(actionData.message);
		if (actionData.message.startsWith('Failed')) {
			setUsers(data.users);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actionData]);

	useEffect(() => {
		setUsers(data.users);
	}, [data.users]);

	return (
		<>
			<h1 className="text-2xl font-medium mb-1.5">Users</h1>
			<p className="mb-8 text-md">
				Manage the users in your network and their permissions. Tip: You can
				drag machines between users to change ownership.
			</p>
			{data.oidc ? (
				<Oidc oidc={data.oidc} magic={data.magic} />
			) : (
				<Auth magic={data.magic} />
			)}
			<ClientOnly fallback={<Users users={users} />}>
				{() => (
					<InteractiveUsers
						users={users}
						setUsers={setUsers}
						magic={data.magic}
					/>
				)}
			</ClientOnly>
		</>
	);
}

type UserMachine = User & { machines: Machine[] };

interface UserProps {
	users: UserMachine[];
	setUsers?: (users: UserMachine[]) => void;
	magic?: string;
}

function Users({ users, magic }: UserProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
			{users.map((user) => (
				<UserCard key={user.id} user={user} magic={magic} />
			))}
		</div>
	);
}

function InteractiveUsers({ users, setUsers, magic }: UserProps) {
	const submit = useSubmit();

	return (
		<DndContext
			onDragEnd={(event) => {
				const { over, active } = event;
				if (!over) {
					return;
				}

				// Update the UI optimistically
				const newUsers = new Array<UserMachine>();
				const reference = active.data as DataRef<Machine>;
				if (!reference.current) {
					return;
				}

				// Ignore if the user is unchanged
				if (reference.current.user.name === over.id) {
					return;
				}

				// Ignore if the user is OCID managed
				if (reference.current.user.provider === 'ocid') {
					return;
				}

				// Ignore if the machine is moved to a OCID user
				if (over.provider === 'ocid') {
					return;
				}

				for (const user of users) {
					newUsers.push({
						...user,
						machines:
							over.id === user.name
								? [...user.machines, reference.current]
								: user.machines.filter((m) => m.id !== active.id),
					});
				}

				setUsers?.(newUsers);
				const data = new FormData();
				data.append('_method', 'move');
				data.append('id', active.id.toString());
				data.append('to', String(over.id));
				data.append('name', reference.current.givenName);

				submit(data, {
					method: 'POST',
				});
			}}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
				{users.map((user) => (
					<UserCard key={user.id} user={user} magic={magic} />
				))}
			</div>
		</DndContext>
	);
}

function MachineChip({ machine }: { readonly machine: Machine }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: machine.id,
		data: machine,
	});

	return (
		<div
			ref={setNodeRef}
			className={cn(
				'flex items-center w-full gap-2 py-1',
				'hover:bg-headplane-50 dark:hover:bg-headplane-950 rounded-xl',
			)}
			style={{
				transform: transform
					? `translate3d(${transform.x.toString()}px, ${transform.y.toString()}px, 0)`
					: undefined,
			}}
			{...listeners}
			{...attributes}
		>
			<StatusCircle isOnline={machine.online} className="px-1 h-4 w-fit" />
			<Attribute
				name={machine.givenName}
				link={`machines/${machine.id}`}
				value={machine.ipAddresses[0]}
			/>
		</div>
	);
}

interface CardProps {
	user: UserMachine;
	magic?: string;
}

function UserCard({ user, magic }: CardProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: user.name,
	});
	const isAnyMachineOnline = user.machines.some((machine) => machine.online);


	return (
		<div ref={setNodeRef}>
			<Card
				variant="flat"
				className={cn(
					'max-w-full w-full overflow-visible h-full',
					isOver ? 'bg-headplane-100 dark:bg-headplane-800' : '',
				)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						{user.provider === "oidc" ? <FontAwesomeIcon icon={faSitemap} /> : <PersonIcon className="w-6 h-6" />}
						<StatusCircle isOnline={isAnyMachineOnline} className="px-1 h-4 w-fit" />
						<span className="text-lg font-mono inline-flex items-center gap-1">
							{user.name !== "" ? user.name : user.displayName}
							{(user.provider === "oidc") && (
								<Tooltip>
									<Chip
										text="Managed"
										leftIcon={<Info className="p-1" />}
										className={cn('inline-flex items-center')}
									/>
									<Tooltip.Body>
										This user is managed by your OIDC External Provider. You cannot rename this user nor move machines between this user.
									</Tooltip.Body>
								</Tooltip>
							)}
						</span>
					</div>
					<div className="flex items-center gap-2">
						{user.provider === "" && <Rename id={user.id} username={user.name} />}
						{user.machines.length === 0 ? (
							<Remove id={user.id} username={user.name !== "" ? user.name : user.displayName} />
						) : undefined}
					</div>
				</div>
				<div className="mt-4">
					{user.machines.map((machine) => (
						<MachineChip key={machine.id} machine={machine} />
					))}
				</div>
			</Card>
		</div>
	);
}

export function ErrorBoundary() {
	return <ErrorPopup type="embedded" />;
}
