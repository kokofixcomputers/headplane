import OtherRandomizeClientPortModal from './otherRandomizeClientPort';
import OtherDisableCheckUpdatesModal from './otherDisableCheckUpdate';

type Properties = {
    // Global
    readonly disabled?: boolean;
    // OtherRandomizeClientPortModal
    readonly randomize: boolean;
    // OtherDisableCheckUpdatesModal
    readonly disable_check_updates: boolean;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ randomize, disable_check_updates, disabled }: Properties) {

    return (
        <div className="flex flex-col w-2/3 gap-y-4">
            <h1 className="text-2xl font-medium mb-2">Other Settings</h1>
            <OtherRandomizeClientPortModal randomize={randomize} disabled={disabled}></OtherRandomizeClientPortModal>
            <OtherDisableCheckUpdatesModal disable_check_updates={disable_check_updates} disabled={disabled}></OtherDisableCheckUpdatesModal>
        </div>	
    );
}
