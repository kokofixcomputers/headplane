import { useState } from 'react';
import { useFetcher } from 'react-router';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import Spinner from '~/components/Spinner';
import Card from '~/components/Card';
import Switch from '~/components/Switch';


type Properties = {
    readonly disabled?: boolean;
	readonly enabled: boolean;
	readonly region_id: bigint;
    readonly region_code: string;
    readonly region_name: string;
    readonly stun_listen_addr: string;
    readonly private_key_path: string;
    readonly automatically_add_embedded_derp_region: boolean;
    readonly ipv4: string;
    readonly ipv6: string;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ enabled, region_id, region_code, region_name, stun_listen_addr, private_key_path, automatically_add_embedded_derp_region, ipv4, ipv6, disabled }: Properties) {
	const [newEnabled, setNewEnabled] = useState(enabled);
    const [newRegion_id, setNewRegion_id] = useState(region_id);
    const [newRegion_code, setNewRegion_code] = useState(region_code);
    const [newRegion_name, setNewRegion_name] = useState(region_name);
    const [newStun_listen_addr, setNewStun_listen_addr] = useState(stun_listen_addr);
    const [newPrivate_key_path, setNewPrivate_key_path] = useState(private_key_path);
    const [newAutomatically_add_embedded_derp_region, setNewAutomatically_add_embedded_derp_region] = useState(automatically_add_embedded_derp_region);
    const [newipv4, setNewipv4] = useState(ipv4);
    const [newipv6, setNewipv6] = useState(ipv6);
	const fetcher = useFetcher();

	return (
			<Card variant="flat" className="max-w-prose mt-12" border="border-variant-danger" darkModeBorder='dark:border-variant-danger'>
				<div className="flex items-center justify-between">
					<Card.Title className="text-xl mb-0">DERP Server Settings</Card.Title>
				</div>
				<Card.Text className="mt-4">
                    If enabled, runs the embedded DERP server and merges it into the rest of the DERP config
                    The Headscale server_url defined above MUST be using https, DERP requires TLS to be in place
                    <p className="text-yellow-600 dark:text-yellow-500">Please note that this may consume a lot of network traffic.</p>
					<div style={{ marginBottom: '10px' }}></div>
                    <div className="flex items-center justify-between">
                        <p>Enabled:</p>
                        <Switch
                            isReadOnly
                            label="Enabled"
                            defaultSelected={enabled}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="Region ID"
                        defaultValue={String(region_id)}
                        placeholder="Region ID to use for the embedded DERP server"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="Region Code"
                        defaultValue={region_code}
                        placeholder="Region code are displayed in the Tailscale UI to identify a DERP region"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="Region Name"
                        defaultValue={region_name}
                        placeholder="Region name are displayed in the Tailscale UI to identify a DERP region"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="Stun Listen Address"
                        defaultValue={stun_listen_addr}
                        placeholder="Listens over UDP at the configured address for STUN connections - to help with NAT traversal"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="Private Key Path"
                        defaultValue={private_key_path}
                        placeholder="Private key used to encrypt the traffic between headscale DERP"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <div className="flex items-center justify-between">
                        <p>Automatically Add Embedded DERP Region:</p>
                        <Switch
                            isReadOnly
                            label="Automatically Add Embedded DERP Region"
                            defaultSelected={automatically_add_embedded_derp_region}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="IPv4 Address"
                        defaultValue={ipv4}
                        placeholder="Optionally add the public IPv4 address to the Derp-Map"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
                    <div style={{ marginBottom: '10px' }}></div>
                    <Input
                        isReadOnly
                        label="IPv6 Address"
                        defaultValue={ipv6}
                        placeholder="Optionally add the public IPv6 address to the Derp-Map"
                        onFocus={(event) => {
							event.target.select();
						}}
                    />
					<div style={{ marginBottom: '10px' }}></div>

					<Dialog>
						<Dialog.Button isDisabled={disabled}>
							{fetcher.state === 'idle' ? undefined : (
								<Spinner className="w-3 h-3" />
							)}
							Change Address Settings
						</Dialog.Button>
						<Dialog.Panel variant='destructive'
							onSubmit={() => {
								fetcher.submit(
									{
										'derp.server.enabled': newEnabled,
										'derp.server.region_id': newRegion_id.toString(),
                                        'derp.server.region_code': newRegion_code,
                                        'derp.server.region_name': newRegion_name,
                                        'derp.server.stun_listen_addr': newStun_listen_addr,
                                        'derp.server.private_key_path': newPrivate_key_path,
                                        'derp.server.automatically_add_embedded_derp_region': newAutomatically_add_embedded_derp_region,
                                        'derp.server.ipv4': newipv4,
                                        'derp.server.ipv6': newipv6
									},
									{
										method: 'PATCH',
										encType: 'application/json',
									},
								);
							}}
						>
							<Dialog.Title>Change DERP Server Settings</Dialog.Title>
							<Dialog.Text>
								Keep in mind that enabling this could cause high network traffic.
							</Dialog.Text>
							<div style={{ marginBottom: '10px' }}></div>
                            <div className="flex items-center justify-between">
                                <p>Enabled:</p>
                                <Switch
                                    label="Enabled"
                                    defaultSelected={enabled}
                                    onChange={setNewEnabled}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}></div>
							<Input
								label="Region ID"
								defaultValue={String(region_id)}
								placeholder="Region ID to use for the embedded DERP server"
								onChange={(value) => setNewRegion_id(BigInt(value))}
							/>
							<div style={{ marginBottom: '10px' }}></div>
							<Input
								label="Region Code"
								defaultValue={region_code}
								placeholder="Region code are displayed in the Tailscale UI to identify a DERP region"
								onChange={setNewRegion_code}
							/>
							<div style={{ marginBottom: '10px' }}></div>
                            <Input
								label="Region Name"
								defaultValue={region_name}
								placeholder="Region name are displayed in the Tailscale UI to identify a DERP region"
								onChange={setNewRegion_name}
							/>
							<div style={{ marginBottom: '10px' }}></div>
                            <Input
								label="Stun Listen Address"
								defaultValue={stun_listen_addr}
								placeholder="Listens over UDP at the configured address for STUN connections - to help with NAT traversal"
								onChange={setNewStun_listen_addr}
							/>
							<div style={{ marginBottom: '10px' }}></div>
                            <Input
								label="Private Key Path"
								defaultValue={private_key_path}
								placeholder="Private key used to encrypt the traffic between headscale DERP"
								onChange={setNewPrivate_key_path}
							/>
							<div style={{ marginBottom: '10px' }}></div>
                            <div className="flex items-center justify-between">
                                <p>Automatically Add Embedded DERP Region:</p>
                                <Switch
                                    label="Automatically Add Embedded DERP Region"
									defaultSelected={automatically_add_embedded_derp_region}
                                    onChange={setNewAutomatically_add_embedded_derp_region}
                                />
                            </div>
							<div style={{ marginBottom: '10px' }}></div>
                            <Input
								label="IPv4 Address"
								defaultValue={ipv4}
								placeholder="Optionally add the public IPv4 address to the Derp-Map"
								onChange={setNewipv4}
							/>
							<div style={{ marginBottom: '10px' }}></div>
                            <Input
								label="IPv6 Address"
								defaultValue={ipv6}
								placeholder="Optionally add the public IPv6 address to the Derp-Map"
								onChange={setNewipv6}
							/>
							<div style={{ marginBottom: '10px' }}></div>
						</Dialog.Panel>
					</Dialog>
				</Card.Text>
			</Card>
	);
}
