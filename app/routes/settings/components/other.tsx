import OtherRandomizeClientPortModal from './otherRandomizeClientPort';

type Properties = {
    // Global
    readonly disabled?: boolean;
    // OtherRandomizeClientPortModal
    readonly randomize: boolean;
};


// TODO: Switch to form submit instead of JSON patch
export default function Modal({ randomize, disabled }: Properties) {

    return (
        <div className="flex flex-col w-2/3 gap-y-4">
            <h1 className="text-2xl font-medium mb-2">Danger Settings</h1>
            <p className="text-sm text-gray-500">These settings are dangerous and should be changed with caution.</p>
            <OtherRandomizeClientPortModal randomize={randomize} disabled={disabled}></OtherRandomizeClientPortModal>
        </div>	
    );
}
