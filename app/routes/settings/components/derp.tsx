import DerpServerModal from './derpServer';

type Properties = {
    // Global
    readonly disabled?: boolean;
    // Server
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
export default function Modal({ disabled, enabled, region_id, region_code, region_name, stun_listen_addr, private_key_path, automatically_add_embedded_derp_region, ipv4, ipv6 }: Properties) {

    return (
        <div className="flex flex-col w-2/3 gap-y-4">
            <h1 className="text-2xl font-medium mb-2">DERP Settings</h1>
            <p className="text-gray-500">DERP is a relay system that Tailscale uses when a direct connection cannot be established.</p>
            <DerpServerModal enabled={enabled} region_id={region_id} region_code={region_code} region_name={region_name} stun_listen_addr={stun_listen_addr} private_key_path={private_key_path} automatically_add_embedded_derp_region={automatically_add_embedded_derp_region} ipv4={ipv4} ipv6={ipv6} disabled={disabled} />
        </div>	
    );
}
