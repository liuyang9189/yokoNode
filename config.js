var path = require('path');

exports.config = {
	name: '欢迎光临yoko的前端技术论坛',
	description: '111111111111',
	keywords: '22222222222222',
	favicon: '/public/favicon.ico',
	//Service
	port: 1000,
	session_secret: 'NODECMS',
    datapath: path.join(__dirname, '/public/data/img')
};