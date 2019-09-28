const core = require( '@actions/core' )
const github = require( '@actions/github' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

const module = core.getInput('module', {required: true});
const repo = process.cwd()
const root = path.dirname( repo )
const target = root + '/' + module

fs.mkdirSync( path.dirname( target ) , { recursive: true } )
fs.renameSync( repo , target )
exec( root , 'yarn' )
exec( root , 'yarn' , 'start' , module )
fs.renameSync( target + '/-' , repo + '/-' )

function exec( dir , command , ...args ) {

		let [ app , ... args0 ] = command.split( ' ' )
		args = [ ... args0 , ... args ]

		console.info( `${ path.relative( '' , dir ) }> ${app} ${ args.join( ' ' ) }` )

		var res = child.spawnSync(
			app ,
			args,
			{
				cwd : path.resolve( dir ) ,
				shell : true ,
			}
		)
		
		if( res.status || res.error ) throw ( res.error || new Error( res.stderr.toString() )
		if( !res.stdout ) res.stdout = new Buffer('')

		return res
    
}
