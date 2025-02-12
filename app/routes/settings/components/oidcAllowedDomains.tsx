import { useFetcher } from 'react-router';
import Button from '~/components/Button';
import TableList from '~/components/TableList';
import cn from '~/utils/cn';
import Dialog from '~/components/Dialog';
import Spinner from '~/components/Spinner';
import AddAllowedDomain from '../dialogs/allowedDomains';

type Properties = {
	readonly disabled?: boolean;
	readonly allowed_domains: string[];
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ disabled, allowed_domains }: Properties) {
	const fetcher = useFetcher();

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<h1 className="text-2xl font-medium mb-2">OIDC Domain Settings</h1>
			<p>
				Configure OIDC Domain Settings
			</p>
			<div className="mt-4">
				<h2 className="text-2xl font-medium mb-4">Allowed Domains</h2>
				<TableList className="mb-8">
					{allowed_domains.length === 0 ? (
						<TableList.Item>
							<p className="opacity-50 mx-auto">No allowed domain. All will be allowed.</p>
						</TableList.Item>
					) : (
						allowed_domains.map((allowed_domain, index) => (
							<TableList.Item key={`${allowed_domain}`}>
								<div className="flex gap-24 items-center">
									<div className="flex gap-4 items-center">
										<p className="font-mono text-sm">{allowed_domain}</p>
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
					Change Domains Settings
				</Dialog.Button>
				<Dialog.Panel>
					<Dialog.Title>Change Domains Settings</Dialog.Title>
					<Dialog.Text>
						Keep in mind that changing this can break ODIC authentication if configured improperly.
					</Dialog.Text>
					<div className="mt-4">
					<h2 className="text-2xl font-medium mb-4">Allowed Domains</h2>
					<TableList className="mb-8">
						{allowed_domains.length === 0 ? (
							<TableList.Item>
								<p className="opacity-50 mx-auto">No allowed domain. All will be allowed.</p>
							</TableList.Item>
						) : (
							allowed_domains.map((allowed_domain, index) => (
								<TableList.Item key={`${allowed_domain}`}>
									<div className="flex gap-24 items-center">
										<div className="flex gap-4 items-center">
											<p className="font-mono text-sm">{allowed_domain}</p>
										</div>
									</div>
									<Button
										className={cn(
											'px-2 py-1 rounded-md',
											'text-red-500 dark:text-red-400',
										)}
										isDisabled={disabled}
										onPress={() => {
											fetcher.submit(
												{
													'oidc.allowed_domains': allowed_domains.filter(
														(_, i) => i !== index,
													),
												},
												{
													method: 'PATCH',
													encType: 'application/json',
												},
											);
										}}
									>
										Remove
									</Button>
								</TableList.Item>
							))
						)}
					</TableList>
					{disabled ? undefined : <AddAllowedDomain records={allowed_domains} />}
				</div>
				</Dialog.Panel>
			</Dialog>
		</div>
	);
}
