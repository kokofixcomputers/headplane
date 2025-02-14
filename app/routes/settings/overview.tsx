import { ArrowRightIcon } from '@primer/octicons-react';
import { Link as RemixLink } from 'react-router';
import Link from '~/components/Link';
import Card from '~/components/Card';
import AgentSection from './components/agent';

export default function Page() {
	return (
		<div className="flex flex-col gap-4 max-w-screen-lg">
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

			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">OIDC Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure OIDC Authentication Settings
					
					<RemixLink to="/settings/oidc">
						<div className="text-lg font-medium flex items-center">
							Manage OIDC Settings
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">PKCE Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure PKCE (Proof Key for Code Exchange) Settings
					
					<RemixLink to="/settings/pkce">
						<div className="text-lg font-medium flex items-center">
							Manage PKCE Settings
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			<Card variant="flat" className="max-w-prose mt-12" border="border-variant-warning" darkModeBorder='dark:border-variant-warning'>
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">DERP Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure DERP Settings for when a direct connection cannot be established.
					
					<RemixLink to="/settings/derp">
						<div className="text-lg font-medium flex items-center">
							Manage DERP Settings
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Other Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					<RemixLink to="/settings/other">
						<div className="text-lg font-medium flex items-center">
							Manage Other Settings
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			<Card variant="flat" className="max-w-prose mt-12" border="border-variant-danger" darkModeBorder="dark:border-variant-danger">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Danger Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Warning! Changing these settings may cause issues with your Tailnet.

					ONLY ENTER IF YOU KNOW WHAT YOU ARE DOING!
					
					<RemixLink to="/settings/danger">
						<div className="text-lg font-medium flex items-center text-red-500">
							Manage Danger Settings
							<ArrowRightIcon className="w-5 h-5 ml-2" />
						</div>
					</RemixLink>
				</Card.Text>
			</Card>

			{/**<AgentSection />**/}
		</div>
	);
}
