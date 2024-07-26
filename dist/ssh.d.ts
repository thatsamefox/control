type Values = (string | string[] | Promise<string> | Promise<string[]>)[];
export type RemoteShell = {
    (pieces: TemplateStringsArray, ...values: Values): Promise<Response>;
    with(config: Partial<SshConfig>): RemoteShell;
    exit(): void;
    check(): boolean;
    test(pieces: TemplateStringsArray, ...values: Values): Promise<boolean>;
    cd(path: string): void;
};
export type SshConfig = {
    remoteUser: string;
    hostname: string;
    port?: number | string;
    shell: string;
    prefix: string;
    cwd?: string;
    nothrow: boolean;
    multiplexing: boolean;
    verbose: boolean;
    become?: string;
    env: Record<string, string>;
    ssh: SshOptions;
};
export declare function ssh(partial: Partial<SshConfig>): RemoteShell;
export declare function sshArgs(config: Partial<SshConfig>): string[];
export declare class Response extends String {
    readonly command: string;
    readonly location: string;
    readonly exitCode: number | null;
    readonly stdout: string;
    readonly stderr: string;
    readonly error?: Error | undefined;
    constructor(command: string, location: string, exitCode: number | null, stdout: string, stderr: string, error?: Error | undefined);
}
export declare function composeCmd(pieces: TemplateStringsArray, values: Values): Promise<string>;
type SshOptions = {
    [key in AvailableOptions]?: string;
};
type AvailableOptions = 'AddKeysToAgent' | 'AddressFamily' | 'BatchMode' | 'BindAddress' | 'CanonicalDomains' | 'CanonicalizeFallbackLocal' | 'CanonicalizeHostname' | 'CanonicalizeMaxDots' | 'CanonicalizePermittedCNAMEs' | 'CASignatureAlgorithms' | 'CertificateFile' | 'ChallengeResponseAuthentication' | 'CheckHostIP' | 'Ciphers' | 'ClearAllForwardings' | 'Compression' | 'ConnectionAttempts' | 'ConnectTimeout' | 'ControlMaster' | 'ControlPath' | 'ControlPersist' | 'DynamicForward' | 'EscapeChar' | 'ExitOnForwardFailure' | 'FingerprintHash' | 'ForwardAgent' | 'ForwardX11' | 'ForwardX11Timeout' | 'ForwardX11Trusted' | 'GatewayPorts' | 'GlobalKnownHostsFile' | 'GSSAPIAuthentication' | 'GSSAPIDelegateCredentials' | 'HashKnownHosts' | 'Host' | 'HostbasedAcceptedAlgorithms' | 'HostbasedAuthentication' | 'HostKeyAlgorithms' | 'HostKeyAlias' | 'Hostname' | 'IdentitiesOnly' | 'IdentityAgent' | 'IdentityFile' | 'IPQoS' | 'KbdInteractiveAuthentication' | 'KbdInteractiveDevices' | 'KexAlgorithms' | 'KnownHostsCommand' | 'LocalCommand' | 'LocalForward' | 'LogLevel' | 'MACs' | 'Match' | 'NoHostAuthenticationForLocalhost' | 'NumberOfPasswordPrompts' | 'PasswordAuthentication' | 'PermitLocalCommand' | 'PermitRemoteOpen' | 'PKCS11Provider' | 'Port' | 'PreferredAuthentications' | 'ProxyCommand' | 'ProxyJump' | 'ProxyUseFdpass' | 'PubkeyAcceptedAlgorithms' | 'PubkeyAuthentication' | 'RekeyLimit' | 'RemoteCommand' | 'RemoteForward' | 'RequestTTY' | 'SendEnv' | 'ServerAliveInterval' | 'ServerAliveCountMax' | 'SetEnv' | 'StreamLocalBindMask' | 'StreamLocalBindUnlink' | 'StrictHostKeyChecking' | 'TCPKeepAlive' | 'Tunnel' | 'TunnelDevice' | 'UpdateHostKeys' | 'UseKeychain' | 'User' | 'UserKnownHostsFile' | 'VerifyHostKeyDNS' | 'VisualHostKey' | 'XAuthLocation';
export {};
