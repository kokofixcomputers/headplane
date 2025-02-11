import { ArrowRightIcon } from '@primer/octicons-react';
import { Link as RemixLink } from 'react-router';
import Button from '~/components/Button';
import Link from '~/components/Link';
import cn from '~/utils/cn';
import Card from '~/components/Card';

import AgentSection from './components/agent';

export default function Page() {
	return (
		<div className="flex flex-col gap-8 max-w-screen-lg">
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
			{/**<AgentSection />**/}
		</div>
	);
}
