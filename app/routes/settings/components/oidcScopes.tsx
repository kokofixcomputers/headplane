import { Plus } from 'lucide-react';
import { useFetcher } from 'react-router';
import { useState } from 'react';
import Button from '~/components/Button';
import TableList from '~/components/TableList';
import cn from '~/utils/cn';
import Dialog from '~/components/Dialog';
import Spinner from '~/components/Spinner';
import AddAllowedDomain from '../dialogs/allowedDomains';
import Card from '~/components/Card';
import Input from '~/components/Input';

type Properties = {
	readonly disabled?: boolean;
	readonly Inputscopes: string[];
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ disabled, Inputscopes }: Properties) {
    const [scope, setScope] = useState('');
    const [scopes, setScopes] = useState(Inputscopes);
	const fetcher = useFetcher();

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
            <Card variant="flat" className="max-w-prose mt-12">
                <div className="flex items-center justify-between">
                    <Card.Title className="text-xl mb-0">Scopes</Card.Title>
                </div>
                <Card.Text className="mt-4">
                    Configure Scopes to request when authenticating with OIDC.
                    <div className="mt-4">
                        <h2 className="text-2xl font-medium mb-4">Scopes</h2>
                        <TableList className="mb-8">
                            {scopes.length === 0 ? (
                                <TableList.Item>
                                    <p className="opacity-50 mx-auto">No Scopes specified. Please add scopes such as "openid", "profile", and "email"</p>
                                </TableList.Item>
                            ) : (
                                scopes.map((scope, index) => (
                                    <TableList.Item key={`${scope}`}>
                                        <div className="flex gap-24 items-center">
                                            <div className="flex gap-4 items-center">
                                                <p className="font-mono text-sm">{scope}</p>
                                            </div>
                                        </div>
                                    </TableList.Item>
                                ))
                            )}
                        </TableList>
                    </div>

                    <Dialog>
                        <Dialog.Button isDisabled={disabled}>
                            {fetcher.state === 'idle' ? undefined : (
                                <Spinner className="w-3 h-3" />
                            )}
                            Change Scopes
                        </Dialog.Button>
                        <Dialog.Panel>
                            <Dialog.Title>Change Scopes</Dialog.Title>
                            <Dialog.Text>
                                Keep in mind that changing this can break ODIC authentication if configured improperly.
                            </Dialog.Text>
                            <div className="mt-4">
                            <h2 className="text-2xl font-medium mb-4">Scopes</h2>
                            <TableList className="mb-8">
                                {scopes.length === 0 ? (
                                    <TableList.Item>
                                        <p className="opacity-50 mx-auto">No Scopes specified. Please add scopes such as "openid", "profile", and "email"</p>
                                    </TableList.Item>
                                ) : (
                                    scopes.map((scope, index) => (
                                        <><TableList.Item key={`${scope}`}>
                                            <div className="flex gap-24 items-center">
                                                <div className="flex gap-4 items-center">
                                                    <p className="font-mono text-sm">{scope}</p>
                                                </div>
                                            </div>
                                            <Button
                                                className={cn(
                                                    'px-2 py-1 rounded-md',
                                                    'text-red-500 dark:text-red-400'
                                                )}
                                                isDisabled={disabled}
                                                onPress={() => {
                                                    fetcher.submit(
                                                        {
                                                            'oidc.scope': [...new Set([...scopes])].filter(
                                                                (_, i) => i !== index
                                                            ),
                                                        }, {
                                                        method: 'PATCH',
                                                        encType: 'application/json',
                                                    }
                                                    );
                                                } }
                                            >
                                                Remove
                                            </Button>
                                        </TableList.Item><TableList.Item
                                            className={cn(
                                                'rounded-b-xl focus-within:ring'
                                            )}
                                        >
                                                <Input
                                                    labelHidden
                                                    label="Add a scope"
                                                    placeholder="Add a scope"
                                                    onChange={setScope}
                                                    className={cn(
                                                        'border-none font-mono p-0',
                                                        'rounded-none focus:ring-0 w-full'
                                                    )} />
                                                <Button
                                                    className={cn(
                                                        'rounded-md p-0.5'
                                                    )}
                                                    onPress={() => {
                                                        setScopes([...scopes, scope]);
                                                        setScope('');
                                                    } }
                                                >
                                                    <Plus className="p-1" />
                                                </Button>
                                            </TableList.Item></>
                                    ))
                                )}
                            </TableList>
                        </div>
                        </Dialog.Panel>
                    </Dialog>
                </Card.Text>
            </Card>
		</div>
	);
}
