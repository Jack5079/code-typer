#!/usr/bin/env node
import { get } from 'https'

/**
 * @param {string} url
 */
const json = url => new Promise((resolve, reject) => {
  let val = ''
  get({
    hostname: 'api.github.com',
    port: 443,
    path: url,
    headers: {
      'User-Agent': 'hacker-typer'
    }
  },res => {
    res.on('data', chunk => {
    val += chunk.toString()
    })
    res.on('end', () => resolve(JSON.parse(val)))
  }).on('error', reject)
})

console.log("   ____          _        _____                      \n  / ___|___   __| | ___  |_   _|   _ _ __   ___ _ __ \n | |   / _ \\ / _` |/ _ \\   | || | | | '_ \\ / _ \\ '__|\n | |__| (_) | (_| |  __/   | || |_| | |_) |  __/ |   \n  \\____\\___/ \\__,_|\\___|   |_| \\__, | .__/ \\___|_|   \n                               |___/|_|              \n")
console.log('Press any key to start. You can also press ` to make the program choose another snippet.')

var currentCode = ''
/**
* 
 * @param {string} key 
 */
async function write (key) {
  // ctrl-c ( end of text )
  if (key === '\u0003') {
    return process.exit(0)
  }
  if (!currentCode || key === '`') {
    console.log('\n \x1B[3mFinding a file...\x1B[23m')
    const { items } = await json('/search/code?q=user:Jack5079%20' + encodeURIComponent(['js', 'cjs', 'mjs', 'css', 'lua', 'ts', 'tsx',].map(str => 'extension:' + str).join(' ')))
      // .then(res => res.json())
    currentCode = await json(items[Math.floor(Math.random() * items.length)].url.replace('https://api.github.com', ''))
      // .then(res => res.json())
      .then(({ content }) => Buffer.from(content, 'base64').toString())
    process.stdout.write('c')
  } else {
    process.stdout.write(currentCode[0] || '') // write the first charater of the string to stdout
    currentCode = currentCode.substring(1, Infinity) // remove the first character
  }
}

process.stdin
  .setRawMode(true)
  .resume()
  .setEncoding('utf8')
  .on('data', write)
