import { useState } from 'react';
import { useFetcher } from 'react-router';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';
import Card from '~/components/Card';

type Properties = {
	readonly server_url: string;
	readonly disabled?: boolean;
    readonly listen_address: string;
    readonly metrics_listen_address: string;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ server_url, listen_address, metrics_listen_address, disabled }: Properties) {
	const [newServerURL, setNewServerURL] = useState(server_url);
    const [newListeningAddress, setNewListeningAddress] = useState(listen_address);
    const [newMetrics_listen_address, setNewMetrics_listen_address] = useState(metrics_listen_address);
	const fetcher = useFetcher();

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<h1 className="text-2xl font-medium mb-2">Danger Settings</h1>
            <p className="text-sm text-gray-500">These settings are dangerous and should be changed with caution.</p>
			<Card variant="flat" className="max-w-prose mt-12" border="border-other-danger" darkModeBorder='dark:border-other-danger'>
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Address Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure Address & Listening Settings for HeadScale.
                    <p className="text-yellow-500">If changed improperly, Clients may not be able to connect and this admin dashboard may not work.</p>
					<div style={{ marginBottom: '10px' }}></div>
					<Input
						isReadOnly
						className="w-3/5 font-medium text-sm"
						label="Server URL"
						value={server_url}
						onFocus={(event) => {
							event.target.select();
						}}
					/>
					<div style={{ marginBottom: '10px' }}></div>
					<Input
						isReadOnly
						className="w-3/5 font-medium text-sm"
						label="Listening Address"
						value={listen_address}
						onFocus={(event) => {
							event.target.select();
						}}
					/>
					<div style={{ marginBottom: '10px' }}></div>
					<Input
						isReadOnly
						className="w-3/5 font-medium text-sm"
						label="Metrics Listening Address"
						value={metrics_listen_address}
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
						<Dialog.Panel
							onSubmit={() => {
								fetcher.submit(
									{
										'server_url': newServerURL,
										'listen_addr': newListeningAddress,
										'metrics_listen_addr': newMetrics_listen_address,
									},
									{
										method: 'PATCH',
										encType: 'application/json',
									},
								);
							}}
						>
							<Dialog.Title>Change Address Settings (DANGER)</Dialog.Title>
							<Dialog.Text>
								Keep in mind that changing this can break your HeadScale Setup if changed improperly.
							</Dialog.Text>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="Server URL"
								value={server_url}
								placeholder="The url clients will connect to."
								onChange={setNewServerURL}
							/>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="Listening Address"
								value={listen_address}
								placeholder="Address to listen to / bind to on the server."
								onChange={setNewListeningAddress}
							/>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="Metrics Listening Address"
								placeholder="Address to listen to /metrics, you may want to keep this endpoint private to your internal network."
								onChange={setNewMetrics_listen_address}
							/>
							<div style={{ marginBottom: '10px' }}></div>
						</Dialog.Panel>
					</Dialog>
				</Card.Text>
			</Card>
		</div>	
	);
}
