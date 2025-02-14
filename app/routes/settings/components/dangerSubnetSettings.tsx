import { useState } from 'react';
import { useFetcher } from 'react-router';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';
import Card from '~/components/Card';

type Properties = {
	readonly ipv4: string;
	readonly disabled?: boolean;
    readonly ipv6: string;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ ipv4, ipv6, disabled }: Properties) {
	const [newipv4, setNewipv4] = useState(ipv4);
    const [newipv6, setNewipv6] = useState(ipv6);
	const fetcher = useFetcher();

	return (
			<Card variant="flat" className="max-w-prose mt-12" border="border-other-danger" darkModeBorder='dark:border-other-danger'>
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Subnet Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure Subnet/prefixes Settings for clients on HeadScale.
                    <p className="text-yellow-600 dark:text-yellow-500">While not a dangerous setting, It may lead to issues as this is not supported.</p>
					<div style={{ marginBottom: '10px' }}></div>
					<Input
						isReadOnly
						className="w-3/5 font-medium text-sm"
						label="IPV4 Subnet"
						value={ipv4}
						onFocus={(event) => {
							event.target.select();
						}}
					/>
					<div style={{ marginBottom: '10px' }}></div>
					<Input
						isReadOnly
						className="w-3/5 font-medium text-sm"
						label="IPV6 Subnet"
						value={ipv6}
						onFocus={(event) => {
							event.target.select();
						}}
					/>
					<div style={{ marginBottom: '10px' }}></div>

					<Dialog>
						<Dialog.Button isDisabled={disabled}>
							{fetcher.state === 'idle' ? undefined : (
								<Spinner className="w-3 h-3" />
							)}
							Change Address Settings
						</Dialog.Button>
						<Dialog.Panel variant='destructive'
							onSubmit={() => {
								fetcher.submit(
									{
										'prefixes.v4': newipv4,
										'prefixes.v6': newipv6,
									},
									{
										method: 'PATCH',
										encType: 'application/json',
									},
								);
							}}
						>
							<Dialog.Title>Change Subnet/Prefix Settings (WARNING)</Dialog.Title>
							<Dialog.Text>
								Keep in mind that changing this can break your HeadScale Setup if changed improperly.
							</Dialog.Text>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="IPV4 Subnet"
								defaultValue={ipv4}
								placeholder="The url clients will connect to."
								onChange={setNewipv4}
							/>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="IPV6 Subnet"
								defaultValue={ipv6}
								placeholder="Address to listen to / bind to on the server."
								onChange={setNewipv6}
							/>
							<div style={{ marginBottom: '10px' }}></div>
						</Dialog.Panel>
					</Dialog>
				</Card.Text>
			</Card>
	);
}
