import { useState } from 'react';
import { useFetcher } from 'react-router';
import Switch from '~/components/Switch';
import Select from '~/components/Select';

import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';

type Properties = {
	readonly enabled: boolean;
	readonly disabled?: boolean;
    readonly method: string;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ enabled, method, disabled }: Properties) {
	const [newEnabled, setNewEnabled] = useState(enabled);
    const [newMethod, setNewMethod] = useState(method);
	const fetcher = useFetcher();

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<h1 className="text-2xl font-medium mb-2">PKCE Settings</h1>
			<p>
                PKCE adds an additional layer of security to the OAuth 2.0 authorization code flow 
                by preventing authorization code interception attacks
			</p>
            <p>Enabled:</p>
			<Switch
              isReadOnly
			  label="Enabled"
			  defaultSelected={enabled}
			/>
			<Input
                isReadOnly
				className="w-3/5 font-medium text-sm"
				label="Method"
				value={method}
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
								'oidc.pkce.enabled': newEnabled,
								'oidc.pkce.method': newMethod,
							},
							{
								method: 'PATCH',
								encType: 'application/json',
							},
						);
					}}
				>
					<Dialog.Title>Change PKCE Information</Dialog.Title>
					<Dialog.Text>
						Keep in mind that this will require the OIDC server to support PKCE.
					</Dialog.Text>
                    <div className="flex items-center justify-between">
					    <p>Enabled:</p>
                        <Switch
                            label="Enabled"
                            defaultSelected={enabled}
                            onChange={setNewEnabled}
                        />
                    </div>
                    <Select
                        label="Encryption Method"
                        placeholder="Select a encryption method"
                        className="w-full"
                        defaultSelectedKey={method}
                        onSelectionChange={(value) => setNewMethod(value?.toString() ?? '')}
                    >
                        <Select.Item key="S256">S256 (recommended)</Select.Item>
                        <Select.Item key="plain">Plain</Select.Item>
                    </Select>
				</Dialog.Panel>
			</Dialog>
		</div>
	);
}
