import DangerAddressSettingsModal from './dangerAddressSettings';
import DangerSubnetSettingsModal from './dangerSubnetSettings';

type Properties = {
    // Global
    readonly disabled?: boolean;
    // DangerAddressSettingsModal
	readonly server_url: string;
    readonly listen_address: string;
    readonly metrics_listen_address: string;
    // DangerSubnetSettingsModal
    readonly ipv4: string;
    readonly ipv6: string;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ server_url, listen_address, metrics_listen_address, disabled, ipv4, ipv6 }: Properties) {

	return (
		<div className="flex flex-col w-2/3 gap-y-4">
			<h1 className="text-2xl font-medium mb-2">Danger Settings</h1>
            <p className="text-sm text-gray-500">These settings are dangerous and should be changed with caution.</p>
			<DangerAddressSettingsModal server_url={server_url} listen_address={listen_address} metrics_listen_address={metrics_listen_address} disabled={disabled}></DangerAddressSettingsModal>
            <DangerSubnetSettingsModal ipv4={ipv4} ipv6={ipv6} disabled={disabled}></DangerSubnetSettingsModal>
		</div>	
	);
}
