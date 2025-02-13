import { useState } from 'react';
import { useFetcher } from 'react-router';
import Dialog from '~/components/Dialog';
import Switch from '~/components/Switch';
import Spinner from '~/components/Spinner';
import Card from '~/components/Card';

type Properties = {
	readonly randomize: boolean;
	readonly disabled?: boolean;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ randomize, disabled }: Properties) {
    const [newRandomize, setNewRandomize] = useState(randomize);
	const fetcher = useFetcher();

	return (
			<Card variant="flat" className="max-w-prose mt-12" border="border-other-danger" darkModeBorder='dark:border-other-danger'>
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Randomize Client Port</Card.Title>
				</div>
				<Card.Text className="mt-4">
					Randomizes Client Port for networks or firewalls where the default 41641 port is blocked.
					<div style={{ marginBottom: '10px' }}></div>
                    <div className="flex items-center justify-between">
                        <p>Enabled:</p>
                        <Switch
                            isReadOnly
                            label="Enabled"
                            defaultSelected={randomize}
                            onChange={setNewRandomize}
                        />
                    </div>
					<div style={{ marginBottom: '10px' }}></div>

					<Dialog>
						<Dialog.Button isDisabled={disabled}>
							{fetcher.state === 'idle' ? undefined : (
								<Spinner className="w-3 h-3" />
							)}
							Change Setting
						</Dialog.Button>
						<Dialog.Panel
							onSubmit={() => {
								fetcher.submit(
									{
										'randomize_client_port': newRandomize,
									},
									{
										method: 'PATCH',
										encType: 'application/json',
									},
								);
							}}
						>
							<Dialog.Title>Randomize Client Port</Dialog.Title>
							<div style={{ marginBottom: '10px' }}></div>
							<div className="flex items-center justify-between">
                                <p>Enabled:</p>
                                <Switch
                                    label="Enabled"
                                    defaultSelected={randomize}
                                    onChange={setNewRandomize}
                                />
                            </div>
						</Dialog.Panel>
					</Dialog>
				</Card.Text>
			</Card>
	);
}
