const core = require( '@actions/core' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

//////////////////////////////////////////

const root = process.cwd()
console.log( 'root' , root )

const mod = core.getInput('module', {required: true});
console.log( 'module' , mod )

deps:
exec( root , 'yarn' , '--ignore-optional' )

build:
exec( root , 'yarn' , 'start' , mod )

test:
exec( root , 'node' , `${mod}/-/node.test.js` )

domain:
if( fs.existsSync( `${root}/${mod}/CNAME` ) ) {
	fs.copyFileSync( `${root}/${mod}/CNAME` , `${root}/${mod}/-/CNAME` )
}

jekyll:
fs.writeFileSync( `${root}/${mod}/-/.nojekyll` , '' )

//////////////////////////////////////////

function exec( dir , command , ...args ) {

		let [ app , ... args0 ] = command.split( ' ' )
		args = [ ... args0 , ... args ]

		console.info( `${ dir }> ${app} ${ args.join( ' ' ) }` )

		const res = child.spawnSync(
			app ,
			args,
			{
				cwd : path.resolve( dir ) ,
				stdio: 'inherit',
				shell : true ,
			}
		)

		if (res.status || res.error) process.exit(res.status || 1)

}
