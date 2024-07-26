import { ssh } from './ssh.js';
export const defaults = {};
export function update(host, key, value) {
    // @ts-ignore
    host[key] = value;
}
export function createHost(config) {
    const $ = ssh(config);
    const host = new Proxy(config, {
        async get(target, prop) {
            let value = Reflect.get(target, prop);
            if (typeof value === 'undefined') {
                if (!(prop.toString() in defaults)) {
                    throw new Error(`Property "${prop.toString()}" is not defined.`);
                }
                // @ts-ignore
                value = defaults[prop.toString()];
                if (typeof value === 'function') {
                    value = await value({ host, $, config });
                }
                // @ts-ignore
                host[prop.toString()] = value;
            }
            return value;
        },
    });
    return { config, host, $ };
}
//# sourceMappingURL=host.js.map