const core = require( '@actions/core' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

//////////////////////////////////////////

const event = JSON.parse( fs.readFileSync( process.env.GITHUB_EVENT_PATH ) )

const root = process.cwd()
console.log( 'root' , root )

const package = core.getInput('package', {required: true})
console.log( 'package' , package )

let modules = core.getInput('modules', {required: false})
modules = modules ? modules.split(' ').map( mod => `${package}/${mod}` ) : [ package ]
console.log( 'modules' , modules )

const repository = event.pull_request && event.pull_request.head.repo.full_name || process.env.GITHUB_REPOSITORY
console.log( 'repository' , repository )

const ref = event.pull_request && event.pull_request.head.sha || process.env.GITHUB_SHA
console.log( 'ref' , ref )

mam:
exec( root , 'git' , 'clone' , '--branch' , 'master' , 'https://github.com/hyoo-ru/mam.git' , '.' )

pack:
exec( root , 'git' , 'clone' , '--no-checkout' , `https://github.com/${repository}.git` , package )
exec( `${root}/${package}` , 'git' , 'checkout' , ref )

deps:
exec( root , 'yarn' , '--ignore-optional' )

for( const mod of modules ) {

	build:
	exec( root , 'yarn' , 'start' , mod )

	domain:
	if( fs.existsSync( `${root}/${mod}/CNAME` ) ) {
		fs.copyFileSync( `${root}/${mod}/CNAME` , `${root}/${mod}/-/CNAME` )
	}

	jekyll:
	fs.writeFileSync( `${root}/${mod}/-/.nojekyll` , '' )

}

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
