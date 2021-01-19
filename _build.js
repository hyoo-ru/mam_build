const core = require( '@actions/core' )
const path = require( 'path' )
const child = require( 'child_process' )
const fs = require( 'fs' )

//////////////////////////////////////////

console.log( 'env' , process.env )

const event = JSON.parse( fs.readFileSync( process.env.GITHUB_EVENT_PATH ) )
console.log( 'event' , event )

const root = process.cwd()
console.log( 'root' , root )

const package = core.getInput('package', {required: true})
console.log( 'package' , package )

let modules = core.getInput('modules', {required: false})
modules = modules ? modules.split(' ').map( mod => `${package}/${mod}` ) : [ package ]
console.log( 'modules' , modules )

const repository = event.pull_request && event.pull_request.head.repo.full_name || process.env.GITHUB_REPOSITORY
console.log( 'repository' , repository )

//const ref = event.pull_request && event.pull_request.head.sha || process.env.GITHUB_SHA
const ref = event.ref.replace( 'refs/heads/', '' )
console.log( 'ref' , ref )

// clone mam
	exec( root , 'git' , 'clone' , '--branch' , 'master' , 'https://github.com/hyoo-ru/mam.git' , '.' )

// clone package
	exec( root , 'git' , 'clone' , '--no-checkout' , `git@github.com:${repository}.git` , package )
	exec( `${root}/${package}` , 'git' , 'checkout' , ref )

// refactor prepare
	let workflow = fs.readFileSync( package + '/.github/workflows/deploy.yml' ).toString()

// update gh pages deploy
	workflow = workflow.replace( 'uses: alex-page/blazing-fast-gh-pages-deploy@v1.0.1' , 'uses: alex-page/blazing-fast-gh-pages-deploy@v1.1.0' )

// enable manual build
	if( !/^  workflow_dispatch:$/.test( workflow ) ) {
		workflow = workflow.replace( /^on:\n/m , 'on:\n  workflow_dispatch:\n' )
	}

// refactor apply
	fs.writeFileSync( package + '/.github/workflows/deploy.yml' , workflow )

// refactor store
	exec( package, 'git', 'config', 'user.name', '"mam_build"')
	exec( package, 'git', 'config', 'user.email', '"jin@hyoo.ru"')
	exec( package, 'git', 'commit' , '-a' , '-m' , '"mam_build refactor"' )
	exec( package, 'git', 'push' )

// install dependencies
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

		if (res.status || res.error) {
			console.error( res.error )
			process.exit(res.status || 1)
		}

}
