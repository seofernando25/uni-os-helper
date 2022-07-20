import { publish } from 'gh-pages';

publish(
	'build', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/SeoFernando25/uni-os-helper.git'
	},
	() => {
		console.log('Deploy Complete!');
	}
);
