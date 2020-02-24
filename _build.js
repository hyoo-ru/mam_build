const core = require( '@actions/core' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

//////////////////////////////////////////

const mam = process.cwd()
console.log( 'root' , repo )

const mod = core.getInput('module', {required: true});
console.log( 'module' , mod )

// build
exec( mam , 'yarn' , '--ignore-optional' )
exec( mam , 'yarn' , 'start' , mod )
exec( mam , 'node' , `${mod}/-/node.test.js` )

// return files
if( fs.existsSync( `${mam}/${mod}/CNAME` ) ) {
	fs.copyFileSync( `${mam}/${mod}/CNAME` , `${mam}/${mod}/-/CNAME` )
}
fs.writeFileSync( `${mam}/${mod}/-/.nojekyll` , '' )

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
