import { useMemo, useState } from 'react';
import { useSubmit } from 'react-router';
import Code from '~/components/Code';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';

interface Props {
	records: string[];
}

export default function AddAllowedDomain({ records }: Props) {
	const submit = useSubmit();
	const [domain, setDomain] = useState('');

	const isDuplicate = useMemo(() => {
		if (domain.length === 0) return false;
		const lookup = records.find((record) => record === domain);
		if (!lookup) return false;

		return lookup === domain;
	}, [records, domain]);

	// TODO: Ditch useSubmit here (non JSON form)
	return (
		<Dialog>
			<Dialog.Button>Add Allowed Domain</Dialog.Button>
			<Dialog.Panel
				onSubmit={(event) => {
					event.preventDefault();
					if (!domain) return;

					setDomain('');
					submit(
						{
							'oidc.allowed_domains': [
								...records,
								domain
							],
						},
						{
							method: 'PATCH',
							encType: 'application/json',
						},
					);
				}}
			>
				<Dialog.Title>Add Allowed Domains</Dialog.Title>
				<Dialog.Text>
					Enter the domain to allow OCID to authenticate users from.
				</Dialog.Text>
				<div className="flex flex-col gap-2 mt-4">
					<Input
						isRequired
						label="Domain"
						placeholder="test.example.com"
						onChange={setDomain}
						isInvalid={isDuplicate}
					/>
					{isDuplicate ? (
						<p className="text-sm opacity-50">
							A record with the domain name <Code>{domain}</Code> already exists.
						</p>
					) : undefined}
				</div>
			</Dialog.Panel>
		</Dialog>
	);
}
