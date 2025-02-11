import { useState } from 'react';
import { useFetcher } from 'react-router';

import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';

type Properties = {
	readonly issuer: string;
	readonly disabled?: boolean;
    readonly client_id: string;
    readonly client_secret: string;
};

// TODO: Switch to form submit instead of JSON patch
export default function Modal({ issuer, client_id, client_secret, disabled }: Properties) {
	const [newIssuer, setNewIssuer] = useState(issuer);
    const [newClient_id, setNewClient_id] = useState(client_id);
    const [newClient_secret, setNewClient_secret] = useState(client_secret);
	const fetcher = useFetcher();

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<h1 className="text-2xl font-medium mb-2">ODIC Settings</h1>
			<p>
				Configure ODIC Authentication Settings
			</p>
			<Input
                isReadOnly
				className="w-3/5 font-medium text-sm"
				label="Issuer"
				value={issuer}
				onFocus={(event) => {
					event.target.select();
				}}
			/>
            <Input
                isReadOnly
				className="w-3/5 font-medium text-sm"
				label="Client ID"
				value={client_id}
				onFocus={(event) => {
					event.target.select();
				}}
			/>
            <Input
                isReadOnly
				className="w-3/5 font-medium text-sm"
				label="Client Secret"
                type="password"
				value={client_secret}
				onFocus={(event) => {
					event.target.select();
				}}
			/>

			<Dialog>
				<Dialog.Button isDisabled={disabled}>
					{fetcher.state === 'idle' ? undefined : (
						<Spinner className="w-3 h-3" />
					)}
					Save
				</Dialog.Button>
				<Dialog.Panel
					onSubmit={() => {
						fetcher.submit(
							{
								'oidc.issuer': newIssuer,
                                'oidc.client_id': newClient_id,
                                'oidc.client_secret': newClient_secret,
							},
							{
								method: 'PATCH',
								encType: 'application/json',
							},
						);
					}}
				>
					<Dialog.Title>Change OCID Information</Dialog.Title>
					<Dialog.Text>
						Keep in mind that changing this can break ODIC authentication if configured improperly.
					</Dialog.Text>
					<Input
						label="Issuer"
                        value={issuer}
						placeholder="Your Issuer"
						onChange={setNewIssuer}
					/>
                    <Input
						label="Client ID"
                        value={client_id}
						placeholder="Your client ID"
						onChange={setNewClient_id}
					/>
                    <Input
						label="Client Secret" // Value won't be added for privacy reasons
						placeholder="Your client secret"
						onChange={setNewClient_secret}
					/>
				</Dialog.Panel>
			</Dialog>
		</div>
	);
}
