import { MessagePort } from 'node:worker_threads';

type ScopedImport = (specifier: string, parent: string) => Promise<any>;

type TsconfigOptions = false | string;
type InitializationOptions = {
    namespace?: string;
    port?: MessagePort;
    tsconfig?: TsconfigOptions;
};
type RegisterOptions = {
    namespace?: string;
    onImport?: (url: string) => void;
    tsconfig?: TsconfigOptions;
};
type Unregister = () => Promise<void>;
type NamespacedUnregister = Unregister & {
    import: ScopedImport;
    unregister: Unregister;
};
type Register = {
    (options: RegisterOptions & {
        namespace: string;
    }): NamespacedUnregister;
    (options?: RegisterOptions): Unregister;
};
declare const register: Register;

type Options = {
    parentURL: string;
    onImport?: (url: string) => void;
    tsconfig?: TsconfigOptions;
};
declare const tsImport: (specifier: string, options: string | Options) => Promise<any>;

export { register, tsImport };
export type { InitializationOptions, NamespacedUnregister, Register, RegisterOptions, ScopedImport, Unregister };
