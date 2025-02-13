import { useState } from 'react';
import { useFetcher } from 'react-router';
import Dialog from '~/components/Dialog';
import Switch from '~/components/Switch';
import Spinner from '~/components/Spinner';
import Card from '~/components/Card';

type Properties = {
	readonly disable_check_updates: boolean;
	readonly disabled?: boolean;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ disable_check_updates, disabled }: Properties) {
    const [newDisable_check_updates, setNewDisable_check_updates] = useState(disable_check_updates);
	const fetcher = useFetcher();

	return (
			<Card variant="flat" className="max-w-prose mt-12">
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">Disable Check for Updates</Card.Title>
				</div>
				<Card.Text className="mt-4">
                    Disables the automatic check for headscale updates on startup
					<div style={{ marginBottom: '10px' }}></div>
                    <div className="flex items-center justify-between">
                        <p>Disable Check Updates:</p>
                        <Switch
                            isReadOnly
                            label="Enabled"
                            defaultSelected={disable_check_updates}
                            onChange={setNewDisable_check_updates}
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
										'disable_check_updates': newDisable_check_updates,
									},
									{
										method: 'PATCH',
										encType: 'application/json',
									},
								);
							}}
						>
							<Dialog.Title>Disable Check for Updates</Dialog.Title>
							<div style={{ marginBottom: '10px' }}></div>
							<div className="flex items-center justify-between">
                                <p>Enabled:</p>
                                <Switch
                                    label="Enabled"
                                    defaultSelected={disable_check_updates}
                                    onChange={setNewDisable_check_updates}
                                />
                            </div>
						</Dialog.Panel>
					</Dialog>
				</Card.Text>
			</Card>
	);
}
