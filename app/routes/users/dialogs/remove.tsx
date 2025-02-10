import { X } from 'lucide-react';
import Code from '~/components/Code';
import Dialog from '~/components/Dialog';

interface Props {
	id: string;
	username: string;
}

export default function Remove({ id, username }: Props) {
	return (
		<Dialog>
			<Dialog.IconButton label={`Delete ${username}`}>
				<X className="p-0.5" />
			</Dialog.IconButton>
			<Dialog.Panel>
				<Dialog.Title>Delete {username}?</Dialog.Title>
				<Dialog.Text className="mb-8">
					Are you sure you want to delete {username}? A deleted user cannot be
					recovered.
				</Dialog.Text>
				<input type="hidden" name="_method" value="delete" />
				<input type="hidden" name="username" value={id} />
			</Dialog.Panel>
		</Dialog>
	);
}
