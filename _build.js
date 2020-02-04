const core = require( '@actions/core' )
const github = require( '@actions/github' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

const mod = core.getInput('module', {required: true});
console.log( 'mod' , mod )

const pack = core.getInput('package', {required: false}) || mod;
console.log( 'pack' , pack )

const repo = process.cwd()
console.log( 'repo' , repo )

const root = path.dirname( repo )
console.log( 'root' , root )

const mam = root + '/mam'
console.log( 'mam' , mam )

const package = mam + '/' + pack
console.log( 'package' , package )

const build = mam + '/' + mod
console.log( 'build' , build )

// prepare sources
exec( root , 'git' , 'clone' , 'https://github.com/eigenmethod/mam.git' )
fs.mkdirSync( path.dirname( package ) , { recursive: true } )
fs.renameSync( repo , package )

// build
exec( mam , 'yarn' , '--ignore-optional' )
exec( mam , 'yarn' , 'start' , mod )
exec( mam , 'node' , `${mod}/-/node.test.js` )

// return files
if( fs.existsSync( build + '/CNAME' ) ) {
	fs.copyFileSync( build + '/CNAME' , build + '/-/CNAME' )
}
fs.writeFileSync( build + '/-/.nojekyll' , '' )
fs.renameSync( build + '/-' , repo )

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
