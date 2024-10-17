import { createHost } from './host.js';
import { ask } from './prompt.js';
import { startSpinner, stopSpinner } from './spinner.js';
import { runTask, task } from './task.js';
const context = createHost({ hostname: '192.168.10.105' });
task('test', async ({ $ }) => {
    const answ = ask('Enter command: ', 'lsb_release -a');
    const ver = await $.with({ nothrow: true }) `${answ}`;
    console.log(`Version of remote is: ${ver}`);
    console.log(ver);
});
startSpinner();
try {
    await runTask('test', context);
}
finally {
    stopSpinner();
}
