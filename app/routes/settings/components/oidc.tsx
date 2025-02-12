import { useState } from 'react';
import { useFetcher } from 'react-router';
import Switch from '~/components/Switch';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';
import OidcDomainModal from '../components/oidcAllowedDomains';
import Card from '~/components/Card';

type Properties = {
	readonly issuer: string;
	readonly disabled?: boolean;
    readonly client_id: string;
    readonly client_secret: string;
	readonly only_start_if_oidc_is_available: boolean;
	readonly allowed_domains: string[];
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ issuer, client_id, client_secret, disabled, only_start_if_oidc_is_available, allowed_domains }: Properties) {
	const [newIssuer, setNewIssuer] = useState(issuer);
    const [newClient_id, setNewClient_id] = useState(client_id);
    const [newClient_secret, setNewClient_secret] = useState(client_secret);
	const [newOnly_start_if_oidc_is_available, setOnly_start_if_oidc_is_available] = useState(only_start_if_oidc_is_available);
	const fetcher = useFetcher();

	const OIDCSwitch = () => {
		const style = {
		  fontSize: '16px',
		  fontWeight: 'bold',
		};
	  
		return (
		  <div style={style}>
			Only Start HeadScale if OIDC Authentication is available
			<Switch
			  label="Only Start HeadScale if OIDC Authentication is available"
			  defaultSelected={only_start_if_oidc_is_available}
			  onChange={setOnly_start_if_oidc_is_available}
			/>
		  </div>
		);
	  };

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">OIDC Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Configure OIDC Authentication Settings
					<OIDCSwitch />
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
							Change ODIC Settings
						</Dialog.Button>
						<Dialog.Panel
							onSubmit={() => {
								fetcher.submit(
									{
										'oidc.only_start_if_oidc_is_available': newOnly_start_if_oidc_is_available,
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
							<p>Only Start HeadScale if OIDC Authentication is available</p>
							<Switch
								label="Only Start HeadScale if OIDC Authentication is available"
								defaultSelected={only_start_if_oidc_is_available}
								onChange={setOnly_start_if_oidc_is_available}
							/>
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
					<OidcDomainModal allowed_domains={allowed_domains ?? []} disabled={disabled} />		
				</Card.Text>
			</Card>
		</div>	
	);
}
