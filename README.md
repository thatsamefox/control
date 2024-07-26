# Control

```js
const context = createHost({hostname: '192.168.10.105'})

task('test', async ({$}) => {
  const answ = ask('Enter command: ', 'lsb_release -a')
  const ver = await $.with({nothrow: true})`${answ}`
  console.log(`Version of remote is: ${ver}`)
  console.log(ver)
})

startSpinner()
try {
  await runTask('test', context)
} finally {
  stopSpinner()
}

```

## Installation

```sh
npm install https://github.com/thatsamefox/control
```

## Usage

### ssh()

```js
ssh('user@host', {port: 22, options: ['StrictHostKeyChecking=no']})
```

## License

[MIT](LICENSE)
