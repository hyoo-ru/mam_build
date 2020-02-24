const core = require( '@actions/core' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

//////////////////////////////////////////

const root = process.cwd()
console.log( 'root' , root )

const mod = core.getInput('module', {required: true});
console.log( 'module' , mod )

const pack = core.getInput('package', {required: false});
console.log( 'package' , mod )

const repo = process.env.GITHUB_REPOSITORY
console.log( 'repo' , repo )

const ref = process.env.GITHUB_SHA
console.log( 'ref' , ref )

mam:
exec( root , 'git' , 'clone' , '--branch' , 'master' , 'https://github.com/eigenmethod/mam.git' , '.' )

pack:
exec( root , 'git' , 'clone' , '--branch' , ref , `https://github.com/${repo}.git` , pack )

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
