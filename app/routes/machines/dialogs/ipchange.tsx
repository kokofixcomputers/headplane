import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import type { Machine, User } from '~/types';

interface MoveProps {
    machine: Machine;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Move({ machine, isOpen, setIsOpen }: MoveProps) {
    return (
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Panel>
                <Dialog.Title>Change the IP Address of {machine.givenName} (experimental)</Dialog.Title>
                <Dialog.Text>
                    The IP Address to change to. Please note that this only works for IPV4. IPV6 Support is coming soon.
                </Dialog.Text>
                <input type="hidden" name="_method" value="ipchange" />
                <input type="hidden" name="id" value={machine.id} />
                <input type="hidden" name="previousip" value={machine.ipAddresses[0]} />
                <Input
                    label="IP Address"
                    name="ip"
                    placeholder="Choose an IP Address"
                    defaultValue={machine.ipAddresses[0]}
                >
                </Input>
            </Dialog.Panel>
        </Dialog>
    );
}
