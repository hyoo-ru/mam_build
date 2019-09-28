const core = require( '@actions/core' )
const github = require( '@actions/github' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

const mod = core.getInput('module', {required: true});
console.log( 'mod' , mod )

const repo = process.cwd()
console.log( 'repo' , repo )

const root = path.dirname( repo )
console.log( 'root' , root )

const mam = root + '/mam'
console.log( 'mam' , mam )

const build = mam + '/' + mod
console.log( 'build' , build )

// prepare sources
exec( root , 'git' , 'clone' , 'https://github.com/eigenmethod/mam.git' )
fs.mkdirSync( path.dirname( build ) , { recursive: true } )
fs.renameSync( repo , build )

// build
exec( mam , 'yarn' )
exec( mam , 'yarn' , 'start' , mod )
fs.renameSync( build + '/-' , repo + '/-' )

function exec( dir , command , ...args ) {

		let [ app , ... args0 ] = command.split( ' ' )
		args = [ ... args0 , ... args ]

		console.info( `${ dir }> ${app} ${ args.join( ' ' ) }` )

		var res = child.spawnSync(
			app ,
			args,
			{
				cwd : path.resolve( dir ) ,
				shell : true ,
			}
		)
		
		if( res.status || res.error ) throw ( res.error || new Error( res.stderr.toString() ) )
		if( !res.stdout ) res.stdout = new Buffer('')

		return res
    
}
